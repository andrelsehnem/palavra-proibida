import { Platform } from 'react-native';
import {
  ErrorCode,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type Purchase,
} from 'expo-iap';

import type { ProductId } from './themeAccess';

/**
 * Ponto único de integração com a loja (Google Play Billing via expo-iap).
 * Todos os produtos são "produtos únicos" não consumíveis (comprou, é seu para sempre).
 */

export type PurchaseResult = 'purchased' | 'pending' | 'cancelled' | 'error';

export const isStoreAvailable = Platform.OS === 'android';

let connectionPromise: Promise<boolean> | null = null;

const ensureConnected = async (): Promise<boolean> => {
  if (!isStoreAvailable) {
    return false;
  }

  if (!connectionPromise) {
    connectionPromise = initConnection().catch((error: unknown) => {
      connectionPromise = null;
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

  await finishTransaction({ purchase, isConsumable: false });
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

  const purchases = await getAvailablePurchases();
  const completed = purchases.filter((purchase) => purchase.purchaseState === 'purchased');

  await Promise.all(completed.map((purchase) => acknowledgeIfNeeded(purchase).catch(() => undefined)));

  return completed.map((purchase) => purchase.productId);
};

/** Preço formatado pela loja (moeda do usuário), por productId. */
export const fetchProductPrices = async (productIds: ProductId[]): Promise<Record<ProductId, string>> => {
  if (productIds.length === 0 || !(await ensureConnected())) {
    return {};
  }

  const products = await fetchProducts({ skus: productIds, type: 'in-app' });
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

    const updatedSubscription = purchaseUpdatedListener((purchase) => {
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
        .catch(() => settle('purchased'));
    });

    const errorSubscription = purchaseErrorListener((error) => {
      settle(error.code === ErrorCode.UserCancelled ? 'cancelled' : 'error');
    });

    requestPurchase({
      request: { google: { skus: [productId] } },
      type: 'in-app',
    }).catch(() => settle('error'));
  });
};
