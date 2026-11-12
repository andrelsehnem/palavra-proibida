import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/buttons/ActionButton';
import { Consts, type LanguageCode } from '../data/Consts';
import type { TeamScore } from '../domain/types';
import { BRICOLAGE_800, INTER_400, INTER_700 } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface TeamResultsScreenProps {
  tokens: ThemeTokens;
  scene: ScenePalette;
  teamScores: TeamScore[];
  winningTeamIds: string[];
  isTie: boolean;
  language: LanguageCode;
  roundNumber: number;
  isMatchFinished: boolean;
  onNextRound: () => void;
  onFinishMatch: () => void;
  onBackToMenu: () => void;
}

export function TeamResultsScreen({
  tokens,
  scene,
  teamScores,
  winningTeamIds,
  isTie,
  language,
  roundNumber,
  isMatchFinished,
  onNextRound,
  onFinishMatch,
  onBackToMenu,
}: TeamResultsScreenProps) {
  const t = Consts.UI_TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'overall' | 'round'>('overall');
  const isRoundTab = activeTab === 'round';
  const roundLabel = t.LABEL_RODADA_NUMERO.replace('{round}', `${roundNumber}`);
  const getTabScore = (team: TeamScore) => (isRoundTab ? team.roundScore : team.score);
  const sortedScores = [...teamScores].sort((left, right) => getTabScore(right) - getTabScore(left));
  const topRoundScore = Math.max(0, ...teamScores.map((team) => team.roundScore));
  const roundLeaderIds = teamScores
    .filter((team) => team.roundScore === topRoundScore)
    .map((team) => team.id);
  const highlightedIds = isRoundTab ? roundLeaderIds : winningTeamIds;
  const isTabTie = isRoundTab ? roundLeaderIds.length > 1 : isTie;
  const tabs = [
    { id: 'overall' as const, label: t.LABEL_ABA_GERAL },
    { id: 'round' as const, label: roundLabel },
  ];

  return (
    <View style={styles.screenContent}>
      <View
        style={[
          styles.panel,
          {
            backgroundColor: tokens.panel,
            borderColor: scene.rail,
            shadowColor: scene.cardShadow,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: scene.topTag }]}>
          {isMatchFinished ? t.LABEL_PLACAR_FINAL : t.LABEL_RANKING}
        </Text>
        <Text style={[styles.title, { color: tokens.text }]}>
          {isMatchFinished ? t.LABEL_RESULTADO_FINAL : roundLabel}
        </Text>
        <Text style={[styles.subtitle, { color: tokens.mutedText }]}>
          {isTabTie ? t.LABEL_RESULTADO_EMPATE : t.LABEL_RESULTADO_LIDER}
        </Text>

        <View style={[styles.tabRow, { borderColor: scene.rail }]} accessibilityRole="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, isActive ? { backgroundColor: tokens.primary } : null]}
              >
                <Text style={[styles.tabLabel, { color: isActive ? tokens.primaryText : tokens.mutedText }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listColumn}>
          {sortedScores.map((team, index) => {
            const isWinner = highlightedIds.includes(team.id);
            const leaderLabel = isRoundTab
              ? t.LABEL_MELHOR_DA_RODADA
              : isMatchFinished
                ? t.LABEL_VENCEDORA
                : t.LABEL_LIDER;

            return (
              <View
                key={team.id}
                style={[
                  styles.scoreRow,
                  {
                    borderColor: isWinner ? tokens.success : scene.rail,
                    backgroundColor: isWinner ? scene.chipPanel : tokens.panel,
                  },
                ]}
              >
                <View style={styles.scoreRowLead}>
                  <Text style={[styles.position, { color: isWinner ? tokens.success : tokens.mutedText }]}>
                    {index + 1}
                  </Text>
                  <View style={styles.scoreTextColumn}>
                    <Text style={[styles.teamName, { color: tokens.text }]}>{team.name}</Text>
                    <Text style={[styles.teamMeta, { color: isWinner ? tokens.success : tokens.mutedText }]}>
                      {isWinner
                        ? leaderLabel
                        : isRoundTab
                          ? t.LABEL_PONTOS_DA_RODADA
                          : t.LABEL_PONTOS_ACUMULADOS}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.scoreValue, { color: isWinner ? tokens.success : tokens.text }]}>
                  {getTabScore(team)}
                </Text>
              </View>
            );
          })}
        </View>

        {isMatchFinished ? (
          <ActionButton
            label={t.LABEL_VOLTAR_AO_MENU}
            onPress={onBackToMenu}
            backgroundColor={tokens.primary}
            textColor={tokens.primaryText}
          />
        ) : (
          <>
            <ActionButton
              label={t.LABEL_PROXIMA_RODADA}
              onPress={onNextRound}
              backgroundColor={tokens.primary}
              textColor={tokens.primaryText}
            />
            <ActionButton
              label={t.LABEL_FINALIZAR_PARTIDA}
              onPress={() => {
                setActiveTab('overall');
                onFinishMatch();
              }}
              backgroundColor={scene.chipPanel}
              borderColor={tokens.warning}
              textColor={tokens.warning}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 12,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  eyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: INTER_700,
  },
  title: {
    fontSize: 32,
    fontFamily: BRICOLAGE_800,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: INTER_400,
  },
  tabRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: INTER_700,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  listColumn: {
    gap: 10,
    marginVertical: 6,
  },
  scoreRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  scoreRowLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  position: {
    width: 24,
    fontSize: 18,
    fontFamily: BRICOLAGE_800,
    textAlign: 'center',
  },
  scoreTextColumn: {
    flex: 1,
    gap: 2,
  },
  teamName: {
    fontSize: 18,
    fontFamily: BRICOLAGE_800,
  },
  teamMeta: {
    fontSize: 12,
    fontFamily: INTER_700,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  scoreValue: {
    fontSize: 34,
    fontFamily: BRICOLAGE_800,
  },
});