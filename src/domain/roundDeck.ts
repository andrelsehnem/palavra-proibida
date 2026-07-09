import type { ThemeId, WordCard } from './types';

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