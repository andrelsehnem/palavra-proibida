import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/buttons/ActionButton';
import { LanguageDropdown } from '../components/cards/LanguageDropdown';
import { StatCard } from '../components/cards/StatCard';
import { Consts, type LanguageCode } from '../data/Consts';
import type { ThemeMode } from '../domain/types';
import { BODY_FONT, DISPLAY_FONT } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface MenuScreenProps {
  mode: ThemeMode;
  tokens: ThemeTokens;
  scene: ScenePalette;
  themesCount: number;
  cardsCount: number;
  language: LanguageCode;
  onChangeLanguage: (language: LanguageCode) => void;
  onStart: () => void;
  onToggleMode: () => void;
}

export function MenuScreen({
  mode,
  tokens,
  scene,
  themesCount,
  cardsCount,
  language,
  onChangeLanguage,
  onStart,
  onToggleMode,
}: MenuScreenProps) {
  return (
    <View style={styles.menuContent}>
      <View
        style={[
          styles.heroShell,
          {
            backgroundColor: tokens.panel,
            borderColor: scene.rail,
            shadowColor: scene.cardShadow,
          },
        ]}
      >
        <View style={styles.heroStripe}>
          <Text style={[styles.tagText, { color: scene.topTag }]}></Text>
          <View style={styles.controlsContainer}>
            <Pressable
              onPress={onToggleMode}
              style={[
                styles.themeSwitch,
                {
                  borderColor: tokens.border,
                  backgroundColor: scene.chipPanel,
                },
              ]}
            >
              <Text style={[styles.themeSwitchLabel, { color: tokens.text }]}>
                {mode === 'dark' ? 'light mode' : 'dark mode'}
              </Text>
            </Pressable>
            <LanguageDropdown
              selectedLanguage={language}
              onSelectLanguage={onChangeLanguage}
              tokens={tokens}
              scene={scene}
            />
          </View>
        </View>

        <Text style={[styles.heroTitle, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].WORDS}</Text>
        <Text style={[styles.heroTitleOutline, { color: tokens.primary }]}>{Consts.UI_TRANSLATIONS[language].WORDFORBIDDEN}</Text>
        <Text style={[styles.heroSubtitle, { color: tokens.mutedText }]}>
          {Consts.UI_TRANSLATIONS[language].MENU_SUBTITLE}        </Text>

        <View style={styles.kpiBand}>
          <StatCard
            value={themesCount}
            label={Consts.UI_TRANSLATIONS[language].THEME_COUNT_LABEL}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={tokens.text}
            labelColor={tokens.mutedText}
          />
          <StatCard
            value={cardsCount}
            label={Consts.UI_TRANSLATIONS[language].CARD_COUNT_LABEL}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={tokens.text}
            labelColor={tokens.mutedText}
          />
        </View>

        <ActionButton
          label={Consts.UI_TRANSLATIONS[language].START_GAME}
          onPress={onStart}
          backgroundColor={tokens.primary}
          textColor={tokens.primaryText}
          style={styles.heroCta}
        />

        <Text style={[styles.footerHint, { color: tokens.mutedText }]}>{Consts.UI_TRANSLATIONS[language].FOOTER_HOME}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  heroShell: {
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 8,
    gap: 18,
  },
  heroStripe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  tagText: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    fontFamily: BODY_FONT,
    fontWeight: '700',
  },
  themeSwitch: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  themeSwitchLabel: {
    fontSize: 12,
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 52,
    lineHeight: 54,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
  },
  heroTitleOutline: {
    fontSize: 60,
    lineHeight: 62,
    marginTop: -16,
    fontFamily: DISPLAY_FONT,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: BODY_FONT,
    lineHeight: 20,
  },
  kpiBand: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 50,
  },
  heroCta: {
    marginTop: 4,
  },
  footerHint: {
    fontSize: 13,
    fontFamily: BODY_FONT,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
