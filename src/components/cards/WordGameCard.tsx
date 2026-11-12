import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { WordCard } from '../../domain/types';
import { BRICOLAGE_800, INTER_400, INTER_600, INTER_700 } from '../../theme/fonts';
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
      <View style={styles.metaRow}>
        <View style={[styles.themeChip, { borderColor, backgroundColor: chipPanelColor }]}>
          <Text style={[styles.themeChipText, { color: mutedTextColor }]} numberOfLines={1}>
            {card.theme}
          </Text>
        </View>
        <Text style={[styles.progressText, { color: mutedTextColor }]}>
          {index + 1} / {total}
        </Text>
      </View>

      <View style={styles.wordBlock}>
        <Text style={[styles.wordLabel, { color: mutedTextColor }]}>{Consts.UI_TRANSLATIONS[language].MAIN_WORD}</Text>
        <Text
          style={[styles.wordValue, { color: textColor }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {card.mainWord}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      <View style={styles.forbiddenBlock}>
        <Text style={[styles.forbiddenTitle, { color: warningColor }]}>{Consts.UI_TRANSLATIONS[language].FORBIDDEN_WORDS}</Text>
        {card.forbiddenWords.map((forbiddenWord) => (
          <View key={`${card.id}-${forbiddenWord}`} style={styles.forbiddenItem}>
            <Ionicons name="close-circle" size={18} color={warningColor} />
            <Text style={[styles.forbiddenText, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
              {forbiddenWord}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: INTER_400,
    lineHeight: 20,
  },
  wordCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 18,
    elevation: 7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  themeChip: {
    flexShrink: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  themeChipText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
    fontFamily: INTER_700,
  },
  progressText: {
    fontSize: 12,
    fontFamily: INTER_600,
    letterSpacing: 0.8,
  },
  wordBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  wordLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontFamily: INTER_700,
  },
  wordValue: {
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    fontFamily: BRICOLAGE_800,
  },
  divider: {
    height: 2,
    borderRadius: 1,
  },
  forbiddenBlock: {
    gap: 8,
  },
  forbiddenTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontFamily: INTER_700,
    marginBottom: 2,
  },
  forbiddenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  forbiddenText: {
    flex: 1,
    fontSize: 18,
    textTransform: 'capitalize',
    fontFamily: INTER_600,
  },
});
