import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES } from '@/constants/options';
import { palette } from '@/theme/colors';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryChips = ({ value, onChange }: Props) => (
  <View>
    <Text style={styles.label}>Suggested categories</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.list}>
      {CATEGORIES.map(category => {
        const isActive = category === value;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.chip, isActive && styles.activeChip]}
            onPress={() => onChange(category)}
          >
            <Text style={[styles.chipLabel, isActive && styles.activeChipLabel]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  label: {
    color: palette.muted,
    marginBottom: 8,
    fontSize: 14,
  },
  list: {
    flexGrow: 0,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#1E1E22',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeChip: {
    borderColor: palette.primary,
    backgroundColor: '#2F2F3C',
  },
  chipLabel: {
    color: palette.muted,
    fontSize: 13,
  },
  activeChipLabel: {
    color: palette.text,
    fontWeight: '600',
  },
});
