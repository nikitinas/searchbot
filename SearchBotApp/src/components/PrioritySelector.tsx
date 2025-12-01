import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRIORITY_OPTIONS } from '@/constants/options';
import { PriorityLevel } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  value: PriorityLevel;
  onChange: (value: PriorityLevel) => void;
}

export const PrioritySelector = ({ value, onChange }: Props) => (
  <View style={styles.container}>
    {PRIORITY_OPTIONS.map(option => {
      const isActive = option.value === value;
      return (
        <TouchableOpacity
          key={option.value}
          style={[styles.item, isActive && styles.activeItem]}
          onPress={() => onChange(option.value)}
        >
          <Text style={[styles.label, isActive && styles.activeLabel]}>{option.label}</Text>
          <Text style={styles.description}>{option.description}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  item: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1F1F23',
  },
  activeItem: {
    borderColor: palette.primary,
    borderWidth: 1,
    backgroundColor: '#272734',
  },
  label: {
    color: palette.muted,
    fontWeight: '500',
  },
  activeLabel: {
    color: palette.text,
  },
  description: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 4,
  },
});
