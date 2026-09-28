import axios from 'axios';

export const TOKEN_KEY = 'clf_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach the JWT (if any) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turn any axios error into a readable message
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  if (err && err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  if (err && err.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Make sure the backend is running on port 5000.';
  }
  if (err && err.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }
  return fallback;
};

export default api;
