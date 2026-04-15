import { dashboardService, type ApprenantDashboardDTO } from '@/services/dashboardService';
import { defineStore } from 'pinia';

interface DashboardState {
  data: ApprenantDashboardDTO | null;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    data: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * True si l'utilisateur n'a jamais fait d'évaluation
     */
    isEmpty: (state): boolean => {
      return (state.data?.progression?.sessionsTerminees ?? 0) === 0
        && (state.data?.activiteRecente?.length ?? 0) === 0;
    },

    /**
     * Noms des compétences pour les labels du graphique radar
     */
    competenceLabels: (state): string[] =>
      state.data?.competences?.map(c => c.nom) ?? [],

    /**
     * Scores des compétences pour la série du graphique radar
     */
    competenceScores: (state): number[] =>
      state.data?.competences?.map(c => Math.round(c.score)) ?? [],

    /**
     * Score moyen global ramené sur 20
     */
    scoreSur20: (state): string => {
      const s = state.data?.scores?.scoreMoyenGlobal ?? 0;
      return s.toFixed(1);
    },

    /**
     * Progression globale en pourcentage (entier)
     */
    progressionPercent: (state): number =>
      state.data?.progression?.completionPercent ?? 0,
  },

  actions: {
    async fetchDashboard() {
      this.isLoading = true;
      this.error = null;
      try {
        const dashboard = await dashboardService.getDashboard();
        const competences = await dashboardService.getCompetenceProgress();

        this.data = {
          ...dashboard,
          competences: competences ?? dashboard.competences ?? [],
        };
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Impossible de charger le tableau de bord';
        console.error('[DashboardStore] fetchDashboard error:', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
