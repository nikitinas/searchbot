import { Share, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppStackParamList } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/searchSlice';
import { ResultSummaryCard } from '@/components/ResultSummaryCard';
import { StepsList } from '@/components/StepsList';
import { DecisionFactors } from '@/components/DecisionFactors';
import { RecommendedActions } from '@/components/RecommendedActions';
import { SourceList } from '@/components/SourceList';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState } from '@/components/EmptyState';
import { palette } from '@/theme/colors';

export type ResultsScreenProps = NativeStackScreenProps<AppStackParamList, 'Results'>;

export const ResultsScreen = ({ route, navigation }: ResultsScreenProps) => {
  const dispatch = useAppDispatch();
  const { recordId } = route.params ?? {};
  const history = useAppSelector(state => state.search.history);
  const currentResult = useAppSelector(state => state.search.currentResult);
  const currentRequestId = useAppSelector(state => state.search.currentRequest?.id);
  const targetRecord = recordId
    ? history.find(item => item.id === recordId)
    : history.find(item => item.id === currentRequestId) ?? history[0];
  const result = recordId ? targetRecord?.result : currentResult ?? targetRecord?.result;

  if (!result) {
    return (
      <View style={styles.emptyWrapper}>
        <EmptyState
          title="No solution yet"
          description="Run a search to see AI-curated steps, citations, and decision factors."
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SearchInput')}>
          <Text style={styles.backLabel}>Start researching</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    await Share.share({
      message: `${targetRecord?.request.description}\n\n${result.summary}\nSources: ${result.sources
        .slice(0, 3)
        .map(source => source.url)
        .join(', ')}`,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.topicLabel}>{targetRecord?.request.category}</Text>
          <Text style={styles.title}>{targetRecord?.request.description}</Text>
        </View>
        {targetRecord ? (
          <TouchableOpacity onPress={() => dispatch(toggleFavorite(targetRecord.id))}>
            <MaterialCommunityIcons
              name={targetRecord.favorite ? 'bookmark' : 'bookmark-outline'}
              color={targetRecord.favorite ? palette.accent : palette.text}
              size={28}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <ResultSummaryCard result={result} />
      <SectionHeader title="Step-by-step" />
      <StepsList steps={result.steps} />
      <SectionHeader title="Key decision factors" />
      <DecisionFactors factors={result.decisionFactors} />
      <SectionHeader title="Recommended actions" />
      <RecommendedActions actions={result.recommendedActions} />
      <SectionHeader title="Top verified sources" actionLabel="Share" onPressAction={handleShare} />
      <SourceList sources={result.sources} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  topicLabel: {
    color: palette.secondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  title: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  backButton: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  backLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});
