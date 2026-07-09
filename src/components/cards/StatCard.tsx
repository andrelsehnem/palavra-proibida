import { StyleSheet, Text, View } from 'react-native';

import { BODY_FONT, DISPLAY_FONT } from '../../theme/fonts';

interface StatCardProps {
  value: string | number;
  label: string;
  borderColor: string;
  backgroundColor: string;
  valueColor: string;
  labelColor: string;
}

export function StatCard({
  value,
  label,
  borderColor,
  backgroundColor,
  valueColor,
  labelColor,
}: StatCardProps) {
  return (
    <View style={[styles.card, { borderColor, backgroundColor }]}> 
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 2,
  },
  value: {
    fontSize: 30,
    fontFamily: DISPLAY_FONT,
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    fontFamily: BODY_FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
