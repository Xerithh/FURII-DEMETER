import api from './api';

export interface UniteEnseignement {
  id: number;
  code: string;
  libelle: string;
  ects: number;
  semestre: string;
}

export interface CompetenceReferentiel {
  id: number;
  intitule: string;
  description: string;
  numeroOrdre: number;
  niveauAttendu: number;
  poids: number;
}

export interface ModuleReferentiel {
  id: number;
  code: string;
  nom: string;
  semestre: string;
  uniteEnseignement?: UniteEnseignement;
  heuresCM: number;
  heuresTD: number;
  heuresTP: number;
  heuresProjet: number;
  heuresTotal: number;
  evaluable: boolean;
  prerequisTexte: string;
  competences?: CompetenceReferentiel[];
  modulesPrerequisList?: ModuleReferentiel[];
}

export const referentielService = {
  /**
   * Récupère la liste de tous les modules du référentiel
   */
  async getAllModules(): Promise<ModuleReferentiel[]> {
    const response = await api.get('/api/v1/referentiel/modules');
    return response.data;
  },

  /**
   * Récupère la liste des modules d'un semestre spécifique
   */
  async getModulesBySemestre(semestre: string): Promise<ModuleReferentiel[]> {
    const response = await api.get(`/api/v1/referentiel/semestres/${semestre}/modules`);
    return response.data;
  },

  /**
   * Récupère les détails d'un module spécifique par son ID
   */
  async getModuleById(id: number): Promise<ModuleReferentiel> {
    const response = await api.get(`/api/v1/referentiel/modules/${id}`);
    return response.data;
  },

  /**
   * Récupère les compétences d'un module par son ID
   */
  async getModuleCompetences(id: number): Promise<CompetenceReferentiel[]> {
    const response = await api.get(`/api/v1/referentiel/modules/${id}/competences`);
    return response.data;
  }
};
