<script setup lang="ts">
import type { SessionRecommendationAnalysisDTO } from "@/services/dashboardService";
import { dashboardService } from "@/services/dashboardService";
import type { SessionResultsDTO } from "@/types/quiz";
import { computed, ref } from "vue";

const props = defineProps<{
  results: SessionResultsDTO;
}>();

const emit = defineEmits<{
  (e: "restart"): void;
  (e: "go-modules"): void;
}>();

const aiLoading = ref(false);
const aiError = ref<string | null>(null);
const aiAnalysis = ref<SessionRecommendationAnalysisDTO | null>(null);

const formatNumber = (value: unknown) => {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return "0.00";
  return numberValue.toFixed(2);
};

const displayScore = computed(() => formatNumber(props.results.score));
const displayMaxScore = computed(() => {
  if (typeof props.results.maxScore !== "number") return null;
  return formatNumber(props.results.maxScore);
});

const hasCompetenceEvolution = computed(
  () =>
    !!props.results.competenceEvolution &&
    Object.keys(props.results.competenceEvolution).length > 0,
);

const canAnalyze = computed(() => typeof props.results.sessionId === "number");

const loadAiAnalysis = async () => {
  if (!props.results.sessionId || aiLoading.value) return;

  aiLoading.value = true;
  aiError.value = null;
  try {
    aiAnalysis.value = await dashboardService.getSessionRecommendations(
      props.results.sessionId,
    );
  } catch {
    aiError.value = "Impossible de récupérer l'analyse IA pour le moment.";
  } finally {
    aiLoading.value = false;
  }
};
</script>

<template>
  <v-card class="results-card" rounded="0" elevation="0">
    <div class="hero-image">
      <img src="/images/auth-placeholder.jpg" alt="Résultats de l'évaluation" />
    </div>

    <div class="results-content">
      <h2 class="text-h4 font-weight-bold mb-2">Évaluation terminée</h2>
      <p class="text-body-1 text-medium-emphasis mb-8">
        {{
          results.message ||
          "Voici votre score global et vos axes de progression."
        }}
      </p>

      <div class="score-shell mb-8">
        <div class="score-label">Score obtenu</div>
        <div class="score-value-row">
          <span class="score-value">{{ displayScore }}</span>
          <span v-if="displayMaxScore" class="score-divider">/</span>
          <span v-if="displayMaxScore" class="score-max">{{
            displayMaxScore
          }}</span>
        </div>
      </div>

      <div v-if="hasCompetenceEvolution" class="mb-8">
        <h3 class="text-h6 font-weight-medium mb-4">
          Évolution des compétences
        </h3>
        <div
          v-for="(val, competence) in results.competenceEvolution"
          :key="competence"
          class="d-flex align-center justify-space-between py-3 competence-row"
        >
          <span class="text-body-2 font-weight-medium">{{ competence }}</span>
          <v-chip
            :color="val > 0 ? 'success' : val < 0 ? 'error' : 'secondary'"
            size="small"
            label
          >
            {{ val > 0 ? "+" : "" }}{{ formatNumber(val) }}%
          </v-chip>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-3 mb-4">
        <v-btn
          size="large"
          variant="flat"
          class="v-theme--light v-btn v-btn--density-default v-btn--size-default btn-commencer rounded text-none px-5 flex-grow-1 action-btn"
          @click="emit('restart')"
        >
          Relancer une évaluation
        </v-btn>

        <v-btn
          size="large"
          variant="outlined"
          class="v-theme--light v-btn v-btn--density-default v-btn--size-default btn-commencer rounded text-none px-5 flex-grow-1 action-btn"
          @click="emit('go-modules')"
        >
          Voir mes modules
        </v-btn>

        <v-btn
          size="large"
          variant="flat"
          color="info"
          class="v-theme--light v-btn v-btn--density-default v-btn--size-default btn-commencer rounded text-none px-5 flex-grow-1 action-btn"
          :disabled="!canAnalyze"
          :loading="aiLoading"
          @click="loadAiAnalysis"
        >
          Analyser par l'IA
        </v-btn>
      </div>

      <v-alert v-if="aiError" type="error" variant="tonal" class="mb-4">
        {{ aiError }}
      </v-alert>

      <v-card v-if="aiAnalysis" variant="tonal" class="pa-4 ai-panel">
        <h3 class="text-h6 mb-3">Analyse IA personnalisée</h3>
        <p class="text-body-2 mb-1">
          Niveau:
          <strong>{{ aiAnalysis.studentProfile?.niveau || "N/A" }}</strong>
        </p>
        <p class="text-body-2 mb-1">
          Parcours:
          <strong>{{ aiAnalysis.studentProfile?.parcours || "N/A" }}</strong>
        </p>
        <p class="text-body-2 mb-4">
          Sessions analysées:
          <strong>{{ aiAnalysis.studentProfile?.nbSessions ?? 0 }}</strong>
        </p>

        <div v-if="aiAnalysis.strengths?.length" class="mb-4">
          <div class="text-subtitle-2 mb-2">Points forts</div>
          <v-chip
            v-for="item in aiAnalysis.strengths"
            :key="`${item.module}-${item.score}`"
            color="success"
            variant="outlined"
            size="small"
            class="me-2 mb-2"
          >
            {{ item.module }} ({{ formatNumber(item.score) }})
          </v-chip>
        </div>

        <div v-if="aiAnalysis.criticalGaps?.length" class="mb-2">
          <div class="text-subtitle-2 mb-2">Lacunes critiques</div>
          <div
            v-for="gap in aiAnalysis.criticalGaps"
            :key="`${gap.module}-${gap.raison}`"
            class="text-body-2 mb-2"
          >
            <strong>{{ gap.module }}</strong
            >: {{ gap.raison }} ({{ formatNumber(gap.score) }})
          </div>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<style scoped>
.results-card {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(var(--v-theme-surface), 1) 0%,
    rgba(var(--v-theme-primary), 0.03) 100%
  );
}

.hero-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.results-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.score-shell {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 14px;
  padding: 1.5rem;
  background-color: rgba(var(--v-theme-surface), 0.92);
}

.score-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.65);
  margin-bottom: 0.35rem;
}

.score-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.score-value {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: rgb(var(--v-theme-primary));
}

.score-divider,
.score-max {
  font-size: 1.4rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.competence-row + .competence-row {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.action-btn {
  border-radius: 10px;
  min-height: 44px;
  text-transform: none;
  font-weight: 600;
}

.ai-panel {
  border: 1px solid rgba(var(--v-theme-info), 0.22);
}

.gap-3 {
  gap: 0.75rem;
}
</style>
