import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHistoryItem, UserProfile } from '@/types';

const HISTORY_KEY = 'searchbot:history';
const USER_KEY = 'searchbot:user';

const parseJSON = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse storage payload', error);
    return null;
  }
};

export const storageService = {
  async loadHistory(): Promise<SearchHistoryItem[]> {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return parseJSON<SearchHistoryItem[]>(data) ?? [];
  },
  async saveHistory(history: SearchHistoryItem[]): Promise<void> {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },
  async loadUserProfile(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem(USER_KEY);
    return parseJSON<UserProfile>(data);
  },
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
  },
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([HISTORY_KEY, USER_KEY]);
  },
};
