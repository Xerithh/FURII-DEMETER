/**
 * Types & Enums pour le module Admin
 */

// ─── ENUMS ──────────────────────────────────────────────────────────

export enum Role {
  ETUDIANT_FIE3 = 'ETUDIANT_FIE3',
  CANDIDAT_VAE = 'CANDIDAT_VAE',
  ADMIN = 'ADMIN',
}

export enum StatutCompte {
  ACTIF = 'ACTIF',
  EN_ATTENTE_OTP = 'EN_ATTENTE_OTP',
  SUSPENDU = 'SUSPENDU',
}

export enum TypeQuestion {
  QCM_SIMPLE = 'QCM_SIMPLE',
  QCM_MULTIPLE = 'QCM_MULTIPLE',
  VRAI_FAUX = 'VRAI_FAUX',
  REPONSE_LIBRE = 'REPONSE_LIBRE',
}

export enum NiveauDifficulte {
  FACILE = 'FACILE', // ponderation: 1.0
  MOYEN = 'MOYEN', // ponderation: 1.5
  DIFFICILE = 'DIFFICILE', // ponderation: 2.0
}

// ─── INTERFACES - API RESPONSE ──────────────────────────────────────

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// ─── INTERFACES - ADMIN DASHBOARD ───────────────────────────────────

export interface CompetenceStats {
  id: number;
  nom: string;
  scoreMoyen: number;
  nombreApprenants: number;
  tauxAcquisition: number; // 0-1 (float)
  evolution: string; // 'MOMENTUM' | 'REGRESSION'
}

export interface AdminDashboardDTO {
  totalUtilisateurs: number;
  totalEtudiantsFIE3: number;
  totalCandidatsVAE: number;
  scoreMoyenGlobal: number;
  sessionsEnCours: number;
  tauxReussite: number;
  competencesTopPerformance: CompetenceStats[];
  competencesLacunes: CompetenceStats[];
}

// ─── INTERFACES - USERS ─────────────────────────────────────────────

export interface UtilisateurDashboardDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut: StatutCompte;
  nombreSessions: number;
  scoreMoyen: number;
  derniereConnexion: string; // ISO date
}

// ─── INTERFACES - QUESTIONS ─────────────────────────────────────────

export interface Choix {
  id: number;
  contenu: string;
  ordre: number;
  estCorrect?: boolean; // Masqué en GET /api/v1/questions
}

export interface QuestionDTO {
  id: number;
  enonce: string;
  type: TypeQuestion;
  difficulte: NiveauDifficulte;
  ponderation: number; // 1.0, 1.5, 2.0
  dureeSecondes: number;
  actif: boolean;
  dateCreation: string; // ISO date
  competenceIds: number[];
  choix: Choix[];
}

export interface CreateQuestionDTO {
  enonce: string;
  type: TypeQuestion;
  difficulte: NiveauDifficulte;
  dureeSecondes: number;
  competenceIds: number[];
  choix: {
    contenu: string;
    estCorrect: boolean;
    ordre: number;
  }[];
}

// ─── INTERFACES - SESSION STATISTICS ────────────────────────────────

export interface DailySessionCount {
  date: string; // YYYY-MM-DD
  nombre: number;
}

export interface SessionStatisticsDTO {
  totalSessions: number;
  sessionsTerminees: number;
  sessionsAbandonnes: number;
  dureeParMoyenne: number; // minutes
  scoreParMoyenne: number;
  sessionsParJour: DailySessionCount[];
}

// ─── INTERFACES - COMPETENCES STATS ─────────────────────────────────

export interface TopCompetence {
  id: number;
  nom: string;
  scoreMoyen: number;
  nombreApprenants: number;
  tauxReussite: number;
  evolution?: string; // MOMENTUM | REGRESSION
}

export interface CompetenceTendance {
  id: number;
  nom: string;
  semaine1: { score: number };
  semaine2: { score: number };
  semaine3: { score: number };
}

export interface CompetencesStatsDTO {
  topCompetences: TopCompetence[];
  competencesTendances: CompetenceTendance[];
}

// ─── INTERFACES - QUESTIONS STATS ───────────────────────────────────

export interface QuestionTypeStats {
  nombre: number;
  tauxReussite: number;
}

export interface QuestionsTypeStatsDTO {
  parType: {
    QCM_SIMPLE: QuestionTypeStats;
    QCM_MULTIPLE: QuestionTypeStats;
    VRAI_FAUX: QuestionTypeStats;
    REPONSE_LIBRE: QuestionTypeStats;
  };
  parDifficulte: {
    FACILE: QuestionTypeStats;
    MOYEN: QuestionTypeStats;
    DIFFICILE: QuestionTypeStats;
  };
}

// ─── INTERFACES - PERFORMANCES STATS ────────────────────────────────

export interface ScoreDistribution {
  range: string; // "0-20%", "20-40%", etc
  nombre: number;
}

export interface TypeApprenantStats {
  scoreMoyen: number;
  nombreApprenants: number;
}

export interface PerformancesStatsDTO {
  distributionScore: ScoreDistribution[];
  parTypApprenant: {
    ETUDIANT_FIE3: TypeApprenantStats;
    CANDIDAT_VAE: TypeApprenantStats;
  };
}

// ─── INTERFACES - ACTIVITE STATS ────────────────────────────────────

export interface ActivityDayStats {
  date: string;
  nombre: number;
  dureeParMoyenne: number;
}

export interface ActivityUserStats {
  date: string;
  nombre: number;
}

export interface ActiviteStatsDTO {
  sessionsParJour: ActivityDayStats[];
  apprenantsActifs: ActivityUserStats[];
}

// ─── INTERFACES - HEATMAP STATS ─────────────────────────────────────

export interface HeatmapRow {
  competence: string;
  FACILE: number;
  MOYEN: number;
  DIFFICILE: number;
}

export interface HeatmapStatsDTO {
  competenceParDifficulte: HeatmapRow[];
}
