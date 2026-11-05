import { useState } from 'react';

export type AppScreenId = 'menu' | 'themes' | 'game' | 'classicResults' | 'teamGame' | 'teamResults';

interface UseAppScreenFlowResult {
  screen: AppScreenId;
  isMenuScreen: boolean;
  isThemesScreen: boolean;
  isGameScreen: boolean;
  isClassicResultsScreen: boolean;
  isTeamGameScreen: boolean;
  isTeamResultsScreen: boolean;
  goToMenu: () => void;
  goToThemes: () => void;
  goToGame: () => void;
  goToClassicResults: () => void;
  goToTeamGame: () => void;
  goToTeamResults: () => void;
}

export function useAppScreenFlow(initialScreen: AppScreenId = 'menu'): UseAppScreenFlowResult {
  const [screen, setScreen] = useState<AppScreenId>(initialScreen);

  return {
    screen,
    isMenuScreen: screen === 'menu',
    isThemesScreen: screen === 'themes',
    isGameScreen: screen === 'game',
    isClassicResultsScreen: screen === 'classicResults',
    isTeamGameScreen: screen === 'teamGame',
    isTeamResultsScreen: screen === 'teamResults',
    goToMenu: () => setScreen('menu'),
    goToThemes: () => setScreen('themes'),
    goToGame: () => setScreen('game'),
    goToClassicResults: () => setScreen('classicResults'),
    goToTeamGame: () => setScreen('teamGame'),
    goToTeamResults: () => setScreen('teamResults'),
  };
}
