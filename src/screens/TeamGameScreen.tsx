import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { ActionButton } from '../components/buttons/ActionButton';
import { StatCard } from '../components/cards/StatCard';
import { WordGameCard } from '../components/cards/WordGameCard';
import { Consts, type LanguageCode } from '../data/Consts';
import { TIME_UP_SOUND_URI } from '../data/timeoutAlert';
import type { TeamRoundStatus, TeamScore, WordCard } from '../domain/types';
import { BODY_FONT, DISPLAY_FONT } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface TeamGameScreenProps {
  tokens: ThemeTokens;
  scene: ScenePalette;
  language: LanguageCode;
  teamScores: TeamScore[];
  currentCard: WordCard | null;
  currentIndex: number;
  totalCards: number;
  currentTeamName: string;
  currentTeamScore: number;
  remainingSeconds: number;
  roundStatus: TeamRoundStatus;
  hasNextTeam: boolean;
  nextTeamName: string | null;
  onExit: () => void;
  onStartTurn: () => void;
  onStartNextTeam: () => void;
  onFinishGame: () => void;
  onSkip: () => void;
  onCorrect: () => void;
}

export function TeamGameScreen({
  tokens,
  scene,
  language,
  teamScores,
  currentCard,
  currentIndex,
  totalCards,
  currentTeamName,
  currentTeamScore,
  remainingSeconds,
  roundStatus,
  hasNextTeam,
  nextTeamName,
  onExit,
  onStartTurn,
  onStartNextTeam,
  onFinishGame,
  onSkip,
  onCorrect,
}: TeamGameScreenProps) {
  const player = useAudioPlayer(TIME_UP_SOUND_URI);
  const previousStatus = useRef<TeamRoundStatus>(roundStatus);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const playTimeoutAlert = async () => {
      try {
        await player.seekTo(0);
      } catch {
        // Ignore seek failures and still attempt playback.
      }

      player.play();
    };

    if (roundStatus === 'time-up' && previousStatus.current !== 'time-up') {
      void playTimeoutAlert();
    }

    previousStatus.current = roundStatus;
  }, [player, roundStatus]);

  const isPlaying = roundStatus === 'playing';
  const isIdle = roundStatus === 'idle';
  const isTimeUp = roundStatus === 'time-up';

  return (
    <View style={styles.gameScreenContent}>
      <View style={styles.headerStack}>
        <View
          style={[
            styles.teamBanner,
            {
              borderColor: scene.rail,
              backgroundColor: tokens.panel,
              shadowColor: scene.cardShadow,
            },
          ]}
        >
          <Text style={[styles.teamBannerEyebrow, { color: scene.topTag }]}> {Consts.UI_TRANSLATIONS[language].TEAM_MODE_TITLE}</Text>
          <Text style={[styles.teamBannerTitle, { color: tokens.text }]}>{currentTeamName}</Text>
          {//<Text style={[styles.teamBannerDescription, { color: tokens.mutedText }]}>{Consts.UI_TRANSLATIONS[language].TEAM_MODE_DESCRIPTION}</Text>-->
          }
        </View>

        <View style={styles.gameHead}>
          <StatCard
            value={`${remainingSeconds}s`}
            label={Consts.UI_TRANSLATIONS[language].LABEL_TEMPO_RESTANTE}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={remainingSeconds <= 10 ? tokens.warning : tokens.text}
            labelColor={tokens.mutedText}
          />
          <StatCard
            value={currentTeamScore}
            label={Consts.UI_TRANSLATIONS[language].LABEL_PONTOS_DA_EQUIPE}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={tokens.success}
            labelColor={tokens.mutedText}
          />
          <StatCard
            value={teamScores.length}
            label={Consts.UI_TRANSLATIONS[language].LABEL_EQUIPES}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={tokens.text}
            labelColor={tokens.mutedText}
          />
        </View>

        <View style={styles.scoreboardWrap}>
          {teamScores.map((team) => {
            const isCurrentTeam = team.name === currentTeamName;

            return (
              <View
                key={team.id}
                style={[
                  styles.scoreBadge,
                  {
                    borderColor: isCurrentTeam ? tokens.primary : scene.rail,
                    backgroundColor: isCurrentTeam ? scene.chipPanel : tokens.panel,
                  },
                ]}
              >
                <Text style={[styles.scoreBadgeName, { color: tokens.text }]}>{team.name}</Text>
                <Text
                  style={[
                    styles.scoreBadgeValue,
                    { color: isCurrentTeam ? tokens.primary : tokens.mutedText },
                  ]}
                >
                  {team.score}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {isPlaying ? (
        <WordGameCard
          card={currentCard}
          index={currentIndex}
          total={totalCards}
          borderColor={scene.rail}
          backgroundColor={tokens.panel}
          chipPanelColor={scene.chipPanel}
          textColor={tokens.text}
          mutedTextColor={tokens.mutedText}
          warningColor={tokens.warning}
          shadowColor={scene.cardShadow}
          language={language}
        />
      ) : (
        <View
          style={[
            styles.hiddenCardState,
            {
              borderColor: isTimeUp ? tokens.warning : scene.rail,
              backgroundColor: tokens.panel,
              shadowColor: scene.cardShadow,
            },
          ]}
        >
          <Text style={[styles.hiddenCardTitle, { color: isTimeUp ? tokens.warning : tokens.text }]}>
            {isIdle ? Consts.UI_TRANSLATIONS[language].LABEL_CARTA_OCULTA_ATE_O_INICIO : Consts.UI_TRANSLATIONS[language].LABEL_CARTA_OCULTA_ATE_A_PROXIMA_EQUIPE}
          </Text>
          <Text style={[styles.hiddenCardBody, { color: tokens.mutedText }]}>
            {isIdle
              ? Consts.UI_TRANSLATIONS[language].LABEL_CARTA_OCULTA_ATE_O_INICIO.replace('{team}', currentTeamName.toLowerCase())
              : Consts.UI_TRANSLATIONS[language].LABEL_CARTA_OCULTA_ATE_A_PROXIMA_EQUIPE}
          </Text>
        </View>
      )}

      <View style={styles.actionColumn}>
        {isIdle ? (
          <View
            style={[
              styles.transitionCard,
              { borderColor: scene.rail, backgroundColor: scene.chipPanel },
            ]}
          >
            <Text style={[styles.transitionTitle, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].TEAM_MODE_TITLE}</Text>
            <Text style={[styles.transitionBody, { color: tokens.mutedText }]}>{Consts.UI_TRANSLATIONS[language].TEAM_MODE_DESCRIPTION}</Text>
            <ActionButton
              label={`iniciar ${currentTeamName.toLowerCase()}`}
              onPress={onStartTurn}
              backgroundColor={tokens.primary}
              textColor={tokens.primaryText}
            />
          </View>
        ) : null}

        {isTimeUp ? (
          <View
            style={[
              styles.transitionCard,
              { borderColor: tokens.warning, backgroundColor: scene.chipPanel },
            ]}
          >
            <Text style={[styles.transitionTitle, { color: tokens.warning }]}>{Consts.UI_TRANSLATIONS[language].LABEL_TEMPO_ESGOTADO}</Text>
            <Text style={[styles.transitionBody, { color: tokens.mutedText }]}>
              {Consts.UI_TRANSLATIONS[language].LABEL_RODADA_TERMINOU.replace('{team}', currentTeamName.toLowerCase())}
            </Text>
            <ActionButton
              label={hasNextTeam && nextTeamName ? `iniciar ${nextTeamName.toLowerCase()}` : Consts.UI_TRANSLATIONS[language].LABEL_VER_PLACAR_FINAL}
              onPress={hasNextTeam ? onStartNextTeam : onFinishGame}
              backgroundColor={tokens.primary}
              textColor={tokens.primaryText}
            />
          </View>
        ) : null}

        <ActionButton
          label={Consts.UI_TRANSLATIONS[language].LABEL_SAIR}
          onPress={onExit}
          backgroundColor={scene.chipPanel}
          borderColor={tokens.warning}
          textColor={tokens.warning}
        />
        <View style={styles.rowButtons}>
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_PULAR}
            onPress={onSkip}
            backgroundColor={tokens.warning}
            textColor={tokens.primaryText}
            disabled={!currentCard || !isPlaying}
            style={styles.halfButton}
          />
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_ACERTOU}
            onPress={onCorrect}
            backgroundColor={tokens.success}
            textColor="#ffffff"
            disabled={!currentCard || !isPlaying}
            style={styles.halfButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameScreenContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 22,
    justifyContent: 'space-between',
    gap: 14,
  },
  headerStack: {
    gap: 10,
  },
  teamBanner: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 4,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 5,
  },
  teamBannerEyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: BODY_FONT,
    fontWeight: '700',
  },
  teamBannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  teamBannerDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: BODY_FONT,
  },
  gameHead: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreboardWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hiddenCardState: {
    minHeight: 260,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    justifyContent: 'center',
    gap: 8,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 5,
  },
  hiddenCardTitle: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
    textAlign: 'center',
  },
  hiddenCardBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: BODY_FONT,
    textAlign: 'center',
  },
  scoreBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 110,
    gap: 2,
  },
  scoreBadgeName: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  scoreBadgeValue: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  actionColumn: {
    flexDirection: 'column',
    gap: 10,
  },
  transitionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  transitionTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  transitionBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: BODY_FONT,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
});