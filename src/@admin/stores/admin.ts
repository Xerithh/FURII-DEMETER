import { adminService } from '@/@admin/services/adminService';
import { questionsService } from '@/@admin/services/questionsService';
import type {
    AdminDashboardDTO,
    CreateQuestionDTO,
    QuestionDTO,
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
  loading: {
    dashboard: boolean;
    users: boolean;
    questions: boolean;
    stats: boolean;
  };
  error: string | null;
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    dashboard: null,
    users: [],
    questions: [],
    sessionStats: null,

    loading: {
      dashboard: false,
      users: false,
      questions: false,
      stats: false,
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
      } catch (err) {
        this.error = 'Erreur lors du chargement du dashboard';
        toast.showError(this.error);
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
        toast.showError(this.error);
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
        toast.showError(this.error);
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
        toast.showSuccess('Question créée');
        return newQuestion;
      } catch (err) {
        toast.showError('Erreur lors de la création');
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
        toast.showSuccess('Question modifiée');
        return updated;
      } catch (err) {
        toast.showError('Erreur lors de la modification');
        console.error('updateQuestion error:', err);
        throw err;
      }
    },

    async deleteQuestion(id: number) {
      const toast = useToastStore();
      try {
        await questionsService.delete(id);
        this.questions = this.questions.filter((q) => q.id !== id);
        toast.showSuccess('Question supprimée');
      } catch (err) {
        toast.showError('Erreur lors de la suppression');
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
        toast.showSuccess(activate ? 'Question activée' : 'Question désactivée');
        return updated;
      } catch (err) {
        toast.showError('Erreur lors de la modification');
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
      } catch (err) {
        this.error = 'Erreur lors du chargement des statistiques';
        toast.showError(this.error);
        console.error('fetchSessionStatistics error:', err);
      } finally {
        this.loading.stats = false;
      }
    },
  },
});
