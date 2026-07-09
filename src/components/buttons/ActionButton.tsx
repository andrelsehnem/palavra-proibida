import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { BODY_FONT } from '../../theme/fonts';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({
  label,
  onPress,
  disabled,
  backgroundColor,
  textColor,
  borderColor,
  style,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: borderColor ?? backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: BODY_FONT,
  },
});
