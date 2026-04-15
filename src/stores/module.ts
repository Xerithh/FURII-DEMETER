import { defineStore } from 'pinia';
import {
  referentielService,
  type ModuleReferentiel,
} from '@/services/referentielService';

interface ModuleState {
  modules: ModuleReferentiel[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
}

export const useModuleStore = defineStore('module', {
  state: (): ModuleState => ({
    modules: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  }),

  actions: {
    async fetchRecommendedModules(force = false) {
      if (this.hasFetched && !force) return;

      this.isLoading = true;
      this.error = null;

      try {
        const moduleIds = await referentielService.getCrossSessionRecommendedModuleIds();

        if (!moduleIds.length) {
          this.modules = [];
          this.hasFetched = true;
          return;
        }

        const enrichedModules = [];
        for (const moduleId of moduleIds) {
          const moduleDetails = await referentielService.getModuleById(moduleId);
          const competences = await referentielService.getModuleCompetences(moduleId);

          enrichedModules.push({
            ...moduleDetails,
            competences: competences ?? [],
          });
        }

        this.modules = enrichedModules;
        this.hasFetched = true;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ||
          'Impossible de charger les modules recommandes pour le moment.';
        console.error('[ModuleStore] fetchRecommendedModules error:', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
