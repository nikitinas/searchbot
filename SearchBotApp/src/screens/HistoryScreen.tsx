import { FlatList, StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { HistoryItem } from '@/components/HistoryItem';
import { EmptyState } from '@/components/EmptyState';
import { toggleFavorite } from '@/store/searchSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/types';

export const HistoryScreen = () => {
  const history = useAppSelector(state => state.search.history);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <EmptyState
          title="No history yet"
          description="Your past searches will appear here with links back to the solutions."
        />
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <HistoryItem
          item={item}
          onPress={selected => navigation.navigate('Results', { recordId: selected.id })}
          onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  list: {
    padding: 20,
    gap: 12,
  },
});
