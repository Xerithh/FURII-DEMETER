import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const api = axios.create({
  // In local dev, keep relative URLs so Vite proxy can bypass CORS.
  // For deployment, VITE_API_BASE_URL can point to a full backend URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
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
