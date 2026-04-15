import api from '@/services/api';

export interface CompetenceScoreDTO {
  competenceId: number;
  nom: string;
  scoreObtenu: number;
  niveauAtteint: number;
  statut: 'LACUNE' | 'A_RENFORCER' | 'ACQUIS' | 'MAITRISE';
  nbBonnesReponses: number;
  nbQuestions: number;
}

export interface SessionDTO {
  sessionId: number;
  numeroSession: number;
  dateDebut: string;
  dateFin: string;
  statut: 'TERMINEE' | 'EN_COURS' | 'ABANDONNEE';
  dureeMinutes: number;
  scoreGlobal: number;
  totalQuestions: number;
  questionsRepondues: number;
  scoresCompetences: CompetenceScoreDTO[];
  raison?: string;
}

export interface UserHistoryDTO {
  utilisateurId: number;
  email: string;
  nom: string;
  prenom: string;
  totalSessions: number;
  sessionsTerminees: number;
  scoreGlobalMoyen: number;
  sessions: SessionDTO[];
}

class UsersService {
  async getHistorique(idEtudiant: number): Promise<UserHistoryDTO> {
    try {
      const response = await api.get(
        `/api/v1/dashboard/admin/utilisateurs/${idEtudiant}/historique`
      );
      // API response structure: { timestamp, status, success, message, data: {...} }
      // We need to extract the nested data field
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

  async getAll(): Promise<any[]> {
    try {
      const response = await api.get('/api/v1/dashboard/admin/utilisateurs');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  async getUserStats(idEtudiant: number): Promise<any> {
    try {
      const response = await api.get(
        `/api/v1/dashboard/admin/utilisateurs/${idEtudiant}/statistiques`
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export default new UsersService();
