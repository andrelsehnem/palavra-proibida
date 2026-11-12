import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { ActionButton } from '../buttons/ActionButton';
import { Consts, type LanguageCode } from '../../data/Consts';
import type { PurchaseResult } from '../../data/purchaseService';
import type { ThemeOption } from '../../domain/types';
import { BRICOLAGE_800, INTER_400, INTER_700 } from '../../theme/fonts';
import type { ScenePalette } from '../../theme/scenePalette';
import type { ThemeTokens } from '../../theme/tokens';

/** Etapa do modal: confirmar, comprando, resultado, ou loja indisponível (web). */
export type PurchaseModalStep = 'confirm' | 'processing' | 'unavailable' | Exclude<PurchaseResult, 'cancelled'>;

interface PurchaseModalProps {
  visible: boolean;
  step: PurchaseModalStep;
  theme: ThemeOption | null;
  price?: string;
  language: LanguageCode;
  tokens: ThemeTokens;
  scene: ScenePalette;
  onConfirm: () => void;
  onClose: () => void;
}

type IconName = ComponentProps<typeof Ionicons>['name'];

export function PurchaseModal({
  visible,
  step,
  theme,
  price,
  language,
  tokens,
  scene,
  onConfirm,
  onClose,
}: PurchaseModalProps) {
  const t = Consts.UI_TRANSLATIONS[language];
  const accent = theme?.accent ?? tokens.primary;
  const isProcessing = step === 'processing';

  const content: Record<PurchaseModalStep, { icon: IconName; color: string; message: string }> = {
    confirm: { icon: 'lock-closed', color: accent, message: t.PREMIUM_LOCKED_MESSAGE },
    processing: { icon: 'lock-closed', color: accent, message: t.PREMIUM_LOCKED_MESSAGE },
    unavailable: { icon: 'phone-portrait-outline', color: tokens.mutedText, message: t.PREMIUM_PURCHASE_UNAVAILABLE },
    purchased: { icon: 'lock-open', color: tokens.success, message: t.PREMIUM_PURCHASE_SUCCESS },
    pending: { icon: 'time-outline', color: tokens.warning, message: t.PREMIUM_PURCHASE_PENDING },
    error: { icon: 'alert-circle', color: tokens.warning, message: t.PREMIUM_PURCHASE_ERROR },
  };
  const { icon, color, message } = content[step];
  const showBuyActions = step === 'confirm' || isProcessing;

  // Enquanto a loja está aberta, não deixa fechar (o resultado ainda vai chegar).
  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: tokens.panel, borderColor: scene.rail, shadowColor: scene.cardShadow },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.iconBadge, { backgroundColor: `${color}24`, borderColor: color }]}>
            <Ionicons name={icon} size={28} color={color} />
          </View>

          <Text style={[styles.eyebrow, { color: scene.topTag }]}>{t.PREMIUM_LOCKED_TITLE}</Text>
          {theme ? <Text style={[styles.title, { color: tokens.text }]}>{theme.label}</Text> : null}
          <Text style={[styles.message, { color: tokens.mutedText }]}>{message}</Text>

          {showBuyActions && price ? (
            <View style={[styles.pricePill, { borderColor: accent, backgroundColor: `${accent}14` }]}>
              <Text style={[styles.priceText, { color: accent }]}>{price}</Text>
            </View>
          ) : null}

          {showBuyActions ? (
            <View style={styles.actions}>
              {isProcessing ? (
                <ActivityIndicator size="large" color={accent} />
              ) : (
                <>
                  <ActionButton
                    label={t.PREMIUM_BUY_BUTTON}
                    icon="cart"
                    onPress={onConfirm}
                    backgroundColor={tokens.primary}
                    textColor={tokens.primaryText}
                  />
                  <ActionButton
                    label={t.PREMIUM_CANCEL_BUTTON}
                    onPress={onClose}
                    backgroundColor="transparent"
                    borderColor={tokens.border}
                    textColor={tokens.text}
                  />
                </>
              )}
            </View>
          ) : (
            <View style={styles.actions}>
              <ActionButton
                label={t.PREMIUM_OK_BUTTON}
                onPress={onClose}
                backgroundColor={tokens.primary}
                textColor={tokens.primaryText}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: INTER_700,
  },
  title: {
    fontSize: 28,
    fontFamily: BRICOLAGE_800,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: INTER_400,
    textAlign: 'center',
  },
  pricePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  priceText: {
    fontSize: 18,
    fontFamily: INTER_700,
  },
  actions: {
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
});
