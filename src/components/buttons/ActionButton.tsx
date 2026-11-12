import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { INTER_700 } from '../../theme/fonts';

type ActionButtonSize = 'compact' | 'default' | 'large';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  size?: ActionButtonSize;
  style?: StyleProp<ViewStyle>;
}

const ICON_SIZE: Record<ActionButtonSize, number> = {
  compact: 14,
  default: 16,
  large: 20,
};

export function ActionButton({
  label,
  onPress,
  disabled,
  backgroundColor,
  textColor,
  borderColor,
  icon,
  size = 'default',
  style,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        size === 'compact' && styles.buttonCompact,
        size === 'large' && styles.buttonLarge,
        {
          backgroundColor,
          borderColor: borderColor ?? backgroundColor,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
        style,
      ]}
      disabled={disabled}
    >
      {icon ? <Ionicons name={icon} size={ICON_SIZE[size]} color={textColor} /> : null}
      <Text
        style={[
          styles.label,
          size === 'compact' && styles.labelCompact,
          size === 'large' && styles.labelLarge,
          { color: textColor },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonCompact: {
    minHeight: 36,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  buttonLarge: {
    minHeight: 64,
    borderRadius: 18,
    gap: 10,
  },
  label: {
    flexShrink: 1,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: INTER_700,
  },
  labelCompact: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  labelLarge: {
    fontSize: 16,
    letterSpacing: 1,
  },
});
