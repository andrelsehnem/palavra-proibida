import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/buttons/ActionButton';
import { Consts, type LanguageCode } from '../data/Consts';
import type { ClassicRoundResult } from '../domain/types';
import { BODY_FONT, DISPLAY_FONT } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface ClassicResultsScreenProps {
  tokens: ThemeTokens;
  scene: ScenePalette;
  language: LanguageCode;
  roundNumber: number;
  roundResults: ClassicRoundResult[];
  totalCorrect: number;
  isMatchFinished: boolean;
  onNextRound: () => void;
  onFinishMatch: () => void;
  onBackToMenu: () => void;
}

export function ClassicResultsScreen({
  tokens,
  scene,
  language,
  roundNumber,
  roundResults,
  totalCorrect,
  isMatchFinished,
  onNextRound,
  onFinishMatch,
  onBackToMenu,
}: ClassicResultsScreenProps) {
  const t = Consts.UI_TRANSLATIONS[language];
  const sortedResults = [...roundResults].sort((left, right) => right.correct - left.correct);
  const bestScore = sortedResults[0]?.correct ?? 0;

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
          {isMatchFinished
            ? t.LABEL_RESULTADO_FINAL
            : t.LABEL_RODADA_NUMERO.replace('{round}', `${roundNumber}`)}
        </Text>

        <View style={[styles.totalRow, { borderColor: tokens.success, backgroundColor: scene.chipPanel }]}>
          <Text style={[styles.meta, { color: tokens.success }]}>{t.LABEL_TOTAL_ACUMULADO}</Text>
          <Text style={[styles.scoreValue, { color: tokens.success }]}>{totalCorrect}</Text>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={styles.listColumn}>
          {sortedResults.map((result, index) => {
            const isBest = result.correct === bestScore;

            return (
              <View
                key={result.round}
                style={[
                  styles.scoreRow,
                  {
                    borderColor: isBest ? tokens.success : scene.rail,
                    backgroundColor: isBest ? scene.chipPanel : tokens.panel,
                  },
                ]}
              >
                <Text style={[styles.position, { color: isBest ? tokens.success : tokens.mutedText }]}>
                  {index + 1}
                </Text>
                <View style={styles.textColumn}>
                  <Text style={[styles.roundName, { color: tokens.text }]}>
                    {t.LABEL_RODADA_NUMERO.replace('{round}', `${result.round}`)}
                  </Text>
                  <Text style={[styles.meta, { color: isBest ? tokens.success : tokens.mutedText }]}>
                    {isBest ? `${t.LABEL_MELHOR_RODADA} · ` : ''}
                    {result.skipped} {t.LABEL_PULADAS}
                  </Text>
                </View>
                <Text style={[styles.scoreValue, { color: isBest ? tokens.success : tokens.text }]}>
                  {result.correct}
                </Text>
              </View>
            );
          })}
        </ScrollView>

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
              onPress={onFinishMatch}
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
    flexShrink: 1,
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
  totalRow: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    flexShrink: 1,
  },
  listColumn: {
    gap: 10,
  },
  scoreRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  position: {
    width: 24,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
    textAlign: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  roundName: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  meta: {
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
