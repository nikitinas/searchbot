import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  onStart: () => void;
}

export const SearchHeroCard = ({ onStart }: Props) => (
  <LinearGradient colors={["#5C7AEA", "#5073f2", "#4cbfa6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
    <View style={styles.content}>
      <Text style={styles.title}>Describe your problem once</Text>
      <Text style={styles.subtitle}>SearchBot researches across trusted sources and delivers a vetted plan.</Text>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonLabel}>Start a new search</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 24,
    padding: 20,
    minHeight: 180,
    justifyContent: 'center',
    marginBottom: 24,
  },
  content: {
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
