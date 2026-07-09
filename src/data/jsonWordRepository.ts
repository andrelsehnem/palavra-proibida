import { Consts, type LanguageCode } from './Consts';
import type { WordCard } from '../domain/types';
import type { WordRepository } from './wordRepository';

import wordsByLanguage from './words.json';

interface RawWordCard {
  mainWord: string;
  forbiddenWords: string[];
}

type RawThemeEntry = string | RawWordCard;
type WordsByTheme = Record<string, RawThemeEntry[]>;
type AllLanguageWords = Record<LanguageCode, WordsByTheme>;

const isThemeEntry = (value: unknown): value is WordsByTheme => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  // Validar que pelo menos um tema existe e é um array
  const hasAtLeastOneTheme = Object.values(obj).some((theme) => Array.isArray(theme));
  return hasAtLeastOneTheme;
};

const normalizePhrase = (phrase: string): string => phrase.trim().toLowerCase();

const isRawWordCard = (value: unknown): value is RawWordCard => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as RawWordCard;
  return (
    typeof candidate.mainWord === 'string' &&
    Array.isArray(candidate.forbiddenWords) &&
    candidate.forbiddenWords.every((word) => typeof word === 'string')
  );
};

const buildForbiddenWords = (
  phrases: string[],
  currentIndex: number,
  mainWord: string,
  initialSelection: string[] = [],
  limit = 5,
): string[] => {
  const forbidden: string[] = [...initialSelection];
  const selected = new Set<string>(initialSelection);

  for (let offset = 1; offset < phrases.length && forbidden.length < limit; offset += 1) {
    const nextIndex = (currentIndex + offset) % phrases.length;
    const candidate = phrases[nextIndex];

    if (selected.has(candidate) || candidate === mainWord) {
      continue;
    }

    selected.add(candidate);
    forbidden.push(candidate);
  }

  return forbidden;
};

export class JsonWordRepository implements WordRepository {
  private language: LanguageCode;

  constructor(language: LanguageCode = Consts.DEFAULT_LANGUAGE) {
    this.language = language;
  }

  async getWords(): Promise<WordCard[]> {
    const source = wordsByLanguage as unknown;

    // Validate that source is an AllLanguageWords structure
    if (typeof source !== 'object' || source === null) {
      throw new Error('Formato de words.json invalido.');
    }

    const languageData = (source as AllLanguageWords)[this.language];
    if (!languageData) {
      throw new Error(
        `Idioma "${this.language}" nao encontrado em words.json. Idiomas disponíveis: ${Object.keys(source).join(', ')}`,
      );
    }

    if (!isThemeEntry(languageData)) {
      throw new Error(`Formato de words.json invalido para o idioma "${this.language}".`);
    }

    const cards: WordCard[] = [];

    const themes = Object.keys(languageData);

    for (const themeId of themes) {
      const entries = languageData[themeId];
      const phrases = entries
        .map((entry) => {
          if (typeof entry === 'string') {
            return normalizePhrase(entry);
          }

          if (isRawWordCard(entry)) {
            return normalizePhrase(entry.mainWord);
          }

          return '';
        })
        .filter((phrase) => phrase.length > 0);

      for (let index = 0; index < entries.length; index += 1) {
        const currentEntry = entries[index];
        const mainWord =
          typeof currentEntry === 'string'
            ? normalizePhrase(currentEntry)
            : isRawWordCard(currentEntry)
              ? normalizePhrase(currentEntry.mainWord)
              : '';

        if (mainWord.length === 0) {
          continue;
        }

        const explicitForbidden =
          isRawWordCard(currentEntry)
            ? currentEntry.forbiddenWords
                .map((word) => normalizePhrase(word))
                .filter((word) => word.length > 0 && word !== mainWord)
            : [];

        const uniqueExplicitForbidden = [...new Set(explicitForbidden)].slice(0, 5);
        const forbiddenWords = buildForbiddenWords(
          phrases,
          phrases.indexOf(mainWord),
          mainWord,
          uniqueExplicitForbidden,
        );

        cards.push({
          id: `${themeId}-${index + 1}`,
          theme: themeId,
          mainWord,
          forbiddenWords,
        });
      }
    }

    return cards;
  }
}
