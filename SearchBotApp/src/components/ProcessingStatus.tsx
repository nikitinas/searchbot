import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  statusText: string;
  subtext?: string;
}

export const ProcessingStatus = ({ statusText, subtext }: Props) => (
  <View style={styles.card}>
    <ActivityIndicator size="large" color={palette.primary} />
    <Text style={styles.title}>{statusText}</Text>
    {subtext ? <Text style={styles.subtitle}>{subtext}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181F',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: palette.muted,
    textAlign: 'center',
  },
});
