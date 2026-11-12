import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Consts, type LanguageCode } from '../../data/Consts';
import { BRICOLAGE_800, INTER_400, INTER_700 } from '../../theme/fonts';
import type { ScenePalette } from '../../theme/scenePalette';
import type { ThemeTokens } from '../../theme/tokens';

const SELECTED_BLUE = '#1F66E5';

interface LanguageDropdownProps {
  selectedLanguage: LanguageCode;
  triggerColors?: { background: string; border: string; text: string };
  onSelectLanguage: (language: LanguageCode) => void;
  tokens: ThemeTokens;
  scene: ScenePalette;
}

export function LanguageDropdown({
  selectedLanguage,
  onSelectLanguage,
  tokens,
  scene,
  triggerColors,
}: LanguageDropdownProps) {
  const triggerText = triggerColors?.text ?? tokens.text;
  const sheetBackground = triggerColors?.background ?? tokens.panel;
  const sheetBorder = triggerColors?.border ?? tokens.border;
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = Consts.SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === selectedLanguage,
  );

  const handleSelectLanguage = (code: LanguageCode) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.trigger,
          {
            borderColor: triggerColors?.border ?? tokens.border,
            backgroundColor: triggerColors?.background ?? scene.chipPanel,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons name="globe-outline" size={16} color={triggerText} />
        <Text style={[styles.triggerLabel, { color: triggerText }]}>
          {selectedOption?.nativeName || 'Idioma'}
        </Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color={triggerText} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: sheetBackground,
                borderColor: sheetBorder,
                paddingBottom: 24 + insets.bottom,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHandle, { backgroundColor: sheetBorder }]} />

            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: triggerText }]}>
                {Consts.UI_TRANSLATIONS[selectedLanguage].MENU_LANGUAGE_TITLE}
              </Text>
              <Pressable
                onPress={() => setIsOpen(false)}
                accessibilityRole="button"
                hitSlop={8}
                style={({ pressed }) => [
                  styles.closeButton,
                  { borderColor: sheetBorder, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Ionicons name="close" size={18} color={triggerText} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={styles.optionsContent}
              showsVerticalScrollIndicator={false}
            >
              {Consts.SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;

                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => handleSelectLanguage(lang.code)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        borderColor: isSelected ? SELECTED_BLUE : sheetBorder,
                        backgroundColor: isSelected ? SELECTED_BLUE : 'transparent',
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View style={styles.optionTexts}>
                      <Text
                        style={[styles.optionName, { color: isSelected ? '#FFFFFF' : triggerText }]}
                      >
                        {lang.nativeName}
                      </Text>
                      <Text
                        style={[
                          styles.optionDetail,
                          { color: isSelected ? 'rgba(255, 255, 255, 0.8)' : tokens.mutedText },
                        ]}
                      >
                        {lang.label}
                      </Text>
                    </View>
                    {isSelected ? (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={16} color={SELECTED_BLUE} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 18, 0.6)',
  },
  trigger: {
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  triggerLabel: {
    fontSize: 12,
    fontFamily: INTER_700,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 24,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  sheetHeader: {
    marginTop: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: BRICOLAGE_800,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    flexGrow: 0,
  },
  optionsContent: {
    gap: 10,
  },
  option: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionTexts: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    fontSize: 17,
    fontFamily: INTER_700,
  },
  optionDetail: {
    fontSize: 13,
    fontFamily: INTER_400,
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
