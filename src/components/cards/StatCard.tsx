import { StyleSheet, Text, View } from 'react-native';

import { BRICOLAGE_800, INTER_400 } from '../../theme/fonts';

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
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text
        style={[styles.label, { color: labelColor }]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 2,
  },
  value: {
    fontSize: 30,
    fontFamily: BRICOLAGE_800,
  },
  label: {
    fontSize: 11,
    fontFamily: INTER_400,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
