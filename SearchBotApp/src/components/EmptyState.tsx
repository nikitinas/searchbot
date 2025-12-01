import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#1F1F2A',
  },
  title: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
