import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/colors';
import { useAppDispatch } from '@/store/hooks';
import { completeOnboarding } from '@/store/userSlice';

const benefits = [
  'AI summarizes top 5-10 credible sources per search',
  'Step-by-step repair playbooks with risk callouts',
  'Saved history, favorites, and shareable links',
];

export const OnboardingScreen = () => {
  const dispatch = useAppDispatch();

  const handleGetStarted = useCallback(() => {
    dispatch(completeOnboarding());
  }, [dispatch]);

  return (
    <LinearGradient colors={["#0F0F14", "#0A0A0F"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>SEARCHBOT MVP</Text>
          <Text style={styles.title}>Research superpowers whenever you need answers</Text>
          <Text style={styles.subtitle}>
            Describe any problem once. SearchBot scouts the web, validates facts, and hands you a ready-to-run plan.
          </Text>
          <View style={styles.benefits}>
            {benefits.map(item => (
              <View key={item} style={styles.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={22} color={palette.secondary} />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.cta} onPress={handleGetStarted}>
            <Text style={styles.ctaLabel}>Get started</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  kicker: {
    color: palette.secondary,
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    marginTop: 12,
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 12,
    lineHeight: 22,
  },
  benefits: {
    marginTop: 32,
    gap: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  benefitText: {
    color: '#fff',
    flex: 1,
    fontSize: 15,
  },
  cta: {
    marginTop: 48,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#0C0C0F',
    fontWeight: '700',
    fontSize: 17,
  },
});
