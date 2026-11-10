import { useMemo, useState } from 'react';

import { advanceMatchDeck, createMatchDeck, filterWordsByThemes } from '../domain/roundDeck';
import type { ClassicRoundResult, MatchDeck, ThemeId, WordCard } from '../domain/types';

interface UseGameRoundResult {
  selectedThemes: ThemeId[];
  availablePool: WordCard[];
  totalCards: number;
  currentCard: WordCard | null;
  currentIndex: number;
  correctCount: number;
  skippedCount: number;
  hasSelectableWords: boolean;
  scoreRate: number;
  roundNumber: number;
  roundResults: ClassicRoundResult[];
  totalCorrect: number;
  isMatchFinished: boolean;
  toggleTheme: (themeId: ThemeId) => void;
  prepareRound: () => boolean;
  nextWord: (wasCorrect: boolean) => void;
  endRound: () => void;
  startNextRound: () => void;
  finishMatch: () => void;
}

const EMPTY_DECK: MatchDeck = { pool: [], queue: [], skipped: [], resolvedCount: 0 };

const NEVER_LOCKED = () => false;

export function useGameRound(
  allWords: WordCard[],
  isThemeLocked: (themeId: ThemeId) => boolean = NEVER_LOCKED,
): UseGameRoundResult {
  const [selectedThemeDraft, setSelectedThemeDraft] = useState<ThemeId[]>(['animais', 'geral']);
  const [deck, setDeck] = useState<MatchDeck>(EMPTY_DECK);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundResults, setRoundResults] = useState<ClassicRoundResult[]>([]);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

  const selectedThemes = useMemo(() => {
    const availableThemes = new Set(
      allWords.map((word) => word.theme).filter((theme) => !isThemeLocked(theme)),
    );
    const validThemes = selectedThemeDraft.filter((theme) => availableThemes.has(theme));

    if (validThemes.length > 0) {
      return validThemes;
    }

    const [firstUnlockedTheme] = availableThemes;
    return firstUnlockedTheme ? [firstUnlockedTheme] : [];
  }, [allWords, selectedThemeDraft, isThemeLocked]);

  const availablePool = useMemo(
    () => filterWordsByThemes(allWords, selectedThemes),
    [allWords, selectedThemes],
  );

  const totalCards = deck.pool.length;
  const currentCard = deck.queue[0] ?? null;
  const currentIndex = totalCards > 0 ? deck.resolvedCount % totalCards : 0;
  const hasSelectableWords = availablePool.length > 0;
  const scoreRate = totalCards > 0 ? Math.min(100, Math.round((correctCount / totalCards) * 100)) : 0;
  const totalCorrect = roundResults.reduce((sum, result) => sum + result.correct, 0);

  const toggleTheme = (themeId: ThemeId) => {
    if (isThemeLocked(themeId)) {
      return;
    }

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

    setDeck(createMatchDeck(allWords, selectedThemes));
    setCorrectCount(0);
    setSkippedCount(0);
    setRoundNumber(1);
    setRoundResults([]);
    setIsMatchFinished(false);

    return true;
  };

  const nextWord = (wasCorrect: boolean) => {
    if (!currentCard) {
      return;
    }

    if (wasCorrect) {
      setCorrectCount((value) => value + 1);
    } else {
      setSkippedCount((value) => value + 1);
    }

    setDeck((current) => advanceMatchDeck(current, wasCorrect ? 'correct' : 'skipped'));
  };

  const endRound = () => {
    setRoundResults((current) => [
      ...current,
      { round: roundNumber, correct: correctCount, skipped: skippedCount },
    ]);
    // A carta na tela não foi respondida: volta depois das inéditas.
    setDeck((current) => advanceMatchDeck(current, 'skipped'));
  };

  const startNextRound = () => {
    setCorrectCount(0);
    setSkippedCount(0);
    setRoundNumber((value) => value + 1);
  };

  const finishMatch = () => {
    setIsMatchFinished(true);
  };

  return {
    selectedThemes,
    availablePool,
    totalCards,
    currentCard,
    currentIndex,
    correctCount,
    skippedCount,
    hasSelectableWords,
    scoreRate,
    roundNumber,
    roundResults,
    totalCorrect,
    isMatchFinished,
    toggleTheme,
    prepareRound,
    nextWord,
    endRound,
    startNextRound,
    finishMatch,
  };
}
