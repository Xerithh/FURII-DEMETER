import { adminService } from '@/@admin/services/adminService';
import { questionsService } from '@/@admin/services/questionsService';
import type {
    ActiviteStatsDTO,
    AdminDashboardDTO,
    CompetencesStatsDTO,
    CreateQuestionDTO,
    HeatmapStatsDTO,
    PerformancesStatsDTO,
    QuestionDTO,
    QuestionsTypeStatsDTO,
    Role,
    SessionStatisticsDTO,
    StatutCompte,
    UtilisateurDashboardDTO,
} from '@/@admin/types/admin';
import { useToastStore } from '@/stores/toast';
import { defineStore } from 'pinia';

interface AdminState {
  dashboard: AdminDashboardDTO | null;
  users: UtilisateurDashboardDTO[];
  questions: QuestionDTO[];
  sessionStats: SessionStatisticsDTO | null;
  competencesStats: CompetencesStatsDTO | null;
  questionsStats: QuestionsTypeStatsDTO | null;
  performancesStats: PerformancesStatsDTO | null;
  activiteStats: ActiviteStatsDTO | null;
  heatmapStats: HeatmapStatsDTO | null;
  loading: {
    dashboard: boolean;
    users: boolean;
    questions: boolean;
    stats: boolean;
    competences: boolean;
    questions_stat: boolean;
    performances: boolean;
    activite: boolean;
    heatmap: boolean;
  };
  error: string | null;
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    dashboard: null,
    users: [],
    questions: [],
    sessionStats: null,
    competencesStats: null,
    questionsStats: null,
    performancesStats: null,
    activiteStats: null,
    heatmapStats: null,

    loading: {
      dashboard: false,
      users: false,
      questions: false,
      stats: false,
      competences: false,
      questions_stat: false,
      performances: false,
      activite: false,
      heatmap: false,
    },

