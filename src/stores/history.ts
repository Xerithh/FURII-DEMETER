import { defineStore } from 'pinia';
import {
  dashboardService,
  type Activite7JoursDTO,
  type CompetenceProgressDTO,
  type SessionDetailDTO,
  type SessionTest,
} from '@/services/dashboardService';
import {
  computeDurationLabel,
  formatHistoryDateAbsolute,
  formatHistoryDatePrecise,
  formatHistoryDateRelative,
  toSortableTimestamp,
} from '@/utils/historyDate';

export type HistoryEventType =
  | 'SESSION'
  | 'COMPETENCE_VALIDATION'
  | 'MILESTONE_REACHED';

export interface HistoryEvent {
  id: string;
  origin: 'sessions' | 'activity' | 'competences';
  eventType: HistoryEventType;
  occurredAt: string;
  title: string;
  details: string;
  result?: string;
  sessionId?: number;
  competenceId?: number;
  competenceName?: string;
  competenceDescription?: string;
  levelBefore?: string | number;
  levelAfter?: string | number;
  score?: number;
  status?: string;
  raw: unknown;
}

export interface SessionCompetenceDelta {
  competenceId?: number;
  competenceName: string;
  scoreAfter?: number;
  scoreBefore?: number;
  beforeLabel: string;
  afterLabel: string;
  levelBefore?: string | number;
  levelAfter?: string | number;
}

export interface SessionDrawerDetail {
  datePrecise: string;
  scorePercent: number;
  duration: string;
  competences: SessionCompetenceDelta[];
  treatedCompetences: string[];
}

const parseEventType = (rawType?: string): HistoryEventType => {
  const t = (rawType || '').toLowerCase();
  if (t.includes('palier') || t.includes('niveau'))
    return 'MILESTONE_REACHED';
  if (t.includes('compet') || t.includes('validation'))
    return 'COMPETENCE_VALIDATION';
  return 'SESSION';
};

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value))
    return value;

  if (typeof value === 'string') {
    const normalized = Number(value.replace(',', '.'));
    return Number.isFinite(normalized) ? normalized : undefined;
  }

  return undefined;
};

const readAny = (obj: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null)
      return obj[key];
  }

  return undefined;
};

const toPercentScore = (score?: number): number => {
  if (score === undefined)
    return 0;
  if (score <= 1)
    return Math.round(score * 100);
  if (score <= 20)
    return Math.round(score * 5);
  return Math.round(Math.min(100, score));
};

const isCompetenceFullyValidated = (competence: CompetenceProgressDTO): boolean => {
  if (!competence)
    return false;

  const isFullScore = competence.score === 1 || competence.score === 100;
  const hasAcquiredStatus = competence.niveau?.toUpperCase() === 'ACQUIS';
  const hasMilestoneLevel = competence.niveauAtteint !== undefined;

  return isFullScore || hasAcquiredStatus || hasMilestoneLevel;
};

const hasValidDate = (competence: CompetenceProgressDTO): boolean => {
  const date = competence.dateValidation || competence.derniereValidation;
  if (!date)
    return false;

  const parsed = new Date(date);
  const year = parsed.getFullYear();

  return year >= 2000 && year <= 2100;
};

const mapSessionEvent = (session: SessionTest): HistoryEvent => ({
  id: `session-${session.id}`,
  origin: 'sessions',
  eventType: 'SESSION',
  occurredAt: session.dateDebut,
  title: `Session #${session.numeroSession || session.id}`,
  details: session.statut === 'COMPLETED' ? 'Session terminee' : 'Session en cours',
  result: session.statut,
  sessionId: session.id,
  status: session.statut,
  raw: session,
});

const mapActivityEvent = (activity: Activite7JoursDTO, index: number): HistoryEvent => {
  const eventType = parseEventType(activity.type);
  const title = activity.titre || activity.type || 'Activite recente';

  return {
    id: `activity-${activity.id ?? `${activity.date}-${index}`}`,
    origin: 'activity',
    eventType,
    occurredAt: activity.date,
    title,
    details: activity.resultat || activity.type || 'Activite realisee',
    result: activity.resultat,
    sessionId: activity.sessionId,
    competenceId: activity.competenceId,
    competenceName: activity.competenceNom,
    raw: activity,
  };
};

const mapCompetenceMilestoneEvent = (
  competence: CompetenceProgressDTO,
  index: number,
): HistoryEvent | null => {
  if (!isCompetenceFullyValidated(competence) || !hasValidDate(competence))
    return null;

  const hasMilestone = competence.niveauAtteint !== undefined || competence.niveauPrecedent !== undefined;

  return {
    id: `competence-${competence.id ?? index}`,
    origin: 'competences',
    eventType: hasMilestone ? 'MILESTONE_REACHED' : 'COMPETENCE_VALIDATION',
    occurredAt: competence.dateValidation || competence.derniereValidation || new Date(0).toISOString(),
    title: competence.nom || 'Competence',
    details: hasMilestone
      ? `Palier atteint: ${competence.niveauAtteint ?? competence.niveau ?? 'N/A'}`
      : `Validation competence: ${competence.niveau ?? 'N/A'}`,
    competenceId: competence.id,
    competenceName: competence.nom,
    competenceDescription: competence.description,
    levelBefore: competence.niveauPrecedent,
    levelAfter: competence.niveauAtteint ?? competence.niveau,
    score: competence.score,
    raw: competence,
  };
};

