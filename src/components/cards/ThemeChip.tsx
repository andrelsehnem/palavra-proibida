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
  onPress,
}: ThemeChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? accent : railColor,
          backgroundColor: selected ? `${accent}24` : chipPanelColor,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: selected ? accent : defaultDotColor }]} />
      <Text style={[styles.label, { color: selected ? accent : defaultTextColor }]}>{label}</Text>
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
});
