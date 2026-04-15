import type {
    ActiviteStatsDTO,
    AdminDashboardDTO,
    ApiResponse,
    CompetencesStatsDTO,
    HeatmapStatsDTO,
    NiveauDifficulte,
    PerformancesStatsDTO,
    QuestionDTO,
    QuestionsTypeStatsDTO,
    Role,
    SessionStatisticsDTO,
    StatutCompte,
    TypeQuestion,
    UtilisateurDashboardDTO,
} from '@/@admin/types/admin';
import api from '@/services/api';

/**
 * Admin Service - API calls for admin dashboard
 */
export const adminService = {
  /**
   * GET /v1/dashboard/admin
   * Récupère KPI générales + top/bottom compétences
   */
  async getDashboard(): Promise<AdminDashboardDTO> {
    const response = await api.get<ApiResponse<AdminDashboardDTO>>(
      '/v1/dashboard/admin'
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/users
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
      `/v1/dashboard/admin/users${query}`
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/statistiques/sessions
   * Récupère stats sessions + évolution par jour
   */
  async getSessionStatistics(): Promise<SessionStatisticsDTO> {
    const response = await api.get<ApiResponse<SessionStatisticsDTO>>(
      '/v1/dashboard/admin/statistiques/sessions'
    );
    return response.data.data;
  },

  /**
   * GET /v1/admin/questions
   * Récupère toutes les questions (actives + inactives)
   * @param filters - Filtres optionnels {type, difficulte, actif}
   */
  async getQuestions(filters?: {
    type?: TypeQuestion;
    difficulte?: NiveauDifficulte;
    actif?: boolean;
  }): Promise<QuestionDTO[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.difficulte) params.append('difficulte', filters.difficulte);
    if (filters?.actif !== undefined) params.append('actif', String(filters.actif));

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<ApiResponse<QuestionDTO[]>>(
      `/v1/admin/questions${query}`
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/statistiques/competences
   * Statistiques des compétences (top + tendances)
   */
  async getCompetencesStats(): Promise<CompetencesStatsDTO> {
    const response = await api.get<ApiResponse<CompetencesStatsDTO>>(
      '/v1/dashboard/admin/statistiques/competences'
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/statistiques/questions
   * Statistiques des questions par type et difficulté
   */
  async getQuestionsStats(): Promise<QuestionsTypeStatsDTO> {
    const response = await api.get<ApiResponse<QuestionsTypeStatsDTO>>(
      '/v1/dashboard/admin/statistiques/questions'
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/statistiques/performances
   * Statistiques des performances (distribution scores + par type apprenant)
   */
  async getPerformancesStats(): Promise<PerformancesStatsDTO> {
    const response = await api.get<ApiResponse<PerformancesStatsDTO>>(
      '/v1/dashboard/admin/statistiques/performances'
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/statistiques/activite
   * Statistiques d'activité (sessions + apprenants actifs par jour)
   * @param periode - '7j' (défaut) ou '30j'
   */
  async getActiviteStats(periode: string = '7j'): Promise<ActiviteStatsDTO> {
    const response = await api.get<ApiResponse<ActiviteStatsDTO>>(
      `/v1/dashboard/admin/statistiques/activite?periode=${periode}`
    );
    return response.data.data;
  },

  /**
   * GET /v1/dashboard/admin/statistiques/heatmap
   * Heatmap des compétences par niveau de difficulté
   */
  async getHeatmapStats(): Promise<HeatmapStatsDTO> {
    const response = await api.get<ApiResponse<HeatmapStatsDTO>>(
      '/v1/dashboard/admin/statistiques/heatmap'
    );
    return response.data.data;
  },
};
