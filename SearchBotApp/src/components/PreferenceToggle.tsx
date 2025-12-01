import { StyleSheet, Switch, Text, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const PreferenceToggle = ({ label, description, value, onChange }: Props) => (
  <View style={styles.container}>
    <View style={styles.meta}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: '#3A3A3F', true: palette.secondary }}
      thumbColor="#fff"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
  },
  meta: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: palette.muted,
    fontSize: 13,
  },
});
