import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BODY_FONT } from '../../theme/fonts';

interface ThemeChipProps {
  label: string;
  accent: string;
  selected: boolean;
  railColor: string;
  defaultTextColor: string;
  defaultDotColor: string;
  chipPanelColor: string;
  locked?: boolean;
  onPress: () => void;
}

export function ThemeChip({
  label,
  accent,
  selected,
  railColor,
  defaultTextColor,
  defaultDotColor,
  chipPanelColor,
  locked = false,
  onPress,
}: ThemeChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityState={{ selected, disabled: locked }}
      style={[
        styles.chip,
        {
          borderColor: selected ? accent : railColor,
          backgroundColor: selected ? `${accent}24` : chipPanelColor,
          borderStyle: locked ? 'dashed' : 'solid',
          opacity: locked ? 0.6 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: selected ? accent : defaultDotColor }]} />
      <Text style={[styles.label, { color: selected ? accent : defaultTextColor }]}>{label}</Text>
      {locked ? <Text style={styles.lock}>🔒</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accent: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    fontFamily: BODY_FONT,
  },
  lock: {
    fontSize: 12,
  },
});
