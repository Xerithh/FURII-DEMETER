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
          :variant="aiAnalysis ? 'flat' : 'flat'"
          :color="aiAnalysis ? 'success' : 'info'"
          class="v-theme--light v-btn v-btn--density-default v-btn--size-default btn-commencer rounded text-none px-5 flex-grow-1 action-btn"
          :disabled="aiAnalysis ? true : !canAnalyze"
          :loading="aiLoading"
          @click="loadAiAnalysis"
        >
          <v-icon v-if="aiAnalysis" size="large">mdi-check</v-icon>
          <span v-else>Analyser par l'IA</span>
        </v-btn>
      </div>

      <v-alert v-if="aiError" type="error" variant="tonal" class="mb-4">
        {{ aiError }}
      </v-alert>

      <v-card v-if="aiAnalysis" variant="elevated" class="pa-6 ai-panel">
        <div class="d-flex align-center mb-6">
          <v-icon color="info" size="x-large" class="mr-3"
            >mdi-robot-outline</v-icon
          >
          <h3 class="text-h4 font-weight-bold mb-0">
            Analyse IA personnalisée
          </h3>
        </div>

        <template v-if="aiAnalysis.analyseLLM">
          <!-- Message personnalisé -->
          <div class="mb-6">
            <p class="text-body-1 text-medium-emphasis">
              <v-icon color="info" size="small" class="mr-2"
                >mdi-chat-outline</v-icon
              >
              {{ aiAnalysis.analyseLLM.messagePersonnalise }}
            </p>
          </div>

          <!-- Analyse Principale -->
          <div class="mb-6">
            <h4 class="text-h6 font-weight-bold mb-3">Analyse Principale</h4>
            <p class="text-body-1 text-on-surface">
              {{ aiAnalysis.analyseLLM.analysePrincipale }}
            </p>
          </div>

          <!-- Priorités / Actions -->
          <div v-if="aiAnalysis.analyseLLM.priorites?.length" class="mb-6">
            <h4 class="text-h6 font-weight-bold mb-3 text-error">
              Priorités d'Action
            </h4>
            <div
              v-for="(prio, i) in aiAnalysis.analyseLLM.priorites"
              :key="i"
              class="mb-4"
            >
              <div class="d-flex align-center mb-2">
                <v-icon color="error" size="small" class="mr-2"
                  >mdi-alert-circle-outline</v-icon
                >
                <strong class="text-error">{{ prio.module }}</strong>
                <v-chip class="ml-2" color="error" size="small" label>
                  {{ prio.urgence }}
                </v-chip>
              </div>
              <p class="text-body-2 text-medium-emphasis ml-6 mb-2">
                {{ prio.raison }}
              </p>
              <p class="text-body-2 ml-6">
                <strong>💡 Conseil :</strong> {{ prio.conseil }}
              </p>
            </div>
          </div>

          <!-- Recommandation de parcours -->
          <div
            v-if="
              aiAnalysis.analyseLLM.parcourRecommande ||
              aiAnalysis.analyseLLM.raisonParcours
            "
            class="mb-6"
          >
            <h4 class="text-h6 font-weight-bold mb-3">
              <v-icon class="mr-1">mdi-map-marker-path</v-icon>
              Recommandation
            </h4>
            <p class="text-body-1 text-on-surface">
              {{ aiAnalysis.analyseLLM.raisonParcours }}
            </p>
            <p
              v-if="aiAnalysis.analyseLLM.parcourRecommande"
              class="text-body-2 mt-2"
            >
              <strong>Parcours recommandé :</strong>
              {{ aiAnalysis.analyseLLM.parcourRecommande }}
            </p>
          </div>

          <!-- Données techniques (optionnel, peu visible) -->
          <v-expansion-panels class="mb-4" variant="accordion">
            <v-expansion-panel title="Détails techniques">
              <v-expansion-panel-text>
                <div
                  v-if="aiAnalysis.phaseStructuree?.studentProfile"
                  class="mb-4"
                >
                  <p class="text-caption text-medium-emphasis uppercase mb-2">
                    Profil
                  </p>
                  <p class="text-body-2">
                    <strong>Niveau :</strong>
                    {{
                      aiAnalysis.phaseStructuree.studentProfile.niveau || "N/A"
                    }}<br />
                    <strong>Parcours :</strong>
                    {{
                      aiAnalysis.phaseStructuree.studentProfile.parcours ||
                      "Non spécifié"
                    }}<br />
                    <strong>Sessions analysées :</strong>
                    {{
                      aiAnalysis.phaseStructuree.studentProfile.nbSessions ?? 0
                    }}
                  </p>
                </div>

                <div
                  v-if="aiAnalysis.phaseStructuree?.strengths?.length"
                  class="mb-4"
                >
                  <p class="text-caption text-medium-emphasis uppercase mb-2">
                    Points forts
                  </p>
                  <v-chip
                    v-for="item in aiAnalysis.phaseStructuree.strengths"
                    :key="`${item.module}-${item.score}`"
                    color="success"
                    variant="outlined"
                    size="small"
                    class="me-2 mb-2"
                  >
                    {{ item.module }} ({{ formatNumber(item.score) }})
                  </v-chip>
                </div>

                <div v-if="aiAnalysis.phaseStructuree?.blockingDependencies">
                  <p class="text-caption text-medium-emphasis uppercase mb-2">
                    Dépendances bloquantes
                  </p>
                  <template
                    v-for="(dep, module) in aiAnalysis.phaseStructuree
                      .blockingDependencies"
                    :key="module"
                  >
                    <p v-if="dep.bloque?.length" class="text-body-2 mb-2">
                      <strong>{{ module }}</strong> bloque :
                      {{ dep.bloque.join(", ") }}
                      <v-chip
                        size="x-small"
                        :color="
                          dep.severite === 'CRITIQUE' ? 'error' : 'warning'
                        "
                        class="ml-2"
                        label
                        >{{ dep.severite }}</v-chip
                      >
                    </p>
                  </template>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Mot de motivation -->
          <div
            class="text-center italic text-body-2 mt-8 pt-4 border-t border-opacity-20"
          >
            <p class="text-medium-emphasis">
              "{{ aiAnalysis.analyseLLM.messageMotivation }}"
            </p>
          </div>
        </template>

        <template v-else>
          <!-- Contenu par défaut si l'API ne renvoie pas le format LLM imbriqué -->
          <p class="text-body-2 mb-2">
            <strong>Niveau :</strong>
            {{ (aiAnalysis as any).studentProfile?.niveau || "N/A" }}
          </p>
          <p class="text-body-2 mb-2">
            <strong>Parcours :</strong>
            {{ (aiAnalysis as any).studentProfile?.parcours || "N/A" }}
          </p>
          <p class="text-body-2 mb-4">
            <strong>Sessions analysées :</strong>
            {{ (aiAnalysis as any).studentProfile?.nbSessions ?? 0 }}
          </p>

          <div v-if="(aiAnalysis as any).strengths?.length" class="mb-4">
            <p class="text-subtitle-2 mb-2">Points forts</p>
            <v-chip
              v-for="item in (aiAnalysis as any).strengths"
              :key="`${item.module}-${item.score}`"
              color="success"
              variant="outlined"
              size="small"
              class="me-2 mb-2"
            >
              {{ item.module }} ({{ formatNumber(item.score) }})
            </v-chip>
          </div>

          <div v-if="(aiAnalysis as any).criticalGaps?.length" class="mb-2">
            <p class="text-subtitle-2 mb-2">Lacunes critiques</p>
            <p
              v-for="gap in (aiAnalysis as any).criticalGaps"
              :key="`${gap.module}-${gap.raison}`"
              class="text-body-2 mb-2"
            >
              <strong>{{ gap.module }}</strong> : {{ gap.raison }} ({{
                formatNumber(gap.score)
              }})
            </p>
          </div>
        </template>
      </v-card>
    </div>
  </v-card>
</template>

<style scoped>
.results-card {
  width: 100%;
  min-height: 100vh;
  background: white;
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
  border: none !important;
  background: white;
  box-shadow: none !important;
}

.border-t {
  border-top: 1px solid currentColor !important;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
