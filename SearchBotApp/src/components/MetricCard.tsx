import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  label: string;
  value: string;
  helper?: string;
}

export const MetricCard = ({ label, value, helper }: Props) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
    {helper ? <Text style={styles.helper}>{helper}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1C1C24',
    padding: 16,
    borderRadius: 18,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
  },
  helper: {
    color: palette.muted,
    marginTop: 4,
  },
});