const dedupeEvents = (events: HistoryEvent[]): HistoryEvent[] => {
  const uniq = new Map<string, HistoryEvent>();

  for (const event of events) {
    const dedupeKey = [
      event.eventType,
      event.sessionId ?? event.competenceId ?? event.title,
      event.occurredAt,
      event.origin,
    ].join('::');

    if (!uniq.has(dedupeKey))
      uniq.set(dedupeKey, event);
  }

  return [...uniq.values()];
};

const coerceArray = <T>(input: unknown, source: string): T[] => {
  if (Array.isArray(input))
    return input as T[];

  if (input && typeof input === 'object') {
    const container = input as Record<string, unknown>;
    const candidateKeys = [
      'data',
      'items',
      'content',
      'results',
      'sessions',
      'activites',
      'competences',
    ];

    for (const key of candidateKeys) {
      const value = container[key];
      if (Array.isArray(value))
        return value as T[];
    }
  }

  return [];
};

const mapSessionDrawerDetails = (details: SessionDetailDTO): SessionDrawerDetail => {
  const competences = (details.competencesEvaluees || []).map((item: Record<string, unknown>) => {
    const scoreAfter = parseNumber(readAny(item, ['scoreApres', 'score_after', 'score', 'afterScore']));
    const scoreBefore = parseNumber(readAny(item, ['scoreAvant', 'score_before', 'beforeScore']));

    const beforeLabel = scoreBefore !== undefined ? `${toPercentScore(scoreBefore)}%` : 'N/A';
    const afterLabel = scoreAfter !== undefined ? `${toPercentScore(scoreAfter)}%` : 'N/A';

    return {
      competenceId: parseNumber(readAny(item, ['competenceId', 'id'])),
      competenceName: String(readAny(item, ['nomCompetence', 'nom', 'name']) || 'Competence'),
      scoreAfter,
      scoreBefore,
      beforeLabel,
      afterLabel,
      levelBefore: readAny(item, ['niveauAvant', 'niveau_before', 'levelBefore']),
      levelAfter: readAny(item, ['niveauAtteint', 'niveauApres', 'levelAfter']),
    };
  });

  const treatedCompetences = [...new Set(competences.map(c => c.competenceName).filter(Boolean))];

  return {
    datePrecise: formatHistoryDatePrecise(details.dateDebut),
    scorePercent: toPercentScore(parseNumber(details.scoreGlobal)),
    duration: computeDurationLabel(details.dateDebut, details.dateFin),
    competences,
    treatedCompetences,
  };
};

interface HistoryState {
  events: HistoryEvent[];
  isLoading: boolean;
  error: string | null;
  isLoadingDetails: boolean;
  sessionDrawerDetail: SessionDrawerDetail | null;
}

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    events: [],
    isLoading: false,
    error: null,
    isLoadingDetails: false,
    sessionDrawerDetail: null,
  }),

  getters: {
    isEmpty: state => state.events.length === 0,
  },

  actions: {
    async fetchHistory() {
      this.isLoading = true;
      this.error = null;

      try {
        const [sessionsRes, activityRes, competencesRes] = await Promise.allSettled([
          dashboardService.getSessions(),
          dashboardService.getRecentActivity7Days(),
          dashboardService.getCompetenceProgress(),
        ]);

        const sessions = sessionsRes.status === 'fulfilled'
          ? coerceArray<SessionTest>(sessionsRes.value, 'sessions')
          : [];
        const activity = activityRes.status === 'fulfilled'
          ? coerceArray<Activite7JoursDTO>(activityRes.value, 'activite/7-jours')
          : [];
        const competences = competencesRes.status === 'fulfilled'
          ? coerceArray<CompetenceProgressDTO>(competencesRes.value, 'competences')
          : [];

        const sessionEvents = sessions.map(mapSessionEvent);
        const activityEvents = activity.map(mapActivityEvent);
        const competenceEventsMapped = competences.map(mapCompetenceMilestoneEvent);
        const competenceEvents = competenceEventsMapped.filter(
          (event): event is HistoryEvent => event !== null,
        );

        const merged = dedupeEvents([...sessionEvents, ...activityEvents, ...competenceEvents]);

        this.events = merged.sort(
          (a, b) => toSortableTimestamp(b.occurredAt) - toSortableTimestamp(a.occurredAt),
        );
      } catch (error: any) {
        // log complet pour faciliter le debug: status, body et stack
        console.error('[HistoryStore.fetchHistory] error:', error);
        const status = error?.response?.status;
        const msg = error?.response?.data?.message || error?.message || 'Erreur inconnue';
        this.error = `${status ? status + ' - ' : ''}${msg}`;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSessionDrawerDetail(sessionId: number) {
      this.isLoadingDetails = true;
      this.sessionDrawerDetail = null;

      try {
        const details = await dashboardService.getSessionDetails(sessionId);
        this.sessionDrawerDetail = mapSessionDrawerDetails(details);
      } finally {
        this.isLoadingDetails = false;
      }
    },

    clearSessionDrawerDetail() {
      this.sessionDrawerDetail = null;
    },

    formatDateAbsolute(value?: string | Date | null): string {
      return formatHistoryDateAbsolute(value);
    },

    formatDateRelative(value?: string | Date | null): string {
      return formatHistoryDateRelative(value);
    },

    formatDatePrecise(value?: string | Date | null): string {
      return formatHistoryDatePrecise(value);
    },

    scoreToPercent(value?: number): number {
      return toPercentScore(value);
    },
  },
});
