import { useMemo, useState } from 'react';

import { buildRoundDeck, filterWordsByThemes } from '../domain/roundDeck';
import type { ThemeId, WordCard } from '../domain/types';

interface UseGameRoundResult {
  selectedThemes: ThemeId[];
  availablePool: WordCard[];
  roundDeck: WordCard[];
  currentCard: WordCard | null;
  currentIndex: number;
  correctCount: number;
  skippedCount: number;
  hasSelectableWords: boolean;
  scoreRate: number;
  toggleTheme: (themeId: ThemeId) => void;
  prepareRound: () => boolean;
  nextWord: (wasCorrect: boolean) => void;
}

export function useGameRound(allWords: WordCard[]): UseGameRoundResult {
  const [selectedThemeDraft, setSelectedThemeDraft] = useState<ThemeId[]>(['animais', 'geral']);
  const [roundDeck, setRoundDeck] = useState<WordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  const selectedThemes = useMemo(() => {
    const availableThemes = new Set(allWords.map((word) => word.theme));
    const validThemes = selectedThemeDraft.filter((theme) => availableThemes.has(theme));

    if (validThemes.length > 0) {
      return validThemes;
    }

    if (allWords.length > 0) {
      return [allWords[0].theme];
    }

    return [];
  }, [allWords, selectedThemeDraft]);

  const availablePool = useMemo(
    () => filterWordsByThemes(allWords, selectedThemes),
    [allWords, selectedThemes],
  );

  const currentCard = roundDeck[currentIndex] ?? null;
  const hasSelectableWords = availablePool.length > 0;
  const scoreRate = roundDeck.length > 0 ? Math.round((correctCount / roundDeck.length) * 100) : 0;

  const toggleTheme = (themeId: ThemeId) => {
    setSelectedThemeDraft((current) => {
      if (current.includes(themeId)) {
        return current.filter((item) => item !== themeId);
      }

      return [...current, themeId];
    });
  };

  const prepareRound = () => {
    if (!hasSelectableWords) {
      return false;
    }

    const deck = buildRoundDeck(allWords, selectedThemes);
    setRoundDeck(deck);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSkippedCount(0);

    return true;
  };

  const nextWord = (wasCorrect: boolean) => {
    if (roundDeck.length === 0) {
      return;
    }

    if (wasCorrect) {
      setCorrectCount((value) => value + 1);
    } else {
      setSkippedCount((value) => value + 1);
    }

    setCurrentIndex((value) => (value + 1) % roundDeck.length);
  };

  return {
    selectedThemes,
    availablePool,
    roundDeck,
    currentCard,
    currentIndex,
    correctCount,
    skippedCount,
    hasSelectableWords,
    scoreRate,
    toggleTheme,
    prepareRound,
    nextWord,
  };
}
