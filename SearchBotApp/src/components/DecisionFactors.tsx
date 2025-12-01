import { StyleSheet, Text, View } from 'react-native';
import { DecisionFactor } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  factors: DecisionFactor[];
}

export const DecisionFactors = ({ factors }: Props) => (
  <View style={styles.container}>
    {factors.map(factor => (
      <View key={factor.id} style={styles.card}>
        <Text style={styles.label}>{factor.label}</Text>
        <Text style={styles.detail}>{factor.detail}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#222231',
    borderRadius: 16,
    padding: 14,
  },
  label: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  detail: {
    color: palette.muted,
    lineHeight: 20,
  },
});
