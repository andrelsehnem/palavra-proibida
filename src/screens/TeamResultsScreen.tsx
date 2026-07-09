import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/buttons/ActionButton';
import type { TeamScore } from '../domain/types';
import { BODY_FONT, DISPLAY_FONT } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface TeamResultsScreenProps {
  tokens: ThemeTokens;
  scene: ScenePalette;
  teamScores: TeamScore[];
  winningTeamIds: string[];
  isTie: boolean;
  onBackToMenu: () => void;
}

export function TeamResultsScreen({
  tokens,
  scene,
  teamScores,
  winningTeamIds,
  isTie,
  onBackToMenu,
}: TeamResultsScreenProps) {
  const sortedScores = [...teamScores].sort((left, right) => right.score - left.score);

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
        <Text style={[styles.eyebrow, { color: scene.topTag }]}>placar final</Text>
        <Text style={[styles.title, { color: tokens.text }]}>Resultado da rodada</Text>
        <Text style={[styles.subtitle, { color: tokens.mutedText }]}>
          {isTie
            ? 'Empate no topo. Todas as equipes lideres foram destacadas.'
            : 'A equipe com mais acertos fica destacada no topo.'}
        </Text>

        <View style={styles.listColumn}>
          {sortedScores.map((team, index) => {
            const isWinner = winningTeamIds.includes(team.id);

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
                      {isWinner ? 'vencedora' : 'placar da rodada'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.scoreValue, { color: isWinner ? tokens.success : tokens.text }]}>
                  {team.score}
                </Text>
              </View>
            );
          })}
        </View>

        <ActionButton
          label="voltar ao menu"
          onPress={onBackToMenu}
          backgroundColor={tokens.primary}
          textColor={tokens.primaryText}
        />
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
    fontFamily: BODY_FONT,
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: BODY_FONT,
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
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
    textAlign: 'center',
  },
  scoreTextColumn: {
    flex: 1,
    gap: 2,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  teamMeta: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
});