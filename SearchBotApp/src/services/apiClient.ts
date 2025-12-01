import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.searchbot-placeholder.com/v1';

// Debug logging
if (__DEV__) {
  console.log('🌐 API Client Configuration:');
  console.log('  EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
  console.log('  API_BASE_URL:', API_BASE_URL);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for AI processing
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.warn('SearchBot API error', error.response.status, error.response.data);
    } else {
      console.warn('SearchBot network error', error.message);
    }
    return Promise.reject(error);
  },
);
