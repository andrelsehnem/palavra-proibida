import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WORD_REPOSITORY_SOURCE } from './src/data/repositoryConfig';
import { AdMobBootstrap } from './src/components/ads/AdMobBootstrap';
import { buildThemeOptions } from './src/data/themes';
import { createWordRepository } from './src/data/wordRepository';
import type { TeamGameSettings, WordCard } from './src/domain/types';
import { useAppScreenFlow } from './src/hooks/useAppScreenFlow';
import { useGameRound } from './src/hooks/useGameRound';
import { useLanguagePreference } from './src/hooks/useLanguagePreference';
import { useTeamGameRound } from './src/hooks/useTeamGameRound';
import { useThemePreference } from './src/hooks/useThemePreference';
import { useAdInterstitialAction } from './src/hooks/useAdInterstitialAction';
import { GameScreen } from './src/screens/GameScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { TeamGameScreen } from './src/screens/TeamGameScreen';
import { TeamResultsScreen } from './src/screens/TeamResultsScreen';
import { ThemesScreen } from './src/screens/ThemesScreen';
import { getScenePalette } from './src/theme/scenePalette';
import { TOKENS } from './src/theme/tokens';
import { AtmosphereScreen } from './src/components/layout/AtmosphereScreen';

void SplashScreen.preventAutoHideAsync();

const DEFAULT_TEAM_SETTINGS: TeamGameSettings = {
  isEnabled: false,
  teamCount: 2,
  roundSeconds: 60,
};

export default function App() {
  const { mode, isHydrated, toggleMode } = useThemePreference();
  const { language, setLanguage, isHydrated: isLanguageHydrated } = useLanguagePreference();
  const tokens = TOKENS[mode];
  const scene = useMemo(() => getScenePalette(mode), [mode]);
  const { runWithInterstitial } = useAdInterstitialAction();
  const [isAnimatedSplashVisible, setIsAnimatedSplashVisible] = useState(true);

  const {
    isMenuScreen,
    isThemesScreen,
    isGameScreen,
    isTeamGameScreen,
    isTeamResultsScreen,
    goToMenu,
    goToThemes,
    goToGame,
    goToTeamGame,
    goToTeamResults,
  } = useAppScreenFlow();
  const [allWords, setAllWords] = useState<WordCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [teamSettings, setTeamSettings] = useState<TeamGameSettings>(DEFAULT_TEAM_SETTINGS);
  const themeOptions = useMemo(
    () => buildThemeOptions(allWords.map((word) => word.theme)),
    [allWords],
  );

  const {
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
  } = useGameRound(allWords);

  const {
    teamScores,
    roundDeck: teamRoundDeck,
    currentCard: currentTeamCard,
    currentIndex: currentTeamIndex,
    currentTeam,
    remainingSeconds,
    roundStatus,
    hasValidSettings: hasValidTeamSettings,
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
  } = useTeamGameRound(allWords, selectedThemes, teamSettings, language);

  useEffect(() => {
    let isMounted = true;

    // Reset state immediately when language changes
    setAllWords([]);
    setIsLoading(true);

    const loadWords = async () => {
      try {
        const currentRepository = createWordRepository(WORD_REPOSITORY_SOURCE, language);
        const cards = await currentRepository.getWords();
        if (!isMounted) {
          return;
        }

        setAllWords(cards);
        setLoadError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setAllWords([]);
        setLoadError('Nao foi possivel carregar as palavras.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWords();

    return () => {
      isMounted = false;
    };
  }, [language]);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatedSplashVisible(false);
    }, 3200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const updateTeamSettings = (updates: Partial<TeamGameSettings>) => {
    setTeamSettings((current) => ({
      ...current,
      ...updates,
    }));
  };

  const updateNumericSetting = (key: 'teamCount' | 'roundSeconds', value: string) => {
    const digits = value.replace(/\D/g, '');

    updateTeamSettings({
      [key]: digits.length > 0 ? Number(digits) : 0,
    } as Pick<TeamGameSettings, typeof key>);
  };

  const startGame = () => {
    if (teamSettings.isEnabled) {
      const canStart = prepareMatch();

      if (!canStart) {
        return;
      }

      goToTeamGame();
      return;
    }

    const canStart = prepareRound();

    if (!canStart) {
      return;
    }

    goToGame();
  };

  const handleExitToMenu = () => {
    void runWithInterstitial(() => {
      goToMenu();
    });
  };

  if (isAnimatedSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('./assets/logo-transparent.png')}
          style={styles.splashFallbackLogo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AdMobBootstrap />
      <AtmosphereScreen mode={mode} scene={scene}>
      {isMenuScreen ? (
        <MenuScreen
          key={`menu-${language}`}
          mode={mode}
          tokens={tokens}
          scene={scene}
          themesCount={themeOptions.length}
          cardsCount={allWords.length}
          language={language}
          onChangeLanguage={setLanguage}
          onStart={goToThemes}
          onToggleMode={toggleMode}
        />
      ) : null}

      {isThemesScreen ? (
        <ThemesScreen
          key={`themes-${language}`}
          tokens={tokens}
          scene={scene}
          selectedThemes={selectedThemes}
          themeOptions={themeOptions}
          availableCards={availablePool.length}
          isLoading={isLoading}
          isHydrated={isHydrated}
          loadError={loadError}
          hasSelectableWords={hasSelectableWords}
          teamSettings={teamSettings}
          isTeamConfigurationValid={hasValidTeamSettings}
          language={language}
          onToggleTheme={toggleTheme}
          onToggleTeamMode={(value) => updateTeamSettings({ isEnabled: value })}
          onChangeTeamCount={(value) => updateNumericSetting('teamCount', value)}
          onChangeRoundSeconds={(value) => updateNumericSetting('roundSeconds', value)}
          onStart={startGame}
          onBack={goToMenu}
        />
      ) : null}

      {isGameScreen ? (
        <GameScreen
          tokens={tokens}
          scene={scene}
          language={language}
          currentCard={currentCard}
          currentIndex={currentIndex}
          totalCards={roundDeck.length}
          correctCount={correctCount}
          skippedCount={skippedCount}
          scoreRate={scoreRate}
          onExit={handleExitToMenu}
          onSkip={() => nextWord(false)}
          onCorrect={() => nextWord(true)}
        />
      ) : null}

      {isTeamGameScreen ? (
        <TeamGameScreen
          tokens={tokens}
          scene={scene}
          language={language}
          teamScores={teamScores}
          currentCard={currentTeamCard}
          currentIndex={currentTeamIndex}
          totalCards={teamRoundDeck.length}
          currentTeamName={currentTeam?.name ?? 'Equipe'}
          currentTeamScore={currentTeam?.score ?? 0}
          remainingSeconds={remainingSeconds}
          roundStatus={roundStatus}
          hasNextTeam={hasNextTeam}
          nextTeamName={nextTeamName}
          onExit={handleExitToMenu}
          onStartTurn={startTurn}
          onStartNextTeam={advanceToNextTeam}
          onFinishGame={() => {
            finishMatch();
            goToTeamResults();
          }}
          onSkip={registerSkip}
          onCorrect={registerCorrectAnswer}
        />
      ) : null}

      {isTeamResultsScreen ? (
        <TeamResultsScreen
          tokens={tokens}
          scene={scene}
          teamScores={teamScores}
          winningTeamIds={winningTeamIds}
          isTie={isTie}
          onBackToMenu={goToMenu}
        />
      ) : null}
      </AtmosphereScreen>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashFallbackLogo: {
    position: 'absolute',
    width: 220,
    height: 220,
    opacity: 0.92,
  },
});
