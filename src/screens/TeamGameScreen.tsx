import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { ActionButton } from '../components/buttons/ActionButton';
import { StatCard } from '../components/cards/StatCard';
import { WordGameCard } from '../components/cards/WordGameCard';
import { Consts, type LanguageCode } from '../data/Consts';
import { TIME_UP_SOUND_URI } from '../data/timeoutAlert';
import type { TeamRoundStatus, TeamScore, WordCard } from '../domain/types';
import { BRICOLAGE_800, INTER_400, INTER_700 } from '../theme/fonts';
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
  roundNumber: number;
  hasNextTeam: boolean;
  nextTeamName: string | null;
  onExit: () => void;
  onStartTurn: () => void;
  onStartNextTeam: () => void;
  onEndRound: () => void;
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
  roundNumber,
  hasNextTeam,
  nextTeamName,
  onExit,
  onStartTurn,
  onStartNextTeam,
  onEndRound,
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
          <View style={styles.teamBannerTexts}>
            <Text style={[styles.teamBannerEyebrow, { color: scene.topTag }]}>{Consts.UI_TRANSLATIONS[language].TEAM_MODE_TITLE} · {Consts.UI_TRANSLATIONS[language].LABEL_RODADA_NUMERO.replace('{round}', `${roundNumber}`)}</Text>
            <Text style={[styles.teamBannerTitle, { color: tokens.text }]} numberOfLines={1}>{currentTeamName}</Text>
          </View>
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_SAIR}
            onPress={onExit}
            icon="close"
            size="compact"
            backgroundColor="transparent"
            borderColor={scene.rail}
            textColor={tokens.mutedText}
          />
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
                    { color: isCurrentTeam ? scene.topTag : tokens.mutedText },
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
          <Ionicons
            name={isTimeUp ? 'alarm-outline' : 'eye-off-outline'}
            size={36}
            color={isTimeUp ? tokens.warning : tokens.mutedText}
          />
          <Text style={[styles.hiddenCardTitle, { color: isTimeUp ? tokens.warning : tokens.text }]}>
            {isIdle ? Consts.UI_TRANSLATIONS[language].LABEL_CARTA_OCULTA_ATE_O_INICIO : Consts.UI_TRANSLATIONS[language].LABEL_CARTA_OCULTA_ATE_A_PROXIMA_EQUIPE}
          </Text>
        </View>
      )}

      <View style={styles.actionColumn}>
        {isIdle ? (
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_INICIAR_EQUIPE.replace('{team}', currentTeamName.toLowerCase())}
            onPress={onStartTurn}
            icon="play"
            size="large"
            backgroundColor={tokens.primary}
            textColor={tokens.primaryText}
          />
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
              label={hasNextTeam && nextTeamName ? Consts.UI_TRANSLATIONS[language].LABEL_INICIAR_EQUIPE.replace('{team}', nextTeamName.toLowerCase()) : Consts.UI_TRANSLATIONS[language].LABEL_VER_RANKING}
              onPress={hasNextTeam ? onStartNextTeam : onEndRound}
              icon={hasNextTeam ? 'play' : 'trophy'}
              backgroundColor={tokens.primary}
              textColor={tokens.primaryText}
            />
          </View>
        ) : null}

        {isPlaying ? (
        <View style={styles.rowButtons}>
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_PULAR}
            onPress={onSkip}
            icon="play-skip-forward"
            size="large"
            backgroundColor={tokens.warning}
            textColor={tokens.mode === 'dark' ? '#0A0F1F' : '#FFFFFF'}
            disabled={!currentCard || !isPlaying}
            style={styles.halfButton}
          />
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_ACERTOU}
            onPress={onCorrect}
            icon="checkmark-circle"
            size="large"
            backgroundColor={tokens.success}
            textColor="#ffffff"
            disabled={!currentCard || !isPlaying}
            style={styles.halfButton}
          />
        </View>
        ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 5,
  },
  teamBannerTexts: {
    flex: 1,
    gap: 4,
  },
  teamBannerEyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: INTER_700,
  },
  teamBannerTitle: {
    fontSize: 28,
    fontFamily: BRICOLAGE_800,
  },
  teamBannerDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: INTER_400,
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
    flex: 1,
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 5,
  },
  hiddenCardTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: BRICOLAGE_800,
    textAlign: 'center',
  },
  hiddenCardBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: INTER_400,
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
    fontFamily: INTER_700,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  scoreBadgeValue: {
    fontSize: 22,
    fontFamily: BRICOLAGE_800,
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
    fontFamily: BRICOLAGE_800,
  },
  transitionBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: INTER_400,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
});