import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { PreferenceToggle } from '@/components/PreferenceToggle';
import { ProfileHeader } from '@/components/ProfileHeader';
import { palette } from '@/theme/colors';
import { updatePreferences, updateProfile } from '@/store/userSlice';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.user.profile);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleSave = () => {
    dispatch(updateProfile({ name, email }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProfileHeader profile={profile} />
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput mode="outlined" value={name} onChangeText={setName} style={styles.input} />
        <Text style={styles.label}>Email</Text>
        <TextInput mode="outlined" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveLabel}>Save profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.preferences}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <PreferenceToggle
          label="Notifications"
          description="Send updates when research is ready"
          value={profile.preferences.notifications}
          onChange={value => dispatch(updatePreferences({ notifications: value }))}
        />
        <PreferenceToggle
          label="Help improve SearchBot"
          description="Share anonymized usage data"
          value={profile.preferences.shareAnonymizedData}
          onChange={value => dispatch(updatePreferences({ shareAnonymizedData: value }))}
        />
      </View>
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
  form: {
    backgroundColor: '#1C1C24',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  label: {
    color: palette.muted,
    fontSize: 13,
  },
  input: {
    backgroundColor: 'transparent',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  preferences: {
    backgroundColor: '#1C1C24',
    borderRadius: 20,
    padding: 16,
  },
  sectionTitle: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 12,
  },
});
