import { StyleSheet, Text, View } from 'react-native';
import { SearchResultPayload } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  result: SearchResultPayload;
}

export const ResultSummaryCard = ({ result }: Props) => (
  <View style={styles.card}>
    <Text style={styles.heading}>Actionable summary</Text>
    <Text style={styles.summary}>{result.summary}</Text>
    <View style={styles.metaRow}>
      <View style={styles.metaTile}>
        <Text style={styles.metaLabel}>Estimated time</Text>
        <Text style={styles.metaValue}>{result.estimatedTimeMinutes} min</Text>
      </View>
      <View style={styles.metaTile}>
        <Text style={styles.metaLabel}>Difficulty</Text>
        <Text style={styles.metaValue}>{result.difficulty.toUpperCase()}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C24',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
  },
  heading: {
    color: palette.muted,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  summary: {
    color: palette.text,
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  metaTile: {
    flex: 1,
    backgroundColor: '#232330',
    borderRadius: 12,
    padding: 12,
  },
  metaLabel: {
    color: palette.muted,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: palette.text,
    fontWeight: '600',
    marginTop: 4,
  },
});
