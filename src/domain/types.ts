export type ThemeId = string;

export interface WordCard {
  id: string;
  theme: ThemeId;
  mainWord: string;
  forbiddenWords: string[];
}

export interface ThemeOption {
  id: ThemeId;
  label: string;
  accent: string;
}

export type ThemeMode = 'light' | 'dark';

export type GameMode = 'classic' | 'teams';

export interface TeamGameSettings {
  isEnabled: boolean;
  teamCount: number;
  roundSeconds: number;
}

export interface TeamScore {
  id: string;
  name: string;
  score: number;
  roundScore: number;
}

export type TeamRoundStatus = 'idle' | 'playing' | 'time-up' | 'round-ended' | 'finished';

export type CardOutcome = 'correct' | 'skipped';

export interface MatchDeck {
  pool: WordCard[];
  queue: WordCard[];
  skipped: WordCard[];
  resolvedCount: number;
}

export interface ClassicRoundResult {
  round: number;
  correct: number;
  skipped: number;
}
