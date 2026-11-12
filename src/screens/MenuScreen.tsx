import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LanguageDropdown } from '../components/cards/LanguageDropdown';
import { Consts, type LanguageCode } from '../data/Consts';
import type { ThemeMode } from '../domain/types';
import { BRICOLAGE_800, INTER_400, INTER_600, INTER_700 } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface MenuScreenProps {
  mode: ThemeMode;
  tokens: ThemeTokens;
  scene: ScenePalette;
  language: LanguageCode;
  onChangeLanguage: (language: LanguageCode) => void;
  onStart: () => void;
  onToggleMode: () => void;
}

const BRAND_BLUE = '#1F66E5';
const BRAND_BLUE_DEEP = '#123F94';
const BRAND_ORANGE = '#FF9F43';

export const MENU_COLORS: Record<
  ThemeMode,
  {
    background: string;
    title: string;
    subtitle: string;
    footer: string;
    link: string;
    pillBackground: string;
    pillBorder: string;
    pillText: string;
    frontCardShadowOpacity: number;
    frontCardShadowRadius: number;
    frontCardShadowColor: string;
  }
> = {
  dark: {
    background: '#0A0F1F',
    title: '#F5F7FF',
    subtitle: '#B4BDD1',
    footer: '#A3ADC2',
    link: '#8DB8FF',
    pillBackground: '#151B2E',
    pillBorder: '#2A3350',
    pillText: '#E6EAF5',
    frontCardShadowOpacity: 0.45,
    frontCardShadowRadius: 20,
    frontCardShadowColor: '#000000',
  },
  light: {
    background: '#F3F0E8',
    title: '#111827',
    subtitle: '#4B5563',
    footer: '#4B5563',
    link: '#1A56C4',
    pillBackground: '#FFFFFF',
    pillBorder: '#D9D4C7',
    pillText: '#1F2937',
    frontCardShadowOpacity: 0.18,
    frontCardShadowRadius: 18,
    frontCardShadowColor: '#111827',
  },
};

// Medidas de referência do design (390 px de largura - 2 × 24 px de margem).
const STACK_WIDTH = 342;
const STACK_HEIGHT = 304;

const IS_WEB = Platform.OS === 'web';

