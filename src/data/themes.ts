import type { ThemeOption } from '../domain/types';
import type { LanguageCode } from './Consts';

/**
 * Nomes por idioma. Os ids dos temas são os mesmos em todos os idiomas (em pt-br);
 * sem entrada aqui, usa o label padrão (pt-br).
 */
const LOCALIZED_THEME_LABELS: Record<string, Partial<Record<LanguageCode, string>>> = {
  animais: { 'en-us': 'Animals', 'es-es': 'Animales' },
  animais_plus: { 'en-us': 'Animals+', 'es-es': 'Animales+' },
  trabalho: { 'en-us': 'Jobs', 'es-es': 'Profesiones' },
  objetos: { 'en-us': 'Objects', 'es-es': 'Objetos' },
  geral: { 'en-us': 'General', 'es-es': 'General' },
  filmes: { 'en-us': 'Movies', 'es-es': 'Películas' },
  celebridades: { 'en-us': 'Celebrities', 'es-es': 'Celebridades' },
  profissoes_plus: { 'en-us': 'Jobs+', 'es-es': 'Profesiones+' },
};

const DEFAULT_THEME_OPTIONS: ThemeOption[] = [
  { id: 'animais', label: 'Animais', accent: '#2f9e44' },
  { id: 'animais_plus', label: 'Animais+', accent: '#0ca678' },
  { id: 'trabalho', label: 'Trabalho', accent: '#1971c2' },
  { id: 'profissoes_plus', label: 'Profissões+', accent: '#7048e8' },
  { id: 'objetos', label: 'Objetos', accent: '#e67700' },
  { id: 'geral', label: 'Geral', accent: '#5f3dc4' },
  { id: 'filmes', label: 'Filmes', accent: '#c2255c' },
];

const FALLBACK_ACCENTS = [
  '#2f9e44',
  '#1971c2',
  '#e67700',
  '#5f3dc4',
  '#c2255c',
  '#0ca678',
  '#d9480f',
  '#7048e8',
  '#099268',
  '#ae3ec9',
];

const THEME_LOOKUP = new Map(DEFAULT_THEME_OPTIONS.map((theme) => [theme.id, theme]));

const formatThemeLabel = (themeId: string): string =>
  themeId
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const hashThemeId = (themeId: string): number => {
  let hash = 0;

  for (let index = 0; index < themeId.length; index += 1) {
    hash = (hash * 31 + themeId.charCodeAt(index)) >>> 0;
  }

  return hash;
};

export const buildThemeOptions = (themeIds: string[], language?: LanguageCode): ThemeOption[] => {
  const uniqueThemeIds = [...new Set(themeIds.filter((themeId) => themeId.trim().length > 0))];

  if (uniqueThemeIds.length === 0) {
    return [];
  }

  return uniqueThemeIds.map((themeId) => {
    const knownTheme = THEME_LOOKUP.get(themeId);

    const localizedLabel = language ? LOCALIZED_THEME_LABELS[themeId]?.[language] : undefined;

    if (knownTheme) {
      return localizedLabel ? { ...knownTheme, label: localizedLabel } : knownTheme;
    }

    return {
      id: themeId,
      label: localizedLabel ?? formatThemeLabel(themeId),
      accent: FALLBACK_ACCENTS[hashThemeId(themeId) % FALLBACK_ACCENTS.length],
    };
  });
};
