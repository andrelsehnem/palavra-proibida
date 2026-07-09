import { StyleSheet, Text, View } from 'react-native';

import type { WordCard } from '../../domain/types';
import { BODY_FONT, DISPLAY_FONT } from '../../theme/fonts';
import { Consts, type LanguageCode } from '../../data/Consts';

interface WordGameCardProps {
  card: WordCard | null;
  index: number;
  total: number;
  borderColor: string;
  backgroundColor: string;
  chipPanelColor: string;
  textColor: string;
  mutedTextColor: string;
  warningColor: string;
  shadowColor: string;
  language: LanguageCode;
}

export function WordGameCard({
  card,
  index,
  total,
  borderColor,
  backgroundColor,
  chipPanelColor,
  textColor,
  mutedTextColor,
  warningColor,
  shadowColor,
  language,
}: WordGameCardProps) {
  if (!card) {
    return (
      <View style={styles.centeredBlock}>
        <Text style={[styles.helperText, { color: warningColor }]}>{Consts.UI_TRANSLATIONS[language].NO_CARDS_AVAILABLE}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wordCard,
        {
          borderColor,
          shadowColor,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.wordTheme, { color: mutedTextColor }]}>{card.theme}</Text>
      <Text style={[styles.wordLabel, { color: mutedTextColor }]}>{Consts.UI_TRANSLATIONS[language].MAIN_WORD}</Text>
      <Text style={[styles.wordValue, { color: textColor }]}>{card.mainWord}</Text>

      <View style={[styles.forbiddenBlock, { borderColor, backgroundColor: chipPanelColor }]}>
        <Text style={[styles.forbiddenTitle, { color: mutedTextColor }]}>{Consts.UI_TRANSLATIONS[language].FORBIDDEN_WORDS}</Text>
        {card.forbiddenWords.map((forbiddenWord) => (
          <View key={`${card.id}-${forbiddenWord}`} style={styles.forbiddenItem}>
            <Text style={[styles.forbiddenBullet, { color: warningColor }]}>x</Text>
            <Text style={[styles.forbiddenText, { color: textColor }]}>{forbiddenWord}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.progressText, { color: mutedTextColor }]}>
        {index + 1} de {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredBlock: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: BODY_FONT,
    lineHeight: 20,
  },
  wordCard: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 9,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 18,
    elevation: 7,
  },
  wordTheme: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    fontSize: 11,
    fontFamily: BODY_FONT,
  },
  wordValue: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    textTransform: 'capitalize',
    fontFamily: DISPLAY_FONT,
  },
  wordLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: BODY_FONT,
  },
  forbiddenBlock: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  forbiddenTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: BODY_FONT,
  },
  forbiddenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  forbiddenBullet: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'uppercase',
    fontFamily: BODY_FONT,
  },
  forbiddenText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
    fontFamily: BODY_FONT,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
