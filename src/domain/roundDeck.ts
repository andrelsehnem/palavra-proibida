import type { CardOutcome, MatchDeck, ThemeId, WordCard } from './types';

export const filterWordsByThemes = (allWords: WordCard[], selectedThemes: ThemeId[]) =>
  allWords.filter((word) => selectedThemes.includes(word.theme));

export const shuffleCards = (cards: WordCard[]) => {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = current;
  }

  return shuffled;
};

export const buildRoundDeck = (allWords: WordCard[], selectedThemes: ThemeId[]) =>
  shuffleCards(filterWordsByThemes(allWords, selectedThemes));

export const createMatchDeck = (allWords: WordCard[], selectedThemes: ThemeId[]): MatchDeck => {
  const queue = buildRoundDeck(allWords, selectedThemes);

  return { pool: queue, queue, skipped: [], resolvedCount: 0 };
};

const shuffleAvoidingFirst = (cards: WordCard[], avoided: WordCard) => {
  const shuffled = shuffleCards(cards);

  if (shuffled.length > 1 && shuffled[0].id === avoided.id) {
    const swapIndex = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
  }

  return shuffled;
};

// Ordem de sorteio: inéditas, depois puladas e, sem nada restante, o baralho inteiro.
export const advanceMatchDeck = (deck: MatchDeck, outcome: CardOutcome): MatchDeck => {
  const [current, ...remaining] = deck.queue;

  if (!current) {
    return deck;
  }

  const skipped = outcome === 'skipped' ? [...deck.skipped, current] : deck.skipped;
  const resolvedCount = deck.resolvedCount + 1;

  if (remaining.length > 0) {
    return { ...deck, queue: remaining, skipped, resolvedCount };
  }

  return {
    ...deck,
    queue: shuffleAvoidingFirst(skipped.length > 0 ? skipped : deck.pool, current),
    skipped: [],
    resolvedCount,
  };
};