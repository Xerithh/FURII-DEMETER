export enum QuestionType {
  QCM_SIMPLE = 'QCM_SIMPLE',
  QCM_MULTIPLE = 'QCM_MULTIPLE',
  VRAI_FAUX = 'VRAI_FAUX',
  TEXTE_TROU = 'TEXTE_TROU',
  APPARIEMENT = 'APPARIEMENT',
  ORDRE = 'ORDRE',
}

export interface ChoiceDTO {
  id: number;
  text: string;
  ordre?: number | string;
  cote?: string;
}

export interface QuestionDisplayDTO {
  questionId: number;
  questionSessionId?: number;
  type: QuestionType | string;
  questionText: string;
  choices: ChoiceDTO[] | null;
}

export interface AnswerResponseDTO {
  isCorrect: boolean;
  correctAnswerInfo?: string;
  explanations?: string;
}

export interface SessionResultsDTO {
  sessionId?: number;
  score: number;
  maxScore?: number;
  competenceEvolution?: Record<string, number>;
  timeSpentSeconds?: number;
  message?: string;
}

export interface QuizSessionDTO {
  id: number;
  status: string;
  // Others properties if returned by /sessions/current
}
