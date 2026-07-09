import { StyleSheet, View } from 'react-native';

import { ActionButton } from '../components/buttons/ActionButton';
import { StatCard } from '../components/cards/StatCard';
import { WordGameCard } from '../components/cards/WordGameCard';
import { Consts, type LanguageCode } from '../data/Consts';
import type { WordCard } from '../domain/types';
import type { ScenePalette } from '../theme/scenePalette';
import type { ThemeTokens } from '../theme/tokens';

interface GameScreenProps {
  tokens: ThemeTokens;
  scene: ScenePalette;
  language: LanguageCode;
  currentCard: WordCard | null;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  skippedCount: number;
  scoreRate: number;
  onExit: () => void;
  onSkip: () => void;
  onCorrect: () => void;
}

export function GameScreen({
  tokens,
  scene,
  language,
  currentCard,
  currentIndex,
  totalCards,
  correctCount,
  skippedCount,
  scoreRate,
  onExit,
  onSkip,
  onCorrect,
}: GameScreenProps) {
  return (
    <View style={styles.gameScreenContent}>
      <View style={styles.gameHead}>
        <StatCard
          value={correctCount}
          label={Consts.UI_TRANSLATIONS[language].LABEL_ACERTOS}
          borderColor={scene.rail}
          backgroundColor={scene.chipPanel}
          valueColor={tokens.text}
          labelColor={tokens.mutedText}
        />
        <StatCard
          value={skippedCount}
          label={Consts.UI_TRANSLATIONS[language].LABEL_PULADAS}
          borderColor={scene.rail}
          backgroundColor={scene.chipPanel}
          valueColor={tokens.warning}
          labelColor={tokens.mutedText}
        />
        <StatCard
          value={`${scoreRate}%`}
          label={Consts.UI_TRANSLATIONS[language].LABEL_RITMO}
          borderColor={scene.rail}
          backgroundColor={scene.chipPanel}
          valueColor={tokens.primary}
          labelColor={tokens.mutedText}
        />
      </View>

      <WordGameCard
        card={currentCard}
        index={currentIndex}
        total={totalCards}
        borderColor={scene.rail}
        backgroundColor={tokens.panel}
        chipPanelColor={scene.chipPanel}
        textColor={tokens.text}
        mutedTextColor={tokens.mutedText}
        warningColor={tokens.warning}
        shadowColor={scene.cardShadow}
        language={language}
      />

      <View style={styles.actionColumn}>
        <ActionButton
          label={Consts.UI_TRANSLATIONS[language].LABEL_SAIR}
          onPress={onExit}
          backgroundColor={scene.chipPanel}
          borderColor={tokens.warning}
          textColor={tokens.warning}
        />
        <View style={styles.rowButtons}>
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_PULAR}
            onPress={onSkip}
            backgroundColor={tokens.warning}
            textColor={tokens.primaryText}
            disabled={!currentCard}
            style={styles.halfButton}
          />
          <ActionButton
            label={Consts.UI_TRANSLATIONS[language].LABEL_ACERTOU}
            onPress={onCorrect}
            backgroundColor={tokens.success}
            textColor="#ffffff"
            disabled={!currentCard}
            style={styles.halfButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameScreenContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 22,
    justifyContent: 'space-between',
    gap: 14,
  },
  gameHead: {
    flexDirection: 'row',
    gap: 8,
  },
  actionColumn: {
    flexDirection: 'column',
    gap: 10,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
});
