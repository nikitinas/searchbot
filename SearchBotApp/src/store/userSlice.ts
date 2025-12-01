import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { storageService } from '@/services/storageService';
import { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile;
  status: 'idle' | 'loading';
}

const fallbackProfile: UserProfile = {
  id: nanoid(),
  name: 'Busy Alex',
  email: 'alex@searchbot.app',
  plan: 'free',
  avatarUrl: undefined,
  preferences: {
    notifications: true,
    shareAnonymizedData: false,
  },
  metrics: {
    searchesCompleted: 0,
    minutesSaved: 0,
    satisfactionScore: 92,
  },
  onboardingComplete: false,
};

const initialState: UserState = {
  profile: fallbackProfile,
  status: 'idle',
};

export const hydrateUserProfile = createAsyncThunk('user/hydrate', async () => {
  const stored = await storageService.loadUserProfile();
  return stored ?? fallbackProfile;
});

export const persistUserProfile = createAsyncThunk(
  'user/persist',
  async (profile: UserProfile) => {
    await storageService.saveUserProfile(profile);
    return profile;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    completeOnboarding(state) {
      state.profile = {
        ...state.profile,
        onboardingComplete: true,
      };
    },
    updatePreferences(
      state,
      action: PayloadAction<Partial<UserProfile['preferences']>>,
    ) {
      state.profile = {
        ...state.profile,
        preferences: {
          ...state.profile.preferences,
          ...action.payload,
        },
      };
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
    incrementSearchMetrics(state, action: PayloadAction<{ minutesSaved: number }>) {
      state.profile = {
        ...state.profile,
        metrics: {
          ...state.profile.metrics,
          searchesCompleted: state.profile.metrics.searchesCompleted + 1,
          minutesSaved:
            state.profile.metrics.minutesSaved + action.payload.minutesSaved,
        },
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateUserProfile.pending, state => {
        state.status = 'loading';
      })
      .addCase(hydrateUserProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.profile = action.payload;
      })
      .addCase(hydrateUserProfile.rejected, state => {
        state.status = 'idle';
      });
  },
});

export const {
  completeOnboarding,
  updatePreferences,
  updateProfile,
  incrementSearchMetrics,
} = userSlice.actions;

export default userSlice.reducer;
