import { Platform } from 'react-native';
import { getAvailablePurchases, initConnection } from 'expo-iap';

import type { ProductId } from './themeAccess';

/**
 * Ponto único de integração com a loja (Google Play Billing via expo-iap).
 *
 * Retorna os productIds comprados pelo usuário, ou `null` quando a loja
 * não pôde ser consultada (web, erro, offline) — nesse caso o app usa o
 * cache local salvo no AsyncStorage.
 */
export const fetchOwnedProductIds = async (): Promise<ProductId[] | null> => {
  if (Platform.OS !== 'android') {
    return null;
  }

  const isConnected = await initConnection();
  if (!isConnected) {
    return null;
  }

  const purchases = await getAvailablePurchases();
  return purchases.map((purchase) => purchase.productId);
};
