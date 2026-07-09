import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { Consts, type LanguageCode } from '../../data/Consts';
import { BODY_FONT } from '../../theme/fonts';
import type { ScenePalette } from '../../theme/scenePalette';
import type { ThemeTokens } from '../../theme/tokens';

interface LanguageDropdownProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (language: LanguageCode) => void;
  tokens: ThemeTokens;
  scene: ScenePalette;
}

export function LanguageDropdown({
  selectedLanguage,
  onSelectLanguage,
  tokens,
  scene,
}: LanguageDropdownProps) {
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
        style={[
          styles.trigger,
          {
            borderColor: tokens.border,
            backgroundColor: scene.chipPanel,
          },
        ]}
      >
        <Text style={[styles.triggerLabel, { color: tokens.text }]}>
          {selectedOption?.nativeName || 'Idioma'}
        </Text>
        <Text style={[styles.triggerIcon, { color: tokens.text }]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={[
              styles.dropdown,
              {
                borderColor: tokens.border,
                backgroundColor: tokens.panel,
                shadowColor: scene.cardShadow,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              scrollEnabled={Consts.SUPPORTED_LANGUAGES.length > 4}
              nestedScrollEnabled={true}
              style={styles.optionsList}
            >
              {Consts.SUPPORTED_LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => handleSelectLanguage(lang.code)}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        selectedLanguage === lang.code
                          ? scene.chipPanel
                          : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color:
                          selectedLanguage === lang.code
                            ? tokens.primary
                            : tokens.text,
                        fontWeight:
                          selectedLanguage === lang.code ? '600' : '400',
                      },
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                </Pressable>
              ))}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  trigger: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 120,
    gap: 8,
  },
  triggerLabel: {
    fontSize: 12,
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.4,
    flex: 1,
  },
  triggerIcon: {
    fontSize: 10,
    fontWeight: '700',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 240,
    minWidth: 180,
    zIndex: 1000,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
  },
  optionsList: {
    maxHeight: 200,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionLabel: {
    fontSize: 13,
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
