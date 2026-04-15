import api from '@/services/api';
import { useToastStore } from '@/stores/toast';
import { defineStore } from 'pinia';

export interface User {
  userId?: string | number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  codeINE?: string;
  niveauFIE?: string;
  niveauEtudes?: string;
  secteurActivite?: string;
  promotion?: number | null;
  parcoursOrigine?: string;
  telephone?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  dateNaissance?: string;
  nationalite?: string;
  photoUrl?: string;
  emailVerifie?: boolean;
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
  isProfileLoading: boolean;
  error: string | null;
}

export interface UpdateProfilePayload {
  nom: string;
  prenom: string;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  nationalite?: string;
  photoUrl?: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    isProfileLoading: false,
    error: null,
  }),

  actions: {
    sanitizeText(value: unknown) {
      return typeof value === 'string' ? value.trim() : '';
    },

    toNullableText(value: unknown) {
      const text = this.sanitizeText(value);
      return text.length ? text : null;
    },

    mergeUser(partial: Partial<User>) {
      const fallbackEmail = this.user?.email || '';
      this.user = {
        ...(this.user || { email: fallbackEmail }),
        ...partial,
        email: partial.email ?? fallbackEmail,
      };
    },

    mapRoleLabel(role?: string) {
      const source = this.sanitizeText(role).replace(/^ROLE_/i, '');
      if (!source) return 'Non renseigne';
      return source
        .toLowerCase()
        .split('_')
        .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
    },

    mapNiveauEtudesLabel(value?: string) {
      const source = this.sanitizeText(value).toUpperCase();
      const map: Record<string, string> = {
        BAC: 'BAC',
        BAC_PLUS_2: 'BAC+2',
        BAC_PLUS_3: 'BAC+3',
        BAC_PLUS_4: 'BAC+4',
        AUTRE: 'BAC+5',
      };
      return map[source] || this.sanitizeText(value);
    },

    mapSecteurActiviteLabel(value?: string) {
      const source = this.sanitizeText(value).toUpperCase();
      const map: Record<string, string> = {
        INFORMATIQUE: 'NUMERIQUE',
        SANTE: 'SANTE',
        AUTRE: 'AUTRE',
      };
      return map[source] || this.sanitizeText(value);
    },

    async login(payload: { email: string; motDePasse: string }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.post('/v1/auth/login', payload);
        const data = response.data.data;
        
        this.token = data.accessToken;
        this.user = {
          userId: data.userId,
          email: data.email || '',
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
        await api.post('/v1/auth/inscription/fie3', payload);
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
        await api.post('/v1/auth/inscription/vae', payload);
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
        await api.post('/v1/auth/otp/verifier', payload);
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
        await api.post('/v1/auth/otp/renvoyer', payload);
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
        const response = await api.get('/v1/auth/me');
        const data = response.data.data;
        this.mergeUser({
          userId: data.userId,
          email: data.email || '',
          role: data.role,
        });
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

    async fetchDashboardLearner() {
      const response = await api.get('/v1/dashboard/apprenant');
      const data = response?.data?.data;
      const utilisateur = data?.utilisateur || {};

      this.mergeUser({
        userId: utilisateur.id ?? this.user?.userId,
        nom: this.sanitizeText(utilisateur.nom),
        prenom: this.sanitizeText(utilisateur.prenom),
        role: this.sanitizeText(utilisateur.role) || this.user?.role,
      });

      return data;
    },

    async fetchLearnerSessions() {
      const response = await api.get('/v1/dashboard/apprenant/sessions');
      const sessions = response?.data?.data;
      if (!Array.isArray(sessions) || sessions.length === 0) return null;

      const sortedSessions = [...sessions].sort((a, b) => {
        const aDate = new Date(a?.dateDebut || a?.dateFin || 0).getTime();
        const bDate = new Date(b?.dateDebut || b?.dateFin || 0).getTime();
        return bDate - aDate;
      });

      const sessionUser = sortedSessions.find(item => item?.utilisateur)?.utilisateur || {};

      const promotionRaw = sessionUser.promotion;
      const promotion = Number.isFinite(Number(promotionRaw)) ? Number(promotionRaw) : null;

      this.mergeUser({
        codeINE: this.sanitizeText(sessionUser.codeINE ?? sessionUser.codeIne ?? sessionUser.ine),
        niveauFIE: this.sanitizeText(sessionUser.niveauFIE ?? sessionUser.niveauFie ?? sessionUser.niveau),
        niveauEtudes: this.mapNiveauEtudesLabel(sessionUser.niveauEtudes),
        secteurActivite: this.mapSecteurActiviteLabel(sessionUser.secteurActivite),
        promotion,
        parcoursOrigine: this.sanitizeText(sessionUser.parcoursOrigine ?? sessionUser.parcours),
      });

      return sortedSessions;
    },

    async fetchProfileMe() {
      const response = await api.get('/v1/profil/me');
      const data = response?.data?.data || response?.data || {};

      const promotionRaw = (this.user as any)?.promotion;
      const promotion = Number.isFinite(Number(promotionRaw)) ? Number(promotionRaw) : this.user?.promotion ?? null;

      this.mergeUser({
        userId: data.id ?? this.user?.userId,
        email: this.sanitizeText(data.email) || this.user?.email || '',
        nom: this.sanitizeText(data.nom) || this.user?.nom,
        prenom: this.sanitizeText(data.prenom) || this.user?.prenom,
        role: this.sanitizeText(data.role) || this.user?.role,
        telephone: this.sanitizeText(data.telephone),
        dateNaissance: this.sanitizeText(data.dateNaissance),
        adresse: this.sanitizeText(data.adresse),
        codePostal: this.sanitizeText(data.codePostal),
        ville: this.sanitizeText(data.ville),
        nationalite: this.sanitizeText(data.nationalite),
        photoUrl: this.sanitizeText(data.photoUrl),
        emailVerifie: typeof data.emailVerifie === 'boolean' ? data.emailVerifie : this.user?.emailVerifie,
        promotion,
      });

      return data;
    },

    async loadCompleteProfile() {
      if (!this.token) return false;

      this.isProfileLoading = true;
      this.error = null;

      try {
        await this.fetchCurrentUser();

        await Promise.allSettled([
          this.fetchDashboardLearner(),
          this.fetchProfileMe(),
          this.fetchLearnerSessions(),
        ]);

        this.isAuthenticated = true;
        return true;
      } catch (err: any) {
        this.error = err?.response?.data?.message || err?.message || 'Chargement du profil impossible';
        return false;
      } finally {
        this.isProfileLoading = false;
      }
    },

    buildProfileUpdateBody(payload: UpdateProfilePayload) {
      return {
        nom: this.sanitizeText(payload.nom),
        prenom: this.sanitizeText(payload.prenom),
        telephone: this.toNullableText(payload.telephone),
        dateNaissance: this.toNullableText(payload.dateNaissance),
        adresse: this.toNullableText(payload.adresse),
        codePostal: this.toNullableText(payload.codePostal),
        ville: this.toNullableText(payload.ville),
        nationalite: this.toNullableText(payload.nationalite),
        photoUrl: this.toNullableText(payload.photoUrl),
      };
    },

    async updateProfile(payload: UpdateProfilePayload) {
      const body = this.buildProfileUpdateBody(payload);

      try {
        // avoid triggering the global 401 error handler in axios interceptor for this request
        const response = await api.request({
          method: 'put',
          url: '/v1/profil/me',
          data: body,
          validateStatus: (status) => status < 500, // treat 4xx as resolved so we can handle them here
        });

        const status = response?.status;

        if (status === 200 || status === 201 || status === 204) {
          // Prefer server-returned data when available
          const data = response?.data?.data || response?.data || body;
          this.mergeUser({
            nom: data.nom ?? body.nom,
            prenom: data.prenom ?? body.prenom,
            telephone: data.telephone ?? this.user?.telephone ?? body.telephone ?? null,
            dateNaissance: data.dateNaissance ?? this.user?.dateNaissance ?? body.dateNaissance ?? null,
            adresse: data.adresse ?? this.user?.adresse ?? body.adresse ?? null,
            codePostal: data.codePostal ?? this.user?.codePostal ?? body.codePostal ?? null,
            ville: data.ville ?? this.user?.ville ?? body.ville ?? null,
            nationalite: data.nationalite ?? this.user?.nationalite ?? body.nationalite ?? null,
            photoUrl: data.photoUrl ?? this.user?.photoUrl ?? body.photoUrl ?? null,
          });

          return { success: true, payload: data };
        }

        if (status === 401) {
          // authentication problem - surface error to caller without forcing a logout here
          this.error = response?.data?.message || 'Authentification requise';
          return { success: false, payload: response?.data };
        }

        // 400 Bad Request - try to extract validation errors if provided
        if (status === 400) {
          const respData = response?.data || {};
          // Common shapes: { message, errors } or { violations: [...] } or { field: [msg] }
          let msg = respData.message || 'Requête invalide';

          if (respData.errors && typeof respData.errors === 'object') {
            const parts: string[] = [];
            for (const k of Object.keys(respData.errors)) {
              const v = respData.errors[k];
              if (Array.isArray(v)) parts.push(`${k}: ${v.join(', ')}`);
              else if (typeof v === 'string') parts.push(`${k}: ${v}`);
            }
            if (parts.length) msg = parts.join(' | ');
          }

          if (Array.isArray(respData.violations)) {
            const parts = respData.violations.map((x: any) => x?.message || JSON.stringify(x));
            if (parts.length) msg = parts.join(' | ');
          }

          this.error = msg;
          return { success: false, payload: respData };
        }

        // other 4xx errors
        this.error = response?.data?.message || 'Mise a jour du profil impossible';
        return { success: false, payload: response?.data };
        } catch (err: any) {
        this.error = err?.response?.data?.message || err?.message || 'Mise a jour du profil impossible';
        return { success: false, payload: body };
      }
    },

    async changePassword(payload: { ancienMotDePasse: string; nouveauMotDePasse: string; confirmationMotDePasse: string }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.post('/v1/profil/me/password', payload, {
          validateStatus: (status) => status < 500,
        });

        if (response.status >= 200 && response.status < 300) {
          return { success: true };
        }

        this.error = response?.data?.message || 'Changement du mot de passe impossible';
        return { success: false, message: this.error, payload: response?.data };
      } catch (err: any) {
        this.error = err?.response?.data?.message || err?.message || 'Changement du mot de passe impossible';
        return { success: false, message: this.error };
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
