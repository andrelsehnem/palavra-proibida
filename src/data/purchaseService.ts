import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import type { Purchase } from 'expo-iap';

import type { ProductId } from './themeAccess';

/**
 * Ponto único de integração com a loja (Google Play Billing via expo-iap).
 * Todos os produtos são "produtos únicos" não consumíveis (comprou, é seu para sempre).
 */

export type PurchaseResult = 'purchased' | 'pending' | 'cancelled' | 'error';

type ExpoIap = typeof import('expo-iap');

/** Carrega o expo-iap só se o módulo nativo existir (no Expo Go ele não existe). */
const loadIap = (): ExpoIap | null => {
  if (Platform.OS !== 'android') {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-iap') as ExpoIap;
  } catch {
    return null;
  }
};

const iap = loadIap();

export const isStoreAvailable = iap !== null;

const reportStoreError = (stage: string, error: unknown, extra?: Record<string, unknown>) => {
  const details = error as { code?: unknown; message?: unknown; responseCode?: unknown; debugMessage?: unknown };
  Sentry.captureException(error instanceof Error ? error : new Error(`IAP ${stage}: ${String(details?.message ?? error)}`), {
    tags: { area: 'iap', iapStage: stage, iapCode: String(details?.code ?? 'unknown') },
    extra: { ...extra, code: details?.code, message: details?.message, responseCode: details?.responseCode, debugMessage: details?.debugMessage },
  });
};

let connectionPromise: Promise<boolean> | null = null;

const ensureConnected = async (): Promise<boolean> => {
  if (!iap) {
    return false;
  }

  if (!connectionPromise) {
    connectionPromise = iap.initConnection().catch((error: unknown) => {
      connectionPromise = null;
      reportStoreError('initConnection', error);
      throw error;
    });
  }

  return connectionPromise;
};

/** Confirma a compra na loja. Sem isso o Google reembolsa em 3 dias. */
const acknowledgeIfNeeded = async (purchase: Purchase) => {
  if (purchase.purchaseState !== 'purchased') {
    return;
  }

  if ('isAcknowledgedAndroid' in purchase && purchase.isAcknowledgedAndroid) {
    return;
  }

  await iap!.finishTransaction({ purchase, isConsumable: false });
};

/**
 * Retorna os productIds comprados, ou `null` quando a loja não pôde ser
 * consultada (web, erro, offline) — nesse caso o app usa o cache local.
 * Também confirma compras que ficaram sem confirmação (ex.: app fechou no meio).
 */
export const fetchOwnedProductIds = async (): Promise<ProductId[] | null> => {
  if (!(await ensureConnected())) {
    return null;
  }

  const purchases = await iap!.getAvailablePurchases();
  const completed = purchases.filter((purchase) => purchase.purchaseState === 'purchased');

  await Promise.all(completed.map((purchase) => acknowledgeIfNeeded(purchase).catch(() => undefined)));

  return completed.map((purchase) => purchase.productId);
};

/** Preço formatado pela loja (moeda do usuário), por productId. */
export const fetchProductPrices = async (productIds: ProductId[]): Promise<Record<ProductId, string>> => {
  if (productIds.length === 0 || !(await ensureConnected())) {
    return {};
  }

  const products = await iap!.fetchProducts({ skus: productIds, type: 'in-app' });
  const found = new Set((products ?? []).map((product) => product.id));
  const missing = productIds.filter((id) => !found.has(id));
  if (missing.length > 0) {
    // Produto não retornado pela Play: inativo, id errado ou app não instalado pela loja.
    reportStoreError('fetchProducts', new Error(`Produtos não encontrados na Play: ${missing.join(', ')}`), { missing });
  }
  const prices: Record<ProductId, string> = {};

  for (const product of products ?? []) {
    if ('displayPrice' in product) {
      prices[product.id] = product.displayPrice;
    }
  }

  return prices;
};

/** Abre a tela de compra do Google Play e espera o resultado. */
export const purchaseProduct = async (productId: ProductId): Promise<PurchaseResult> => {
  if (!(await ensureConnected())) {
    return 'error';
  }
  const store = iap!;

  return new Promise<PurchaseResult>((resolve) => {
    let settled = false;

    const settle = (result: PurchaseResult) => {
      if (settled) {
        return;
      }

      settled = true;
      updatedSubscription.remove();
      errorSubscription.remove();
      resolve(result);
    };

    const updatedSubscription = store.purchaseUpdatedListener((purchase) => {
      if (purchase.productId !== productId) {
        return;
      }

      if (purchase.purchaseState === 'pending') {
        // Pagamento pendente (ex.: boleto). Liberado depois, na próxima consulta de compras.
        settle('pending');
        return;
      }

      acknowledgeIfNeeded(purchase)
        .then(() => settle('purchased'))
        // A compra existe mesmo se a confirmação falhar; ela é refeita na próxima abertura.
        .catch((error: unknown) => {
          reportStoreError('finishTransaction', error, { productId });
          settle('purchased');
        });
    });

    const errorSubscription = store.purchaseErrorListener((error) => {
      if (error.code === store.ErrorCode.UserCancelled) {
        settle('cancelled');
        return;
      }
      reportStoreError('purchaseError', error, { productId });
      settle('error');
    });

    store
      .requestPurchase({
        request: { google: { skus: [productId] } },
        type: 'in-app',
      })
      .catch((error: unknown) => {
        reportStoreError('requestPurchase', error, { productId });
        settle('error');
      });
  });
};
