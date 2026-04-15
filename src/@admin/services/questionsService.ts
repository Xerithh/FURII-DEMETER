import type {
    ApiResponse,
    CreateQuestionDTO,
    QuestionDTO,
} from '@/@admin/types/admin';
import api from '@/services/api';

/**
 * Questions Service - API calls for questions management
 */
export const questionsService = {
  /**
   * GET /v1/questions
   * Récupère toutes les questions PUBLIC (estCorrect masqué)
   */
  async getAll(): Promise<QuestionDTO[]> {
    const response = await api.get<QuestionDTO[]>(
      '/v1/questions'
    );
    return response.data;
  },

  /**
   * GET /v1/admin/questions
   * Récupère TOUTES les questions (actives + inactives, admin seulement)
   */
  async getAllAdmin(): Promise<QuestionDTO[]> {
    const response = await api.get<QuestionDTO[]>(
      '/v1/admin/questions'
    );
    return response.data;
  },

  /**
   * POST /v1/admin/questions
   * Crée une nouvelle question (ADMIN)
   */
  async create(payload: CreateQuestionDTO): Promise<QuestionDTO> {
    const response = await api.post<ApiResponse<QuestionDTO>>(
      '/v1/admin/questions',
      payload
    );
    return response.data.data;
  },

  /**
   * PUT /v1/admin/questions/{id}
   * Modifie une question existante (ADMIN)
   */
  async update(
    id: number,
    payload: Partial<CreateQuestionDTO>
  ): Promise<QuestionDTO> {
    const response = await api.put<ApiResponse<QuestionDTO>>(
      `/v1/admin/questions/${id}`,
      payload
    );
    return response.data.data;
  },

  /**
   * DELETE /v1/admin/questions/{id}
   * Supprime une question (ADMIN)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/v1/admin/questions/${id}`);
  },

  /**
   * POST /v1/admin/questions/{id}/activer
   * Active une question (ADMIN)
   */
  async activate(id: number): Promise<QuestionDTO> {
    const response = await api.post<ApiResponse<QuestionDTO>>(
      `/v1/admin/questions/${id}/activer`
    );
    return response.data.data;
  },

  /**
   * POST /v1/admin/questions/{id}/desactiver
   * Désactive une question (ADMIN)
   */
  async deactivate(id: number): Promise<QuestionDTO> {
    const response = await api.post<ApiResponse<QuestionDTO>>(
      `/v1/admin/questions/${id}/desactiver`
    );
    return response.data.data;
  },
};
