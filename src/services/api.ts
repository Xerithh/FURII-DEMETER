import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  // Keep /api relative by default so dev proxy and Vercel rewrites can bypass CORS.
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    const authStore = useAuthStore();
    authStore.logout();
    window.location.href = '/login'; // Redirect via window.location to strictly reload and avoid vue-router circular dependencies
  }
  return Promise.reject(error);
});

export default api;
