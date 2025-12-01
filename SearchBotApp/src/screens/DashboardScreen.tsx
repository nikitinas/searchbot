import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppStackParamList, TabParamList } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/searchSlice';
import { SearchHeroCard } from '@/components/SearchHeroCard';
import { SectionHeader } from '@/components/SectionHeader';
import { HistoryItem } from '@/components/HistoryItem';
import { EmptyState } from '@/components/EmptyState';
import { MetricCard } from '@/components/MetricCard';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Dashboard'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export const DashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const dispatch = useAppDispatch();
  const history = useAppSelector(state => state.search.history);
  const metrics = useAppSelector(state => state.user.profile.metrics);

  const featuredHistory = useMemo(() => history.slice(0, 3), [history]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SearchHeroCard onStart={() => navigation.navigate('SearchInput')} />
      <View style={styles.metricsRow}>
        <MetricCard label="Searches" value={String(metrics.searchesCompleted)} helper="completed" />
        <MetricCard label="Time saved" value={`${metrics.minutesSaved}m`} helper="estimated" />
      </View>
      <SectionHeader title="Recent solutions" actionLabel="View all" onPressAction={() => navigation.navigate('History')} />
      {featuredHistory.length === 0 ? (
        <EmptyState title="No searches yet" description="Start with a question or repair problem and SearchBot will keep the results here." />
      ) : (
        <View style={styles.historyList}>
          {featuredHistory.map(item => (
            <HistoryItem
              key={item.id}
              item={item}
              onPress={selected =>
                navigation.navigate('Results', {
                  recordId: selected.id,
                })
              }
              onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyList: {
    gap: 12,
  },
});
