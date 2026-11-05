import { useEffect, useMemo, useState } from 'react';

import { advanceMatchDeck, createMatchDeck, filterWordsByThemes } from '../domain/roundDeck';
import type { MatchDeck, TeamGameSettings, TeamRoundStatus, TeamScore, ThemeId, WordCard } from '../domain/types';
import { Consts, type LanguageCode } from '../data/Consts';

interface UseTeamGameRoundResult {
  availablePool: WordCard[];
  totalCards: number;
  teamScores: TeamScore[];
  currentCard: WordCard | null;
  currentIndex: number;
  currentTeam: TeamScore | null;
  currentTeamIndex: number;
  remainingSeconds: number;
  roundStatus: TeamRoundStatus;
  roundNumber: number;
  hasSelectableWords: boolean;
  hasValidSettings: boolean;
  hasNextTeam: boolean;
  nextTeamName: string | null;
  winningTeamIds: string[];
  isTie: boolean;
  prepareMatch: () => boolean;
  startTurn: () => void;
  registerCorrectAnswer: () => void;
  registerSkip: () => void;
  advanceToNextTeam: () => void;
  endRound: () => void;
  startNextRound: () => void;
  finishMatch: () => void;
  language: LanguageCode;
}

const EMPTY_DECK: MatchDeck = { pool: [], queue: [], skipped: [], resolvedCount: 0 };

const createTeams = (teamCount: number, language: LanguageCode): TeamScore[] =>
  Array.from({ length: teamCount }, (_, index) => ({
    id: `team-${index + 1}`,
    name: Consts.UI_TRANSLATIONS[language].LABEL_EQUIPE.replace('{team}', `${index + 1}`),
    score: 0,
    roundScore: 0,
  }));

export function useTeamGameRound(
  allWords: WordCard[],
  selectedThemes: ThemeId[],
  settings: TeamGameSettings,
  language: LanguageCode,
): UseTeamGameRoundResult {
  const [deck, setDeck] = useState<MatchDeck>(EMPTY_DECK);
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.roundSeconds);
  const [roundStatus, setRoundStatus] = useState<TeamRoundStatus>('idle');
  const [roundNumber, setRoundNumber] = useState(1);

  const availablePool = useMemo(
    () => filterWordsByThemes(allWords, selectedThemes),
    [allWords, selectedThemes],
  );

  const hasSelectableWords = availablePool.length > 0;
  const hasValidSettings = settings.teamCount >= 2 && settings.roundSeconds > 0;
  const totalCards = deck.pool.length;
  const currentCard = deck.queue[0] ?? null;
  const currentIndex = totalCards > 0 ? deck.resolvedCount % totalCards : 0;
  const currentTeam = teamScores[currentTeamIndex] ?? null;
  const hasNextTeam = currentTeamIndex < teamScores.length - 1;
  const nextTeamName = hasNextTeam ? teamScores[currentTeamIndex + 1]?.name ?? null : null;

  const winningTeamIds = useMemo(() => {
    if (teamScores.length === 0) {
      return [];
    }

    const topScore = Math.max(...teamScores.map((team) => team.score));
    return teamScores.filter((team) => team.score === topScore).map((team) => team.id);
  }, [teamScores]);

  const isTie = winningTeamIds.length > 1;

  useEffect(() => {
    if (roundStatus !== 'playing') {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          setRoundStatus('time-up');
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [remainingSeconds, roundStatus]);

  const prepareMatch = () => {
    if (!hasSelectableWords || !hasValidSettings) {
      return false;
    }

    setDeck(createMatchDeck(allWords, selectedThemes));
    setTeamScores(createTeams(settings.teamCount, language));
    setCurrentTeamIndex(0);
    setRemainingSeconds(settings.roundSeconds);
    setRoundStatus('idle');
    setRoundNumber(1);

    return true;
  };

  const startTurn = () => {
    if (!currentCard || !currentTeam || roundStatus !== 'idle') {
      return;
    }

    setRemainingSeconds(settings.roundSeconds);
    setRoundStatus('playing');
  };

  const registerCorrectAnswer = () => {
    if (!currentTeam || !currentCard || roundStatus !== 'playing') {
      return;
    }

    setTeamScores((current) =>
      current.map((team, index) =>
        index === currentTeamIndex
          ? { ...team, score: team.score + 1, roundScore: team.roundScore + 1 }
          : team,
      ),
    );
    setDeck((current) => advanceMatchDeck(current, 'correct'));
  };

  const registerSkip = () => {
    if (!currentCard || roundStatus !== 'playing') {
      return;
    }

    setDeck((current) => advanceMatchDeck(current, 'skipped'));
  };

  const advanceToNextTeam = () => {
    if (!hasNextTeam || roundStatus !== 'time-up') {
      return;
    }

    // A carta na tela quando o tempo acabou não foi respondida: volta depois das inéditas.
    setDeck((current) => advanceMatchDeck(current, 'skipped'));
    setCurrentTeamIndex((value) => value + 1);
    setRemainingSeconds(settings.roundSeconds);
    setRoundStatus('playing');
  };

  const endRound = () => {
    if (roundStatus !== 'time-up') {
      return;
    }

    setDeck((current) => advanceMatchDeck(current, 'skipped'));
    setRoundStatus('round-ended');
  };

  const startNextRound = () => {
    setTeamScores((current) => current.map((team) => ({ ...team, roundScore: 0 })));
    setCurrentTeamIndex(0);
    setRemainingSeconds(settings.roundSeconds);
    setRoundNumber((value) => value + 1);
    setRoundStatus('idle');
  };

  const finishMatch = () => {
    setRoundStatus('finished');
  };

  return {
    availablePool,
    totalCards,
    teamScores,
    currentCard,
    currentIndex,
    currentTeam,
    currentTeamIndex,
    remainingSeconds,
    roundStatus,
    roundNumber,
    hasSelectableWords,
    hasValidSettings,
    hasNextTeam,
    nextTeamName,
    winningTeamIds,
    isTie,
    prepareMatch,
    startTurn,
    registerCorrectAnswer,
    registerSkip,
    advanceToNextTeam,
    endRound,
    startNextRound,
    finishMatch,
    language,
  };
}
