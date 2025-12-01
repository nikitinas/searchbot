import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SolutionStep } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  steps: SolutionStep[];
}

export const StepsList = ({ steps }: Props) => (
  <FlatList
    data={steps}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.list}
    renderItem={({ item, index }) => (
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{index + 1}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    )}
    scrollEnabled={false}
  />
);

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1F1F2B',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E335A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    color: palette.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: palette.muted,
    lineHeight: 20,
  },
});
