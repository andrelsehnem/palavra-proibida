import type { ThemeId } from '../domain/types';

/**
 * Catálogo de acesso aos grupos (temas) de palavras.
 *
 * - FREE_THEME_IDS: temas liberados para todos.
 * - PREMIUM_PRODUCTS: produtos da Play Store e quais temas cada um desbloqueia.
 *   Um tema pode estar em mais de um produto (ex.: pacote avulso + "pacote completo").
 *
 * Os IDs de tema são as chaves usadas em words.json (iguais em todos os idiomas).
 * Tema que não estiver em nenhuma lista é tratado como FREE (comportamento atual).
 */

export type ProductId = string;

export interface PremiumProduct {
  /** ID do produto no Google Play Console (preencher quando criar o produto). */
  productId: ProductId;
  /** Temas que este produto desbloqueia. */
  themeIds: ThemeId[];
}

export const FREE_THEME_IDS: readonly ThemeId[] = [
  'animais',
  'trabalho',
  'objetos',
  'geral',
  'filmes',
];

export const PREMIUM_PRODUCTS: readonly PremiumProduct[] = [
  // TODO: trocar pelo productId real criado no Play Console.
  { productId: 'pack_animais_plus', themeIds: ['animais_plus'] },
  { productId: 'pack_profissoes_plus', themeIds: ['profissoes_plus'] },
  // Exemplo — substitua pelos produtos reais:
  // { productId: 'pack_esportes', themeIds: ['esportes'] },
  // { productId: 'pack_completo', themeIds: ['esportes', 'musica', 'paises'] },
];

const PREMIUM_THEME_IDS = new Set(PREMIUM_PRODUCTS.flatMap((product) => product.themeIds));

export const isPremiumTheme = (themeId: ThemeId): boolean =>
  !FREE_THEME_IDS.includes(themeId) && PREMIUM_THEME_IDS.has(themeId);

/** Produtos que desbloqueiam o tema (vazio se for free). */
export const getProductsForTheme = (themeId: ThemeId): ProductId[] =>
  isPremiumTheme(themeId)
    ? PREMIUM_PRODUCTS.filter((product) => product.themeIds.includes(themeId)).map((product) => product.productId)
    : [];

/** Tema liberado se for free ou se o usuário possuir algum produto que o inclua. */
export const isThemeUnlocked = (themeId: ThemeId, ownedProductIds: readonly ProductId[]): boolean =>
  !isPremiumTheme(themeId) ||
  getProductsForTheme(themeId).some((productId) => ownedProductIds.includes(productId));
