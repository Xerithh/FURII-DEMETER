import api from '@/services/api';
import { useToastStore } from '@/stores/toast';
import { defineStore } from 'pinia';

export interface User {
  userId?: string;
  email: string;
  role?: string;
}

export interface BaseRegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  accepteCgu: boolean;
  consentementDonnees: boolean;
  consentementContact?: boolean;
}

export interface RegisterFiePayload extends BaseRegisterPayload {
  codeINE: string;
  niveauFIE: string;
  promotion: number;
  parcoursOrigine: string;
}

export interface RegisterVaePayload extends BaseRegisterPayload {
  niveauEtudes: string;
  secteurActivite: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
  }),

  actions: {
    async login(payload: { email: string; motDePasse: string }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.post('/api/v1/auth/login', payload);
        const data = response.data.data;
        
        this.token = data.accessToken;
        this.user = {
          userId: data.userId,
          email: data.email,
          role: data.role || 'STUDENT',
        };
        this.isAuthenticated = true;
        
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      } catch (err: any) {
        console.error('auth.login error', {
          message: err?.message,
          status: err?.response?.status,
          responseData: err?.response?.data,
          headers: err?.response?.headers,
          stack: err?.stack,
          raw: err,
        });
        this.error = err.response?.data?.message || 'Login failed';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async registerFie3(payload: RegisterFiePayload) {
      this.isLoading = true;
      this.error = null;
      try {
        await api.post('/api/v1/auth/inscription/fie3', payload);
        // Save the email securely in `user` so OTP can read it without passing via url params
        this.user = { email: payload.email };
        return true;
      } catch (err: any) {
        console.error('auth.registerFie3 error', {
          message: err?.message,
          status: err?.response?.status,
          responseData: err?.response?.data,
          headers: err?.response?.headers,
          stack: err?.stack,
          raw: err,
        });
        this.error = err.response?.data?.message || 'Inscription FIE échouée';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async registerVae(payload: RegisterVaePayload) {
      this.isLoading = true;
      this.error = null;
      try {
        await api.post('/api/v1/auth/inscription/vae', payload);
        // Save the email securely in `user` so OTP can read it without passing via url params
        this.user = { email: payload.email };
        return true;
      } catch (err: any) {
        console.error('auth.registerVae error', {
          message: err?.message,
          status: err?.response?.status,
          responseData: err?.response?.data,
          headers: err?.response?.headers,
          stack: err?.stack,
          raw: err,
        });
        this.error = err.response?.data?.message || 'Inscription VAE échouée';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async verifyOtp(payload: { email: string; code: string }) {
      this.isLoading = true;
      this.error = null;
      try {
        await api.post('/api/v1/auth/otp/verifier', payload);
        return true;
      } catch (err: any) {
        console.error('auth.verifyOtp error', {
          message: err?.message,
          status: err?.response?.status,
          responseData: err?.response?.data,
          headers: err?.response?.headers,
          stack: err?.stack,
          raw: err,
        });
        this.error = err.response?.data?.message || 'Verification failed';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async resendOtp(payload: { email: string }) {
      this.isLoading = true;
      this.error = null;
      try {
        await api.post('/api/v1/auth/otp/renvoyer', payload);
        return true;
      } catch (err: any) {
        console.error('auth.resendOtp error', {
          message: err?.message,
          status: err?.response?.status,
          responseData: err?.response?.data,
          headers: err?.response?.headers,
          stack: err?.stack,
          raw: err,
        });
        this.error = err.response?.data?.message || 'Failed to resend OTP';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return false;
      
      this.isLoading = true;
      try {
        const response = await api.get('/api/v1/auth/me');
        const data = response.data.data;
        this.user = {
          userId: data.userId,
          email: data.email,
          role: data.role,
        };
        this.isAuthenticated = true;
        return true;
      } catch (err: any) {
        console.error('auth.fetchCurrentUser error', {
          message: err?.message,
          status: err?.response?.status,
          responseData: err?.response?.data,
          headers: err?.response?.headers,
          stack: err?.stack,
          raw: err,
        });
        this.logout();
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      const toastStore = useToastStore();
      toastStore.addToast({
        message: 'Déconnexion réussie. À bientôt sur ISISU !',
        type: 'success',
      });
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    }
  }
});
