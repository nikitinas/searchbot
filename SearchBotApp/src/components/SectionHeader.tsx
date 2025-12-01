import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onPressAction }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel ? (
      <TouchableOpacity onPress={onPressAction} disabled={!onPressAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  action: {
    fontSize: 14,
    color: palette.secondary,
    fontWeight: '500',
  },
});
