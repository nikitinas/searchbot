import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.searchbot-placeholder.com/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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