    error: null,
  }),

  getters: {
    isDashboardLoading: (state) => state.loading.dashboard,
    isUsersLoading: (state) => state.loading.users,
    isQuestionsLoading: (state) => state.loading.questions,
    isStatsLoading: (state) => state.loading.stats,
  },

  actions: {
    // ─── DASHBOARD ──────────────────────────────────────────────

    async fetchDashboard() {
      const toast = useToastStore();
      this.loading.dashboard = true;
      try {
        this.dashboard = await adminService.getDashboard();
        this.error = null;
        return this.dashboard;
      } catch (err) {
        this.error = 'Erreur lors du chargement du dashboard';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchDashboard error:', err);
      } finally {
        this.loading.dashboard = false;
      }
    },

    // ─── USERS ──────────────────────────────────────────────────

    async fetchUsers(role?: Role, statut?: StatutCompte) {
      const toast = useToastStore();
      this.loading.users = true;
      try {
        this.users = await adminService.getUsers(role, statut);
        this.error = null;
      } catch (err) {
        this.error = 'Erreur lors du chargement des utilisateurs';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchUsers error:', err);
      } finally {
        this.loading.users = false;
      }
    },

    // ─── QUESTIONS ──────────────────────────────────────────────

    async fetchQuestions() {
      const toast = useToastStore();
      this.loading.questions = true;
      try {
        this.questions = await questionsService.getAllAdmin();
        this.error = null;
      } catch (err) {
        this.error = 'Erreur lors du chargement des questions';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchQuestions error:', err);
      } finally {
        this.loading.questions = false;
      }
    },

    async createQuestion(payload: CreateQuestionDTO) {
      const toast = useToastStore();
      try {
        const newQuestion = await questionsService.create(payload);
        this.questions.push(newQuestion);
        toast.addToast({ message: 'Question créée', type: 'success' });
        return newQuestion;
      } catch (err) {
        toast.addToast({ message: 'Erreur lors de la création', type: 'error' });
        console.error('createQuestion error:', err);
        throw err;
      }
    },

    async updateQuestion(id: number, payload: Partial<CreateQuestionDTO>) {
      const toast = useToastStore();
      try {
        const updated = await questionsService.update(id, payload);
        const idx = this.questions.findIndex((q) => q.id === id);
        if (idx >= 0) this.questions[idx] = updated;
        toast.addToast({ message: 'Question modifiée', type: 'success' });
        return updated;
      } catch (err) {
        toast.addToast({ message: 'Erreur lors de la modification', type: 'error' });
        console.error('updateQuestion error:', err);
        throw err;
      }
    },

    async deleteQuestion(id: number) {
      const toast = useToastStore();
      try {
        await questionsService.delete(id);
        this.questions = this.questions.filter((q) => q.id !== id);
        toast.addToast({ message: 'Question supprimée', type: 'success' });
      } catch (err) {
        toast.addToast({ message: 'Erreur lors de la suppression', type: 'error' });
        console.error('deleteQuestion error:', err);
        throw err;
      }
    },

    async toggleQuestion(id: number, activate: boolean) {
      const toast = useToastStore();
      try {
        const updated = activate
          ? await questionsService.activate(id)
          : await questionsService.deactivate(id);
        const idx = this.questions.findIndex((q) => q.id === id);
        if (idx >= 0) this.questions[idx] = updated;
        toast.addToast({ message: activate ? 'Question activée' : 'Question désactivée', type: 'success' });
        return updated;
      } catch (err) {
        toast.addToast({ message: 'Erreur lors de la modification', type: 'error' });
        console.error('toggleQuestion error:', err);
        throw err;
      }
    },

    // ─── SESSION STATISTICS ────────────────────────────────────

    async fetchSessionStatistics() {
      const toast = useToastStore();
      this.loading.stats = true;
      try {
        this.sessionStats = await adminService.getSessionStatistics();
        this.error = null;
        return this.sessionStats;
      } catch (err) {
        this.error = 'Erreur lors du chargement des statistiques';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchSessionStatistics error:', err);
      } finally {
        this.loading.stats = false;
      }
    },

    // ─── COMPETENCES STATS ─────────────────────────────────────

    async fetchCompetencesStats() {
      const toast = useToastStore();
      this.loading.competences = true;
      try {
        this.competencesStats = await adminService.getCompetencesStats();
        this.error = null;
        return this.competencesStats;
      } catch (err) {
        this.error = 'Erreur lors du chargement des stats compétences';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchCompetencesStats error:', err);
      } finally {
        this.loading.competences = false;
      }
    },

    // ─── QUESTIONS STATS ───────────────────────────────────────

    async fetchQuestionsStats() {
      const toast = useToastStore();
      this.loading.questions_stat = true;
      try {
        this.questionsStats = await adminService.getQuestionsStats();
        this.error = null;
        return this.questionsStats;
      } catch (err) {
        this.error = 'Erreur lors du chargement des stats questions';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchQuestionsStats error:', err);
      } finally {
        this.loading.questions_stat = false;
      }
    },

    // ─── PERFORMANCES STATS ────────────────────────────────────

    async fetchPerformancesStats() {
      const toast = useToastStore();
      this.loading.performances = true;
      try {
        this.performancesStats = await adminService.getPerformancesStats();
        this.error = null;
        return this.performancesStats;
      } catch (err) {
        this.error = 'Erreur lors du chargement des stats performances';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchPerformancesStats error:', err);
      } finally {
        this.loading.performances = false;
      }
    },

    // ─── ACTIVITE STATS ────────────────────────────────────────

    async fetchActiviteStats(periode: string = '7j') {
      const toast = useToastStore();
      this.loading.activite = true;
      try {
        this.activiteStats = await adminService.getActiviteStats(periode);
        this.error = null;
        return this.activiteStats;
      } catch (err) {
        this.error = 'Erreur lors du chargement des stats activité';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchActiviteStats error:', err);
      } finally {
        this.loading.activite = false;
      }
    },

    // ─── HEATMAP STATS ─────────────────────────────────────────

    async fetchHeatmapStats() {
      const toast = useToastStore();
      this.loading.heatmap = true;
      try {
        this.heatmapStats = await adminService.getHeatmapStats();
        this.error = null;
        return this.heatmapStats;
      } catch (err) {
        this.error = 'Erreur lors du chargement de la heatmap';
        toast.addToast({ message: this.error, type: 'error' });
        console.error('fetchHeatmapStats error:', err);
      } finally {
        this.loading.heatmap = false;
      }
    },
  },
});
