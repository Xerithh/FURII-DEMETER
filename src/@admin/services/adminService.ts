import api from '@/services/api';
import type {
  AdminDashboardDTO,
  UtilisateurDashboardDTO,
  SessionStatisticsDTO,
  ApiResponse,
  Role,
  StatutCompte,
} from '@/@admin/types/admin';

/**
 * Admin Service - API calls for admin dashboard
 */
export const adminService = {
  /**
   * GET /api/v1/dashboard/admin
   * Récupère KPI générales + top/bottom compétences
   */
  async getDashboard(): Promise<AdminDashboardDTO> {
    const response = await api.get<ApiResponse<AdminDashboardDTO>>(
      '/api/v1/dashboard/admin'
    );
    return response.data.data;
  },

  /**
   * GET /api/v1/dashboard/admin/users
   * Récupère liste utilisateurs avec filtres optionnels
   * @param role - ETUDIANT_FIE3 | CANDIDAT_VAE | ADMIN
   * @param statut - ACTIF | EN_ATTENTE_OTP | SUSPENDU
   */
  async getUsers(
    role?: Role,
    statut?: StatutCompte
  ): Promise<UtilisateurDashboardDTO[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (statut) params.append('statut', statut);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<ApiResponse<UtilisateurDashboardDTO[]>>(
      `/api/v1/dashboard/admin/users${query}`
    );
    return response.data.data;
  },

  /**
   * GET /api/v1/dashboard/admin/statistiques/sessions
   * Récupère stats sessions + évolution par jour
   */
  async getSessionStatistics(): Promise<SessionStatisticsDTO> {
    const response = await api.get<ApiResponse<SessionStatisticsDTO>>(
      '/api/v1/dashboard/admin/statistiques/sessions'
    );
    return response.data.data;
  },
};
