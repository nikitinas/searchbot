import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SourceLink } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  sources: SourceLink[];
}

export const SourceList = ({ sources }: Props) => (
  <View style={styles.container}>
    {sources.map(source => (
      <TouchableOpacity
        key={source.id}
        style={styles.card}
        onPress={() => Linking.openURL(source.url)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{source.title}</Text>
          <Text style={styles.score}>{source.credibility}% credibility</Text>
        </View>
        <Text style={styles.snippet}>{source.snippet}</Text>
        <Text style={styles.url} numberOfLines={1}>
          {source.url}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#1F1F2A',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    color: palette.text,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  score: {
    color: palette.secondary,
    fontSize: 12,
  },
  snippet: {
    color: palette.muted,
    marginBottom: 8,
  },
  url: {
    color: '#84D8FF',
    fontSize: 12,
  },
});
