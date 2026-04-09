<script setup>
import AnalyticsCongratulations from "@/views/etudiant/AnalyticsCongratulationsEtudiant.vue";
import AnalyticsFinanceTabs from "@/views/etudiant/AnalyticsFinanceTabEtudiant.vue";
import AnalyticsISISCompetencies from "@/views/etudiant/AnalyticsISISCompetenciesEtudiant.vue";
import AnalyticsOrderStatistics from "@/views/etudiant/AnalyticsOrderStatisticsEtudiant.vue";
import AnalyticsProfitReport from "@/views/etudiant/AnalyticsProfitReportEtudiant.vue";
import AnalyticsTransactions from "@/views/etudiant/AnalyticsTransactionsEtudiant.vue";

const modulesMoreList = [
  { title: "Voir les modules", value: "ViewModules" },
  { title: "Actualiser", value: "Refresh" },
  { title: "Télécharger", value: "Download" },
];

const progressMoreList = [
  { title: "Détails du parcours", value: "Details" },
  { title: "Historique", value: "History" },
  { title: "Objectifs", value: "Goals" },
];

const recommendationsMoreList = [
  { title: "Voir toutes", value: "ViewAll" },
  { title: "Filtrer", value: "Filter" },
  { title: "Actualiser", value: "Refresh" },
];

const scoreMoreList = [
  { title: "Analyser", value: "Analyze" },
  { title: "Comparer", value: "Compare" },
  { title: "Détails", value: "Details" },
];
</script>

<template>
  <VRow>
    <!-- 👉 Congratulations + Rapport de Compétences -->
    <VCol cols="12" md="8">
      <AnalyticsCongratulations />
    </VCol>

    <VCol cols="12" md="4">
      <AnalyticsProfitReport />
    </VCol>

    <!-- 👉 Activités d'Apprentissage -->
    <VCol cols="12" md="4">
      <AnalyticsTransactions />
    </VCol>

    <!-- 👉 Compétences ISIS -->
    <VCol cols="12" md="8">
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

    <!-- 👉 Statistiques -->
    <VCol cols="12" md="4" sm="6">
      <VRow>
        <!-- 👉 Modules Complétés -->
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
                <MoreBtn :menu-list="modulesMoreList" />
              </div>
            </VCardItem>
            <VCardText class="text-start">
              <p class="text-sm text-medium-emphasis mb-1">Modules Complétés</p>
              <h5 class="text-h5 mb-1">12/18</h5>
              <span class="text-sm text-success"
                ><VIcon icon="bx-chevron-up" size="20" />25.4%</span
              >
            </VCardText>
          </VCard>
        </VCol>

        <!-- 👉 Progression Totale -->
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
                <MoreBtn :menu-list="progressMoreList" />
              </div>
            </VCardItem>
            <VCardText class="text-start">
              <p class="text-sm text-medium-emphasis mb-1">
                Progression Totale
              </p>
              <h5 class="text-h5 mb-1">67%</h5>
              <span class="text-sm text-success"
                ><VIcon icon="bx-chevron-up" size="20" />15.8%</span
              >
            </VCardText>
          </VCard>
        </VCol>

        <!-- 👉 Heures d'étude (semaine) -->
        <VCol cols="12" md="6">
          <VCard class="text-start">
            <VCardItem>
              <div class="d-flex align-center justify-space-between">
                <VAvatar
                  icon="bx-stopwatch"
                  color="primary"
                  size="48"
                  rounded
                  variant="tonal"
                />
                <MoreBtn :menu-list="recommendationsMoreList" />
              </div>
            </VCardItem>
            <VCardText class="text-start">
              <p class="text-sm text-medium-emphasis mb-1">
                Heures d'étude (semaine)
              </p>
              <h5 class="text-h5 mb-1">12h</h5>
              <span class="text-sm text-success"
                ><VIcon icon="bx-chevron-up" size="20" />10%</span
              >
            </VCardText>
          </VCard>
        </VCol>

        <!-- 👉 Score Moyen -->
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
                <MoreBtn :menu-list="scoreMoreList" />
              </div>
            </VCardItem>
            <VCardText class="text-start">
              <p class="text-sm text-medium-emphasis mb-1">Score Moyen</p>
              <h5 class="text-h5 mb-1">14.8/20</h5>
              <span class="text-sm text-success"
                ><VIcon icon="bx-chevron-up" size="20" />8.2%</span
              >
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
