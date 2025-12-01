export type PriorityLevel = 'urgent' | 'normal' | 'low';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface SourceLink {
  id: string;
  title: string;
  url: string;
  credibility: number; // 0 - 100 score
  snippet: string;
}

export interface SolutionStep {
  id: string;
  title: string;
  description: string;
}

export interface DecisionFactor {
  id: string;
  label: string;
  detail: string;
}

export interface SearchRequestPayload {
  id: string;
  description: string;
  category: string;
  priority: PriorityLevel;
  imageUri?: string;
  voiceTranscript?: string;
  createdAt: string;
  language?: string; // ISO 639-1 language code (e.g., 'en', 'es', 'fr')
}

export interface SearchResultPayload {
  summary: string;
  steps: SolutionStep[];
  decisionFactors: DecisionFactor[];
  sources: SourceLink[];
  estimatedTimeMinutes: number;
  difficulty: DifficultyLevel;
  recommendedActions: string[];
}

export interface SearchHistoryItem {
  id: string;
  request: SearchRequestPayload;
  result?: SearchResultPayload;
  status: 'processing' | 'completed' | 'failed';
  favorite: boolean;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  avatarUrl?: string;
  preferences: {
    notifications: boolean;
    shareAnonymizedData: boolean;
  };
  metrics: {
    searchesCompleted: number;
    minutesSaved: number;
    satisfactionScore: number;
  };
  onboardingComplete: boolean;
}

export interface AppError {
  message: string;
  code?: string;
}

export type AppStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  SearchInput: undefined;
  Processing: undefined;
  Results: { recordId: string } | undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  History: undefined;
  Profile: undefined;
};
