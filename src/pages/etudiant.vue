<script setup lang="ts">
import { useDashboardStore } from "@/stores/dashboard";
import AnalyticsCongratulations from "@/views/etudiant/AnalyticsCongratulationsEtudiant.vue";
import AnalyticsFinanceTabs from "@/views/etudiant/AnalyticsFinanceTabEtudiant.vue";
import AnalyticsISISCompetencies from "@/views/etudiant/AnalyticsISISCompetenciesEtudiant.vue";
import AnalyticsOrderStatistics from "@/views/etudiant/AnalyticsOrderStatisticsEtudiant.vue";
import AnalyticsProfitReport from "@/views/etudiant/AnalyticsProfitReportEtudiant.vue";
import AnalyticsTransactions from "@/views/etudiant/AnalyticsTransactionsEtudiant.vue";

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchDashboard();
});
</script>

<template>
  <VRow>
    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- LOADING STATE                                               -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <VCol
      v-if="dashboardStore.isLoading"
      cols="12"
      class="d-flex justify-center align-center py-16"
    >
      <div class="text-center">
        <VProgressCircular
          indeterminate
          color="primary"
          size="56"
          class="mb-4"
        />
      </div>
    </VCol>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- EMPTY STATE (aucune évaluation réalisée)                    -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <VCol v-else-if="dashboardStore.isEmpty && !dashboardStore.error" cols="12">
      <VCard class="text-center py-16 px-6">
        <img
          src="/images/undraw_waiting-for-you.svg"
          alt="Aucune évaluation réalisée"
          class="mb-8"
          style="
            max-width: 300px;
            display: block;
            margin: 0 auto 1.5rem;
            height: auto;
          "
        />
        <h4 class="text-h4 font-weight-bold mb-4">Commencez votre parcours</h4>
        <p
          class="text-body-1 text-medium-emphasis mb-8"
          style="max-width: 560px; margin: 0 auto 2rem"
        >
          Aucune évaluation n'a encore été réalisée. Veuillez effectuer votre
          première évaluation pour débloquer l'analyse de vos compétences.
        </p>
        <VBtn
          color="primary"
          size="large"
          prepend-icon="bx-play"
          to="/student/my-modules"
          elevation="0"
        >
          Accéder à mes modules
        </VBtn>
      </VCard>
    </VCol>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- ERROR STATE                                                  -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <VCol v-else-if="dashboardStore.error" cols="12">
      <VAlert type="error" variant="tonal" class="mb-6">
        {{ dashboardStore.error }}
        <template #append>
          <VBtn
            size="small"
            variant="text"
            @click="dashboardStore.fetchDashboard()"
          >
            Réessayer
          </VBtn>
        </template>
      </VAlert>
    </VCol>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- DASHBOARD CONTENT (données réelles)                         -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <template v-else-if="dashboardStore.data">
      <!-- 👉 Congratulations + Rapport de Compétences -->
      <VCol cols="12" md="8">
        <AnalyticsCongratulations />
      </VCol>

      <VCol cols="12" md="4">
        <AnalyticsProfitReport />
      </VCol>

      <!-- 👉 Activités d'Apprentissage -->
      <VCol cols="12" md="6" class="d-flex">
        <AnalyticsTransactions />
      </VCol>

      <!-- 👉 Compétences ISIS -->
      <VCol cols="12" md="6" class="d-flex">
        <AnalyticsISISCompetencies />
      </VCol>

      <!-- 👉 Répartition des Modules -->
      <VCol cols="12" md="4" sm="6">
        <AnalyticsOrderStatistics />
      </VCol>

      <!-- 👉 Analyse de Performance -->
      <VCol cols="12" md="4" sm="6">
        <AnalyticsFinanceTabs />
      </VCol>

      <!-- 👉 Statistiques - 4 cartes -->
      <VCol cols="12" md="4" sm="6">
        <VRow>
          <!-- Sessions terminées -->
          <VCol cols="12" md="6">
            <VCard class="text-start">
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <VAvatar
                    icon="bx-book"
                    color="primary"
                    size="48"
                    rounded
                    variant="tonal"
                  />
                </div>
              </VCardItem>
              <VCardText class="text-start">
                <p class="text-sm text-medium-emphasis mb-1">
                  Sessions Terminées
                </p>
                <h5 class="text-h5 mb-1">
                  {{ dashboardStore.data.progression.sessionsTerminees }}
                </h5>
                <span class="text-sm text-medium-emphasis"
                  >{{
                    dashboardStore.data.progression.questionsRepondues
                  }}
                  questions répondues</span
                >
              </VCardText>
            </VCard>
          </VCol>

          <!-- Progression -->
          <VCol cols="12" md="6">
            <VCard class="text-start">
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <VAvatar
                    icon="bx-trending-up"
                    color="info"
                    size="48"
                    rounded
                    variant="tonal"
                  />
                </div>
              </VCardItem>
              <VCardText class="text-start">
                <p class="text-sm text-medium-emphasis mb-1">
                  Progression Totale
                </p>
                <h5 class="text-h5 mb-1">
                  {{ dashboardStore.progressionPercent }}%
                </h5>
                <span class="text-sm text-success">
                  <VIcon icon="bx-chevron-up" size="20" />
                  Parcours complété
                </span>
              </VCardText>
            </VCard>
          </VCol>

          <!-- Score Moyen -->
          <VCol cols="12" md="6">
            <VCard class="text-start">
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <VAvatar
                    icon="bx-medal"
                    color="success"
                    size="48"
                    rounded
                    variant="tonal"
                  />
                </div>
              </VCardItem>
              <VCardText class="text-start">
                <p class="text-sm text-medium-emphasis mb-1">Score Moyen</p>
                <h5 class="text-h5 mb-1">{{ dashboardStore.scoreSur20 }}/20</h5>
                <span
                  class="text-sm"
                  :class="
                    dashboardStore.data.scores.evolutionScore?.startsWith('+')
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  <VIcon
                    :icon="
                      dashboardStore.data.scores.evolutionScore?.startsWith('+')
                        ? 'bx-chevron-up'
                        : 'bx-chevron-down'
                    "
                    size="20"
                  />
                  {{ dashboardStore.data.scores.evolutionScore }}
                </span>
              </VCardText>
            </VCard>
          </VCol>

          <!-- Compétences maîtrisées -->
          <VCol cols="12" md="6">
            <VCard class="text-start">
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <VAvatar
                    icon="bx-brain"
                    color="warning"
                    size="48"
                    rounded
                    variant="tonal"
                  />
                </div>
              </VCardItem>
              <VCardText class="text-start">
                <p class="text-sm text-medium-emphasis mb-1">Compétences</p>
                <h5 class="text-h5 mb-1">
                  {{
                    dashboardStore.data.competences.filter(
                      (c) => c.niveau === "ACQUIS",
                    ).length
                  }}/{{ dashboardStore.data.competences.length }}
                </h5>
                <span class="text-sm text-success">Acquises</span>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </template>
  </VRow>
</template>
