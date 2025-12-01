import { Image, StyleSheet, Text, View } from 'react-native';
import { UserProfile } from '@/types';
import { palette } from '@/theme/colors';

interface Props {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: Props) => (
  <View style={styles.container}>
    <Image
      source={{
        uri:
          profile.avatarUrl ??
          'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=80',
      }}
      style={styles.avatar}
    />
    <View style={styles.meta}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{profile.email}</Text>
      <Text style={styles.plan}>{profile.plan.toUpperCase()} PLAN</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F28',
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  meta: {
    flex: 1,
  },
  name: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    color: palette.muted,
    marginTop: 4,
  },
  plan: {
    color: palette.secondary,
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
});
