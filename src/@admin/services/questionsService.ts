import api from '@/services/api';
import type {
  QuestionDTO,
  CreateQuestionDTO,
  ApiResponse,
} from '@/@admin/types/admin';

/**
 * Questions Service - API calls for questions management
 */
export const questionsService = {
  /**
   * GET /api/v1/questions
   * Récupère toutes les questions (estCorrect masqué)
   */
  async getAll(): Promise<QuestionDTO[]> {
    const response = await api.get<ApiResponse<QuestionDTO[]>>(
      '/api/v1/questions'
    );
    return response.data.data;
  },

  /**
   * POST /api/v1/admin/questions
   * Crée une nouvelle question (ADMIN)
   */
  async create(payload: CreateQuestionDTO): Promise<QuestionDTO> {
    const response = await api.post<ApiResponse<QuestionDTO>>(
      '/api/v1/admin/questions',
      payload
    );
    return response.data.data;
  },

  /**
   * PUT /api/v1/admin/questions/{id}
   * Modifie une question existante (ADMIN)
   */
  async update(
    id: number,
    payload: Partial<CreateQuestionDTO>
  ): Promise<QuestionDTO> {
    const response = await api.put<ApiResponse<QuestionDTO>>(
      `/api/v1/admin/questions/${id}`,
      payload
    );
    return response.data.data;
  },

  /**
   * DELETE /api/v1/admin/questions/{id}
   * Supprime une question (ADMIN)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/admin/questions/${id}`);
  },

  /**
   * POST /api/v1/admin/questions/{id}/activer
   * Active une question (ADMIN)
   */
  async activate(id: number): Promise<QuestionDTO> {
    const response = await api.post<ApiResponse<QuestionDTO>>(
      `/api/v1/admin/questions/${id}/activer`
    );
    return response.data.data;
  },

  /**
   * POST /api/v1/admin/questions/{id}/desactiver
   * Désactive une question (ADMIN)
   */
  async deactivate(id: number): Promise<QuestionDTO> {
    const response = await api.post<ApiResponse<QuestionDTO>>(
      `/api/v1/admin/questions/${id}/desactiver`
    );
    return response.data.data;
  },
};
