import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useCallback, useEffect, useState } from 'react';

import {
  fetchOwnedProductIds,
  fetchProductPrices,
  isStoreAvailable,
  purchaseProduct,
  type PurchaseResult,
} from '../data/purchaseService';
import { getProductsForTheme, isThemeUnlocked, PREMIUM_PRODUCTS, type ProductId } from '../data/themeAccess';
import type { ThemeId } from '../domain/types';

const STORAGE_KEY = 'palavra-proibida:owned-products';

const parseStoredProducts = (saved: string | null): ProductId[] => {
  const parsed: unknown = saved ? JSON.parse(saved) : [];
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
};

const saveProducts = async (productIds: ProductId[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  } catch (error) {
    Sentry.captureException(error, { tags: { area: 'owned-products-save' } });
  }
};

/**
 * Produtos comprados pelo usuário.
 * Carrega na abertura do app (durante o splash): primeiro o cache local,
 * depois consulta a loja via `fetchOwnedProductIds` e atualiza o cache.
 * `isHydrated` fica true quando o carregamento termina (com sucesso ou não).
 */
export const useOwnedProducts = () => {
  const [ownedProductIds, setOwnedProductIds] = useState<ProductId[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const cached = parseStoredProducts(await AsyncStorage.getItem(STORAGE_KEY));
        if (isMounted) {
          setOwnedProductIds(cached);
        }
      } catch (error) {
        Sentry.captureException(error, { tags: { area: 'owned-products-load-cache' } });
      }

      try {
        const fromStore = await fetchOwnedProductIds();
        if (isMounted && fromStore) {
          const unique = [...new Set(fromStore)];
          setOwnedProductIds(unique);
          await saveProducts(unique);
        }
      } catch (error) {
        // Offline/erro na loja: mantém o cache local.
        Sentry.captureException(error, { tags: { area: 'owned-products-load-store' } });
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const setOwnedProducts = useCallback(async (productIds: ProductId[]) => {
    const unique = [...new Set(productIds)];
    setOwnedProductIds(unique);
    await saveProducts(unique);
  }, []);

  const addOwnedProduct = useCallback(
    (productId: ProductId) => setOwnedProducts([...ownedProductIds, productId]),
    [ownedProductIds, setOwnedProducts],
  );

  const isThemeLocked = useCallback(
    (themeId: ThemeId) => !isThemeUnlocked(themeId, ownedProductIds),
    [ownedProductIds],
  );

  // Preços da loja (carregados uma vez, em segundo plano).
  const [productPrices, setProductPrices] = useState<Record<ProductId, string>>({});

  useEffect(() => {
    const allProductIds = PREMIUM_PRODUCTS.map((product) => product.productId);

    fetchProductPrices(allProductIds)
      .then(setProductPrices)
      .catch((error: unknown) => {
        Sentry.captureException(error, { tags: { area: 'product-prices-load' } });
      });
  }, []);

  /** Preço do primeiro produto que libera o tema (ou undefined se ainda não carregou). */
  const getThemePrice = useCallback(
    (themeId: ThemeId): string | undefined => {
      const [productId] = getProductsForTheme(themeId);
      return productId ? productPrices[productId] : undefined;
    },
    [productPrices],
  );

  /** Compra o produto que libera o tema e, se aprovado, libera na hora. */
  const buyTheme = useCallback(
    async (themeId: ThemeId): Promise<PurchaseResult> => {
      const [productId] = getProductsForTheme(themeId);
      if (!productId) {
        return 'error';
      }

      try {
        const result = await purchaseProduct(productId);
        if (result === 'purchased') {
          await addOwnedProduct(productId);
        }
        return result;
      } catch (error) {
        Sentry.captureException(error, { tags: { area: 'purchase' } });
        return 'error';
      }
    },
    [addOwnedProduct],
  );

  return {
    ownedProductIds,
    isHydrated,
    isThemeLocked,
    canPurchase: isStoreAvailable,
    getThemePrice,
    buyTheme,
    addOwnedProduct,
    setOwnedProducts,
  };
};
