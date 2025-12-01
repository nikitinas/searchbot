import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  actions: string[];
}

export const RecommendedActions = ({ actions }: Props) => (
  <View style={styles.container}>
    {actions.map(action => (
      <View key={action} style={styles.item}>
        <View style={styles.bullet} />
        <Text style={styles.text}>{action}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.secondary,
    marginTop: 6,
  },
  text: {
    color: palette.text,
    flex: 1,
    lineHeight: 20,
  },
});
