import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { SearchHistoryItem } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  item: SearchHistoryItem;
  onPress: (item: SearchHistoryItem) => void;
  onToggleFavorite: (id: string) => void;
}

export const HistoryItem = ({ item, onPress, onToggleFavorite }: Props) => {
  const icon = useMemo(() => {
    switch (item.request.category) {
      case 'DIY & Home Repair':
        return 'hammer-wrench';
      case 'Shopping':
        return 'cart-outline';
      case 'Travel Planning':
        return 'airplane';
      case 'Technology':
        return 'laptop';
      default:
        return 'flash';
    }
  }, [item.request.category]);

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon as any} size={20} color={palette.text} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.request.description}
        </Text>
        <Text style={styles.meta}>
          {item.request.category} • {item.request.priority.toUpperCase()}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.savedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
        <MaterialCommunityIcons
          name={item.favorite ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={item.favorite ? palette.accent : palette.muted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#1C1C24',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2A2A36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: palette.text,
    fontWeight: '600',
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
  },
  timestamp: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 4,
  },
});
