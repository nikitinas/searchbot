import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import searchReducer, {
  executeSearch,
  hydrateHistory,
  toggleFavorite,
} from './searchSlice';
import userReducer, {
  completeOnboarding,
  incrementSearchMetrics,
  updatePreferences,
  updateProfile,
} from './userSlice';
import { storageService } from '@/services/storageService';

const persistenceListener = createListenerMiddleware();

persistenceListener.startListening({
  matcher: isAnyOf(executeSearch.fulfilled, toggleFavorite, hydrateHistory.fulfilled),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    await storageService.saveHistory(state.search.history);
  },
});

persistenceListener.startListening({
  matcher: isAnyOf(
    completeOnboarding,
    updatePreferences,
    updateProfile,
    incrementSearchMetrics,
  ),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    await storageService.saveUserProfile(state.user.profile);
  },
});

persistenceListener.startListening({
  actionCreator: executeSearch.fulfilled,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      incrementSearchMetrics({
        minutesSaved: action.payload.result.estimatedTimeMinutes,
      }),
    );
  },
});

export const store = configureStore({
  reducer: {
    search: searchReducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(persistenceListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
