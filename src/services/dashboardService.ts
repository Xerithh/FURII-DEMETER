import api from './api';

// ─── Types basés sur le Swagger (ApiResponseApprenantDashboardDTO) ───────────

export interface UtilisateurDTO {
  nom: string;
  prenom: string;
  role: string;
}

export interface ProgressionDTO {
  completionPercent: number;
  sessionsTerminees: number;
  questionsRepondues: number;
}

export interface ScoresDTO {
  scoreMoyenGlobal: number;
  evolutionScore: string; // e.g. "+5%"
}

export interface CompetenceDTO {
  nom: string;
  score: number;
  lacunes: string;
  niveau: 'NON_DEMARRE' | 'EN_COURS' | 'ACQUIS';
}

export interface ActiviteRecenteDTO {
  date: string;           // ISO date string
  type: string;
  titre: string;
  resultat: string;
}

export interface ApprenantDashboardDTO {
  utilisateur: UtilisateurDTO;
  progression: ProgressionDTO;
  scores: ScoresDTO;
  competences: CompetenceDTO[];
  activiteRecente: ActiviteRecenteDTO[];
}

// ─── Types sessions (endpoint secondaire) ─────────────────────────────────────

export interface SessionTest {
  id: number;
  dateDebut: string;
  dateFin?: string;
  statut: string;
  numeroSession: number;
  ordre_modules_json?: string;
}

export interface CompetenceEvaluee {
  competenceId: number;
  nomCompetence: string;
  score: number;
  niveauAtteint: number;
}

export interface SessionDetailDTO {
  sessionId: number;
  dateDebut: string;
  dateFin?: string;
  statut: string;
  scoreGlobal: number;
  competencesEvaluees: CompetenceEvaluee[];
}

export interface RecommendationDTO {
  id: number;
  texte: string;
  type: string;
  moduleId?: number;
}

export interface CompetenceProgressDTO {
  id: number;
  nom: string;
  score: number;
  niveau?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const dashboardService = {
  /**
   * Endpoint central du dashboard apprenant (Swagger: GET /api/v1/dashboard/apprenant)
   * Retourne utilisateur, progression, scores, compétences et activité récente
   */
  async getDashboard(): Promise<ApprenantDashboardDTO> {
    const response = await api.get('/api/v1/dashboard/apprenant');
    // Le backend enveloppe dans { data: { ... } } selon la spec Swagger
    return response.data.data ?? response.data;
  },

  /**
   * Récupère la liste des sessions pour l'historique
   */
  async getSessions(): Promise<SessionTest[]> {
    const response = await api.get('/api/v1/dashboard/apprenant/sessions');
    return response.data.data ?? response.data;
  },

  /**
   * Récupère le détail complet d'une session (pour le drawer)
   */
  async getSessionDetails(sessionId: number): Promise<SessionDetailDTO> {
    const response = await api.get(`/api/v1/dashboard/apprenant/sessions/${sessionId}`);
    return response.data.data ?? response.data;
  },

  /**
   * Récupère les recommandations pour une session
   */
  async getSessionRecommendations(sessionId: number): Promise<RecommendationDTO[]> {
    const response = await api.get(`/api/v1/eval/sessions/${sessionId}/recommendations`);
    return response.data.data ?? response.data;
  },

  /**
   * Récupère la progression de l'apprenant par compétence (endpoint Legacy)
   */
  async getCompetenceProgress(): Promise<CompetenceProgressDTO[]> {
    const response = await api.get('/api/v1/dashboard/apprenant/competences');
    return response.data.data ?? response.data;
  }
};
