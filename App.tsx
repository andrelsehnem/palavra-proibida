import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WORD_REPOSITORY_SOURCE } from './src/data/repositoryConfig';
import { AdMobBootstrap } from './src/components/ads/AdMobBootstrap';
import { buildThemeOptions } from './src/data/themes';
import { createWordRepository } from './src/data/wordRepository';
import type { TeamGameSettings, WordCard } from './src/domain/types';
import { useAppScreenFlow } from './src/hooks/useAppScreenFlow';
import { useGameRound } from './src/hooks/useGameRound';
import { useLanguagePreference } from './src/hooks/useLanguagePreference';
import { useOwnedProducts } from './src/hooks/useOwnedProducts';
import { useTeamGameRound } from './src/hooks/useTeamGameRound';
import { useThemePreference } from './src/hooks/useThemePreference';
import { useAdInterstitialAction } from './src/hooks/useAdInterstitialAction';
import { ClassicResultsScreen } from './src/screens/ClassicResultsScreen';
import { GameScreen } from './src/screens/GameScreen';
import { MENU_COLORS, MenuScreen } from './src/screens/MenuScreen';
import { TeamGameScreen } from './src/screens/TeamGameScreen';
import { TeamResultsScreen } from './src/screens/TeamResultsScreen';
import { ThemesScreen } from './src/screens/ThemesScreen';
import { getScenePalette } from './src/theme/scenePalette';
import { TOKENS } from './src/theme/tokens';
import { AtmosphereScreen } from './src/components/layout/AtmosphereScreen';

void SplashScreen.preventAutoHideAsync();

const SPLASH_MIN_DURATION_MS = 3200;
const SPLASH_MAX_DURATION_MS = 8000;

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
  const [isSplashMinTimeElapsed, setIsSplashMinTimeElapsed] = useState(false);
  const {
    isThemeLocked,
    isHydrated: arePurchasesHydrated,
    canPurchase,
    getThemePrice,
    buyTheme,
  } = useOwnedProducts();
  const [areFontsLoaded, fontError] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const areFontsReady = areFontsLoaded || fontError !== null;

  const {
    isMenuScreen,
    isThemesScreen,
    isGameScreen,
    isClassicResultsScreen,
    isTeamGameScreen,
    isTeamResultsScreen,
    goToMenu,
    goToThemes,
    goToGame,
    goToClassicResults,
    goToTeamGame,
    goToTeamResults,
  } = useAppScreenFlow();
  const [allWords, setAllWords] = useState<WordCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [teamSettings, setTeamSettings] = useState<TeamGameSettings>(DEFAULT_TEAM_SETTINGS);
  const themeOptions = useMemo(
    () => buildThemeOptions(allWords.map((word) => word.theme), language),
    [allWords, language],
  );

  const {
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
    isMatchFinished: isClassicMatchFinished,
    toggleTheme,
    prepareRound,
    nextWord,
    endRound,
    startNextRound,
    finishMatch: finishClassicMatch,
  } = useGameRound(allWords, isThemeLocked);

  const {
    teamScores,
    totalCards: totalTeamCards,
    currentCard: currentTeamCard,
    currentIndex: currentTeamIndex,
    currentTeam,
    remainingSeconds,
    roundStatus,
    roundNumber: teamRoundNumber,
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
    endRound: endTeamRound,
    startNextRound: startNextTeamRound,
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
      } catch (error) {
        if (!isMounted) {
          return;
        }

        Sentry.captureException(error, {
          tags: {
            area: 'word-loading',
          },
          extra: {
            language,
            repositorySource: WORD_REPOSITORY_SOURCE,
          },
        });

        setAllWords([]);
        setLoadError('Não foi possível carregar as palavras.');
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
    const minTimer = setTimeout(() => {
      setIsSplashMinTimeElapsed(true);
    }, SPLASH_MIN_DURATION_MS);
    // Garante que o splash não trava se a consulta de compras demorar.
    const maxTimer = setTimeout(() => {
      setIsAnimatedSplashVisible(false);
    }, SPLASH_MAX_DURATION_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  // Splash só sai depois do tempo mínimo, das compras e das fontes carregadas.
  if (isAnimatedSplashVisible && isSplashMinTimeElapsed && arePurchasesHydrated && areFontsReady) {
    setIsAnimatedSplashVisible(false);
  }

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
      <AtmosphereScreen
        mode={mode}
        scene={scene}
        backgroundColor={isMenuScreen ? MENU_COLORS[mode].background : undefined}
      >
      {isMenuScreen ? (
        <MenuScreen
          key={`menu-${language}`}
          mode={mode}
          tokens={tokens}
          scene={scene}
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
          isThemeLocked={isThemeLocked}
          canPurchase={canPurchase}
          getThemePrice={getThemePrice}
          onBuyTheme={buyTheme}
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
          totalCards={totalCards}
          correctCount={correctCount}
          skippedCount={skippedCount}
          scoreRate={scoreRate}
          roundNumber={roundNumber}
          onEndRound={() => {
            endRound();
            goToClassicResults();
          }}
          onExit={handleExitToMenu}
          onSkip={() => nextWord(false)}
          onCorrect={() => nextWord(true)}
        />
      ) : null}

      {isClassicResultsScreen ? (
        <ClassicResultsScreen
          tokens={tokens}
          scene={scene}
          language={language}
          roundNumber={roundNumber}
          roundResults={roundResults}
          totalCorrect={totalCorrect}
          isMatchFinished={isClassicMatchFinished}
          onNextRound={() => {
            startNextRound();
            goToGame();
          }}
          onFinishMatch={finishClassicMatch}
          onBackToMenu={goToMenu}
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
          totalCards={totalTeamCards}
          currentTeamName={currentTeam?.name ?? 'Equipe'}
          currentTeamScore={currentTeam?.score ?? 0}
          remainingSeconds={remainingSeconds}
          roundStatus={roundStatus}
          roundNumber={teamRoundNumber}
          hasNextTeam={hasNextTeam}
          nextTeamName={nextTeamName}
          onExit={handleExitToMenu}
          onStartTurn={startTurn}
          onStartNextTeam={advanceToNextTeam}
          onEndRound={() => {
            endTeamRound();
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
          language={language}
          roundNumber={teamRoundNumber}
          isMatchFinished={roundStatus === 'finished'}
          onNextRound={() => {
            startNextTeamRound();
            goToTeamGame();
          }}
          onFinishMatch={finishMatch}
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
