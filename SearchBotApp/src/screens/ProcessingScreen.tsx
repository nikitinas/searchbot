import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppStackParamList } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCurrentResult } from '@/store/searchSlice';
import { ProcessingStatus } from '@/components/ProcessingStatus';

export type ProcessingScreenProps = NativeStackScreenProps<AppStackParamList, 'Processing'>;

export const ProcessingScreen = ({ navigation }: ProcessingScreenProps) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.search.status);
  const currentRequest = useAppSelector(state => state.search.currentRequest);
  const error = useAppSelector(state => state.search.error);

  useEffect(() => {
    if (status === 'success' && currentRequest) {
      navigation.replace('Results', { recordId: currentRequest.id });
    }
  }, [status, currentRequest, navigation]);

  const handleRetry = () => {
    dispatch(clearCurrentResult());
    navigation.replace('SearchInput');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {status === 'error' ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>We hit a snag</Text>
            <Text style={styles.errorSubtitle}>{error ?? 'Unknown error occurred.'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryLabel}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ProcessingStatus
            statusText="Researching trusted sources…"
            subtext="SearchBot is drafting a plan, verifying facts, and ranking the most credible references."
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E12',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#1F1F2A',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  errorSubtitle: {
    color: '#bbb',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  retryLabel: {
    color: '#000',
    fontWeight: '600',
  },
});
