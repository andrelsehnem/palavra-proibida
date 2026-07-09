import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../components/buttons/ActionButton';
import { StatCard } from '../components/cards/StatCard';
import { ThemeChip } from '../components/cards/ThemeChip';
import { Consts, type LanguageCode } from '../data/Consts';
import type { TeamGameSettings, ThemeId, ThemeOption } from '../domain/types';
import { BODY_FONT, DISPLAY_FONT } from '../theme/fonts';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface ThemesScreenProps {
  tokens: ThemeTokens;
  scene: ScenePalette;
  selectedThemes: ThemeId[];
  themeOptions: ThemeOption[];
  availableCards: number;
  isLoading: boolean;
  isHydrated: boolean;
  loadError: string | null;
  hasSelectableWords: boolean;
  teamSettings: TeamGameSettings;
  isTeamConfigurationValid: boolean;
  language: LanguageCode;
  onToggleTheme: (themeId: ThemeId) => void;
  onToggleTeamMode: (value: boolean) => void;
  onChangeTeamCount: (value: string) => void;
  onChangeRoundSeconds: (value: string) => void;
  onStart: () => void;
  onBack: () => void;
}

export function ThemesScreen({
  tokens,
  scene,
  selectedThemes,
  themeOptions,
  availableCards,
  isLoading,
  isHydrated,
  loadError,
  hasSelectableWords,
  teamSettings,
  isTeamConfigurationValid,
  language,
  onToggleTheme,
  onToggleTeamMode,
  onChangeTeamCount,
  onChangeRoundSeconds,
  onStart,
  onBack,
}: ThemesScreenProps) {
  const isStartDisabled =
    isLoading || Boolean(loadError) || !hasSelectableWords || (teamSettings.isEnabled && !isTeamConfigurationValid);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
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
        <View style={styles.headerRow}>
          <View style={styles.sectionLead}>
            <Text style={[styles.sectionEyebrow, { color: scene.topTag }]}>{Consts.UI_TRANSLATIONS[language].THEMES_CONFIG_TAG}</Text>
            <Text style={[styles.sectionTitle, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].THEMES_SECTION_TITLE}</Text>
          </View>
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].THEMES_MENU_BUTTON}
            onPress={onBack}
            backgroundColor={scene.chipPanel}
            textColor={tokens.text}
            borderColor={tokens.border}
            style={styles.menuButton}
          />
        </View>

        <Text style={[styles.sectionDescription, { color: tokens.mutedText }]}>
          {Consts.UI_TRANSLATIONS[language].THEMES_DESCRIPTION}
        </Text>

        <View
          style={[
            styles.teamModePanel,
            {
              borderColor: scene.rail,
              backgroundColor: scene.chipPanel,
            },
          ]}
        >
          <View style={styles.teamModeHeader}>
            <View style={styles.teamModeCopy}>
              <Text style={[styles.teamModeTitle, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].TEAM_MODE_TITLE}</Text>
              <Text style={[styles.teamModeDescription, { color: tokens.mutedText }]}>
                {Consts.UI_TRANSLATIONS[language].TEAM_MODE_DESCRIPTION}
              </Text>
            </View>
            <Switch
              value={teamSettings.isEnabled}
              onValueChange={onToggleTeamMode}
              thumbColor={teamSettings.isEnabled ? tokens.primaryText : '#f4f3f4'}
              trackColor={{ false: tokens.border, true: tokens.primary }}
            />
          </View>

          {teamSettings.isEnabled ? (
            <View style={styles.teamFieldsColumn}>
              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].TEAM_COUNT_LABEL}</Text>
                <TextInput
                  value={teamSettings.teamCount > 0 ? String(teamSettings.teamCount) : ''}
                  onChangeText={onChangeTeamCount}
                  keyboardType="number-pad"
                  placeholder={Consts.UI_TRANSLATIONS[language].TEAM_COUNT_PLACEHOLDER}
                  placeholderTextColor={tokens.mutedText}
                  style={[
                    styles.fieldInput,
                    {
                      borderColor: scene.rail,
                      backgroundColor: tokens.panel,
                      color: tokens.text,
                    },
                  ]}
                  selectTextOnFocus
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].ROUND_SECONDS_LABEL}</Text>
                <TextInput
                  value={teamSettings.roundSeconds > 0 ? String(teamSettings.roundSeconds) : ''}
                  onChangeText={onChangeRoundSeconds}
                  keyboardType="number-pad"
                  placeholder={Consts.UI_TRANSLATIONS[language].ROUND_SECONDS_PLACEHOLDER}
                  placeholderTextColor={tokens.mutedText}
                  style={[
                    styles.fieldInput,
                    {
                      borderColor: scene.rail,
                      backgroundColor: tokens.panel,
                      color: tokens.text,
                    },
                  ]}
                  selectTextOnFocus
                />
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.chipWrap}>
          {themeOptions.map((theme) => {
            const selected = selectedThemes.includes(theme.id);

            return (
              <ThemeChip
                key={theme.id}
                label={theme.label}
                accent={theme.accent}
                selected={selected}
                railColor={scene.rail}
                defaultTextColor={tokens.text}
                defaultDotColor={tokens.border}
                chipPanelColor={scene.chipPanel}
                onPress={() => onToggleTheme(theme.id)}
              />
            );
          })}
        </View>

        {isLoading || !isHydrated ? (
          <View style={styles.centeredBlock}>
            <ActivityIndicator size="large" color={tokens.primary} />
            <Text style={[styles.helperText, { color: tokens.mutedText }]}>{Consts.UI_TRANSLATIONS[language].LOADING_CARDS}</Text>
          </View>
        ) : null}

        {!isLoading && loadError ? (
          <Text style={[styles.warningText, { color: tokens.warning }]}>{loadError}</Text>
        ) : null}

        {!isLoading && !loadError && !hasSelectableWords ? (
          <Text style={[styles.warningText, { color: tokens.warning }]}>
            {Consts.UI_TRANSLATIONS[language].ERROR_NO_THEMES}
          </Text>
        ) : null}

        {teamSettings.isEnabled && !isTeamConfigurationValid ? (
          <Text style={[styles.warningText, { color: tokens.warning }]}>
            {Consts.UI_TRANSLATIONS[language].ERROR_INVALID_TEAM_CONFIG}
          </Text>
        ) : null}

        <View style={styles.statColumn}>
          <StatCard
            value={selectedThemes.length}
            label={Consts.UI_TRANSLATIONS[language].ACTIVE_THEMES_LABEL}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={tokens.text}
            labelColor={tokens.mutedText}
          />
          <StatCard
            value={availableCards}
            label={Consts.UI_TRANSLATIONS[language].AVAILABLE_CARDS_LABEL}
            borderColor={scene.rail}
            backgroundColor={scene.chipPanel}
            valueColor={tokens.text}
            labelColor={tokens.mutedText}
          />
        </View>

        <View style={styles.actionColumn}>
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].START_ROUND_BUTTON}
            onPress={onStart}
            backgroundColor={tokens.primary}
            textColor={tokens.primaryText}
            disabled={isStartDisabled}
          />
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].BACK_BUTTON}
            onPress={onBack}
            backgroundColor={scene.chipPanel}
            borderColor={scene.rail}
            textColor={tokens.text}
          />

          <View
            style={[
              styles.tipsCard,
              {
                borderColor: scene.rail,
                backgroundColor: scene.chipPanel,
              },
            ]}
          >
            <Text style={[styles.tipsTitle, { color: tokens.text }]}>{Consts.UI_TRANSLATIONS[language].THEMES_TIPS_TITLE}</Text>
            {[1, 2, 3, 4, 5].map((index) => {
              const tipKey = `THEME_TIP_${index}` as const;
              const tip = Consts.UI_TRANSLATIONS[language][tipKey];
              return (
                <Text key={tipKey} style={[styles.tipItem, { color: tokens.mutedText }]}>
                  - {tip}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 18,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  sectionLead: {
    flex: 1,
    gap: 2,
  },
  sectionEyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: BODY_FONT,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '700',
    fontFamily: DISPLAY_FONT,
  },
  menuButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: BODY_FONT,
    lineHeight: 20,
  },
  teamModePanel: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  teamModeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  teamModeCopy: {
    flex: 1,
    gap: 4,
  },
  teamModeTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
  },
  teamModeDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: BODY_FONT,
  },
  teamFieldsColumn: {
    gap: 10,
  },
  fieldBlock: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: BODY_FONT,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
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
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: BODY_FONT,
  },
  statColumn: {
    gap: 10,
  },
  actionColumn: {
    flexDirection: 'column',
    gap: 10,
  },
  tipsCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: DISPLAY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tipItem: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: BODY_FONT,
  },
});