export function MenuScreen({
  mode,
  tokens,
  scene,
  language,
  onChangeLanguage,
  onStart,
  onToggleMode,
}: MenuScreenProps) {
  const colors = MENU_COLORS[mode];
  const t = Consts.UI_TRANSLATIONS[language];
  const [stackScale, setStackScale] = useState(1);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, IS_WEB && styles.contentWeb]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={onToggleMode}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.pill,
            {
              backgroundColor: colors.pillBackground,
              borderColor: colors.pillBorder,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons
            name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={16}
            color={colors.pillText}
          />
          <Text style={[styles.pillLabel, { color: colors.pillText }]}>
            {mode === 'dark' ? t.MENU_LIGHT_MODE : t.MENU_DARK_MODE}
          </Text>
        </Pressable>
        <LanguageDropdown
          selectedLanguage={language}
          onSelectLanguage={onChangeLanguage}
          tokens={tokens}
          scene={scene}
          triggerColors={{
            background: colors.pillBackground,
            border: colors.pillBorder,
            text: colors.pillText,
          }}
        />
      </View>

      <View
        style={[styles.stackArea, { height: STACK_HEIGHT * stackScale }]}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          setStackScale(Math.min(1, width / STACK_WIDTH));
        }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View
          style={[
            styles.stack,
            {
              transform: [
                { translateY: (STACK_HEIGHT * (stackScale - 1)) / 2 },
                { scale: stackScale },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.card,
              styles.backCard,
              { left: 14, top: 34, backgroundColor: BRAND_ORANGE, transform: [{ rotate: '-13deg' }] },
            ]}
          >
            <View style={[styles.cardBarSmall, { backgroundColor: 'rgba(10, 15, 31, 0.28)' }]} />
            <View style={[styles.cardBarLarge, { backgroundColor: 'rgba(10, 15, 31, 0.28)' }]} />
          </View>

          <View
            style={[
              styles.card,
              styles.backCard,
              {
                left: 132,
                top: 30,
                backgroundColor: BRAND_BLUE,
                alignItems: 'flex-end',
                transform: [{ rotate: '10deg' }],
              },
            ]}
          >
            <View style={[styles.cardBarSmall, { backgroundColor: 'rgba(255, 255, 255, 0.35)' }]} />
            <View style={[styles.cardBarLarge, { backgroundColor: 'rgba(255, 255, 255, 0.35)' }]} />
          </View>

          <View
            style={[
              styles.card,
              styles.frontCard,
              {
                shadowColor: colors.frontCardShadowColor,
                shadowOpacity: colors.frontCardShadowOpacity,
                shadowRadius: colors.frontCardShadowRadius,
              },
            ]}
          >
            <Text style={[styles.cardLabel, { color: '#5B6478' }]}>{t.MENU_CARD_WORD_LABEL}</Text>
            <Text style={styles.cardWord} numberOfLines={1} adjustsFontSizeToFit>
              {t.MENU_CARD_EXAMPLE_WORD.toUpperCase()}
            </Text>
            <View style={styles.cardDivider} />
            <Text style={[styles.cardLabel, { color: '#B93A0B' }]}>{t.MENU_CARD_FORBIDDEN_LABEL}</Text>
            <View style={styles.forbiddenList}>
              {t.MENU_CARD_EXAMPLE_FORBIDDEN.split(', ').map((word) => (
                <View key={word} style={styles.forbiddenItem}>
                  <Text style={styles.forbiddenWord}>{word}</Text>
                  <View style={styles.strike} />
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.seal, { borderColor: colors.background }]}>
            <MaterialCommunityIcons name="cancel" size={28} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.title }]}>{t.WORDS}</Text>
        <View style={styles.titleTag}>
          <Text style={[styles.title, styles.titleTagText]}>{t.WORDFORBIDDEN.toUpperCase()}</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>{t.MENU_SUBTITLE}</Text>
      </View>

      <View style={[styles.spacer, IS_WEB && styles.spacerWeb]} />

      <View style={styles.actions}>
        <Pressable onPress={onStart} accessibilityRole="button" style={styles.ctaShell}>
          {({ pressed }) => (
            <>
              <View style={styles.ctaRelief} />
              <View style={[styles.cta, pressed && styles.ctaPressed]}>
                <Ionicons name="play" size={18} color="#FFFFFF" />
                <Text style={styles.ctaLabel}>{t.START_GAME.toUpperCase()}</Text>
              </View>
            </>
          )}
        </Pressable>

        <Text style={[styles.footer, { color: colors.footer }]}>
          {t.FOOTER_HOME.trim()}{' '}
          <Text
            style={[styles.footerLink, { color: colors.link }]}
            onPress={() => Linking.openURL('https://andre100.dev')}
          >
            andre100.dev
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  // Só na web: em janelas largas o conteúdo fica numa coluna central,
  // com a largura do design, em vez de esticar pela tela toda.
  contentWeb: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  spacerWeb: {
    flexGrow: 0,
    minHeight: 36,
  },
  topBar: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  pill: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillLabel: {
    fontSize: 12,
    fontFamily: INTER_700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  stackArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  stack: {
    width: STACK_WIDTH,
    height: STACK_HEIGHT,
  },
  card: {
    position: 'absolute',
    width: 196,
    borderRadius: 22,
  },
  backCard: {
    height: 250,
    padding: 22,
    justifyContent: 'center',
    gap: 12,
  },
  cardBarSmall: {
    width: 70,
    height: 12,
    borderRadius: 6,
  },
  cardBarLarge: {
    width: 120,
    height: 26,
    borderRadius: 8,
  },
  frontCard: {
    left: 73,
    top: 20,
    height: 262,
    padding: 22,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-3deg' }],
    shadowOffset: { width: 0, height: 18 },
    elevation: 14,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: INTER_700,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  cardWord: {
    marginTop: 6,
    fontSize: 40,
    lineHeight: 40,
    fontFamily: BRICOLAGE_800,
    letterSpacing: -0.5,
    color: '#111827',
  },
  cardDivider: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  forbiddenList: {
    marginTop: 8,
    gap: 4,
  },
  forbiddenItem: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  forbiddenWord: {
    fontSize: 17,
    fontFamily: INTER_600,
    color: '#374151',
  },
  // Linha desenhada por cima: textDecorationColor não funciona no Android.
  strike: {
    position: 'absolute',
    left: -1,
    right: -1,
    height: 2,
    top: '52%',
    backgroundColor: '#E2531B',
  },
  seal: {
    position: 'absolute',
    left: 236,
    top: 4,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    marginTop: 22,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 54,
    lineHeight: 54,
    fontFamily: BRICOLAGE_800,
    letterSpacing: -1,
  },
  titleTag: {
    marginTop: 6,
    backgroundColor: BRAND_BLUE,
    borderRadius: 12,
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 14,
    transform: [{ rotate: '-2deg' }],
  },
  titleTagText: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: 17 * 1.45,
    fontFamily: INTER_400,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 24,
  },
  actions: {
    gap: 22,
  },
  ctaShell: {
    height: 66,
  },
  ctaRelief: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    height: 60,
    borderRadius: 18,
    backgroundColor: BRAND_BLUE_DEEP,
  },
  cta: {
    height: 60,
    borderRadius: 18,
    backgroundColor: BRAND_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaPressed: {
    transform: [{ translateY: 4 }],
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: INTER_700,
    letterSpacing: 1.2,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 13 * 1.5,
    fontFamily: INTER_400,
  },
  footerLink: {
    fontFamily: INTER_700,
  },
});
