import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { storageService } from '@/services/storageService';
import { searchService } from '@/services/searchService';
import {
  PriorityLevel,
  SearchHistoryItem,
  SearchRequestPayload,
  SearchResultPayload,
} from '@/types';

export interface ExecuteSearchInput {
  description: string;
  category: string;
  priority: PriorityLevel;
  imageUri?: string;
  voiceTranscript?: string;
  language?: string; // ISO 639-1 language code
}

interface SearchState {
  currentRequest: SearchRequestPayload | null;
  currentResult: SearchResultPayload | null;
  history: SearchHistoryItem[];
  status: 'idle' | 'processing' | 'success' | 'error';
  error?: string;
}

const initialState: SearchState = {
  currentRequest: null,
  currentResult: null,
  history: [],
  status: 'idle',
  error: undefined,
};

export const hydrateHistory = createAsyncThunk('search/hydrateHistory', async () => {
  const history = await storageService.loadHistory();
  return history;
});

export const executeSearch = createAsyncThunk(
  'search/execute',
  async (input: ExecuteSearchInput) => {
    const request: SearchRequestPayload = {
      ...input,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };

    const result = await searchService.runSearch(request);

    return { request, result };
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      state.history = state.history.map(item =>
        item.id === action.payload ? { ...item, favorite: !item.favorite } : item,
      );
    },
    clearCurrentResult(state) {
      state.currentRequest = null;
      state.currentResult = null;
      state.status = 'idle';
      state.error = undefined;
    },
    markHistoryItemFailed(state, action: PayloadAction<{ id: string; error: string }>) {
      state.history = state.history.map(item =>
        item.id === action.payload.id
          ? { ...item, status: 'failed', result: undefined }
          : item,
      );
      state.error = action.payload.error;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(executeSearch.pending, state => {
        state.status = 'processing';
        state.error = undefined;
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentRequest = action.payload.request;
        state.currentResult = action.payload.result;

        const record: SearchHistoryItem = {
          id: action.payload.request.id,
          request: action.payload.request,
          result: action.payload.result,
          status: 'completed',
          favorite: false,
          savedAt: new Date().toISOString(),
        };

        state.history = [record, ...state.history].slice(0, 50);
      })
      .addCase(executeSearch.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Unable to complete research';
      });
  },
});

export const { toggleFavorite, clearCurrentResult, markHistoryItemFailed } = searchSlice.actions;
export default searchSlice.reducer;
