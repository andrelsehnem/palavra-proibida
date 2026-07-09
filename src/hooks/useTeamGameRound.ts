import { useEffect, useMemo, useState } from 'react';

import { buildRoundDeck, filterWordsByThemes } from '../domain/roundDeck';
import type { TeamGameSettings, TeamRoundStatus, TeamScore, ThemeId, WordCard } from '../domain/types';
import { Consts, type LanguageCode } from '../data/Consts';

interface UseTeamGameRoundResult {
  availablePool: WordCard[];
  roundDeck: WordCard[];
  teamScores: TeamScore[];
  currentCard: WordCard | null;
  currentIndex: number;
  currentTeam: TeamScore | null;
  currentTeamIndex: number;
  remainingSeconds: number;
  roundStatus: TeamRoundStatus;
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
  finishMatch: () => void;
  language: LanguageCode;
}

const createTeams = (teamCount: number, language: LanguageCode): TeamScore[] =>
  Array.from({ length: teamCount }, (_, index) => ({
    id: `team-${index + 1}`,
    name: Consts.UI_TRANSLATIONS[language].LABEL_EQUIPE.replace('{team}', `${index + 1}`),
    score: 0,
  }));

export function useTeamGameRound(
  allWords: WordCard[],
  selectedThemes: ThemeId[],
  settings: TeamGameSettings,
  language: LanguageCode,
): UseTeamGameRoundResult {
  const [roundDeck, setRoundDeck] = useState<WordCard[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.roundSeconds);
  const [roundStatus, setRoundStatus] = useState<TeamRoundStatus>('idle');

  const availablePool = useMemo(
    () => filterWordsByThemes(allWords, selectedThemes),
    [allWords, selectedThemes],
  );

  const hasSelectableWords = availablePool.length > 0;
  const hasValidSettings = settings.teamCount >= 2 && settings.roundSeconds > 0;
  const currentCard = roundDeck[currentIndex] ?? null;
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

    setRoundDeck(buildRoundDeck(allWords, selectedThemes));
    setTeamScores(createTeams(settings.teamCount, language));
    setCurrentIndex(0);
    setCurrentTeamIndex(0);
    setRemainingSeconds(settings.roundSeconds);
    setRoundStatus('idle');

    return true;
  };

  const startTurn = () => {
    if (roundDeck.length === 0 || !currentTeam || roundStatus !== 'idle') {
      return;
    }

    setRemainingSeconds(settings.roundSeconds);
    setRoundStatus('playing');
  };

  const moveToNextCard = () => {
    setCurrentIndex((value) => (value + 1) % roundDeck.length);
  };

  const registerCorrectAnswer = () => {
    if (!currentTeam || roundDeck.length === 0 || roundStatus !== 'playing') {
      return;
    }

    setTeamScores((current) =>
      current.map((team, index) =>
        index === currentTeamIndex ? { ...team, score: team.score + 1 } : team,
      ),
    );
    moveToNextCard();
  };

  const registerSkip = () => {
    if (roundDeck.length === 0 || roundStatus !== 'playing') {
      return;
    }

    moveToNextCard();
  };

  const advanceToNextTeam = () => {
    if (!hasNextTeam || roundStatus !== 'time-up') {
      return;
    }

    moveToNextCard();
    setCurrentTeamIndex((value) => value + 1);
    setRemainingSeconds(settings.roundSeconds);
    setRoundStatus('playing');
  };

  const finishMatch = () => {
    setRoundStatus('finished');
  };

  return {
    availablePool,
    roundDeck,
    teamScores,
    currentCard,
    currentIndex,
    currentTeam,
    currentTeamIndex,
    remainingSeconds,
    roundStatus,
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
    finishMatch,
    language,
  };
}