<template>
  <div class="admin-statistics">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">📊 Statistiques Administrateur</h1>
      <VBtn
        color="primary"
        prepend-icon="bx:refresh"
        @click="refresh"
        :loading="isLoadingAll"
      >
        Actualiser
      </VBtn>
    </div>

    <!-- Loading State -->
    <VProgressLinear v-if="isLoadingAll" indeterminate class="mb-6" />

    <!-- KPI Cards Row -->
    <VRow class="mb-6">
      <!-- Total Sessions -->
      <VCol cols="12" sm="6" md="3">
        <VCard class="elevation-2">
          <VCardText class="text-center pa-6">
            <div class="text-h2 font-weight-bold text-primary mb-2">
              {{ stats.totalSessions }}
            </div>
            <div class="text-subtitle-2 text-medium-emphasis">
              Sessions Totales
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="elevation-2">
          <VCardText class="text-center pa-6">
            <div class="text-h2 font-weight-bold text-success mb-2">
              {{ stats.sessionsTerminees }}
            </div>
            <div class="text-subtitle-2 text-medium-emphasis">Terminées</div>
            <div class="text-caption mt-2">({{ completionRate }}%)</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="elevation-2">
          <VCardText class="text-center pa-6">
            <div class="text-h2 font-weight-bold text-error mb-2">
              {{ stats.sessionsAbandonnes }}
            </div>
            <div class="text-subtitle-2 text-medium-emphasis">Abandonnées</div>
            <div class="text-caption mt-2">({{ abandonRate }}%)</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="elevation-2">
          <VCardText class="text-center pa-6">
            <div class="text-h2 font-weight-bold text-warning mb-2">
              {{ (stats.scoreParMoyenne * 100).toFixed(1) }}%
            </div>
            <div class="text-subtitle-2 text-medium-emphasis">Score Moyen</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- CHART 1: Activité (Sessions + Apprenants Actifs) -->
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>📈 Activité Récente (7 derniers jours)</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText class="pa-6">
        <apexchart
          type="area"
          :options="chartsConfig.activite.options"
          :series="chartsConfig.activite.series"
          height="300"
        />
      </VCardText>
    </VCard>

    <!-- Row: Questions Stats + Performances -->
    <VRow class="mb-6">
      <!-- CHART 2: Questions par Type (Donut) -->
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardItem>
            <VCardTitle>🎯 Questions par Type</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-6">
            <apexchart
              type="donut"
              :options="chartsConfig.questionType.options"
              :series="chartsConfig.questionType.series"
              height="280"
            />
          </VCardText>
        </VCard>
      </VCol>

      <!-- CHART 3: Distribution des Scores (Histogram) -->
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardItem>
            <VCardTitle>📊 Distribution des Scores</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-6">
            <apexchart
              type="bar"
              :options="chartsConfig.scoreDistribution.options"
              :series="chartsConfig.scoreDistribution.series"
              height="280"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Row: Difficulté + Comparaison Apprenants -->
    <VRow class="mb-6">
      <!-- CHART 4: Questions par Difficulté (Radar) -->
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardItem>
            <VCardTitle>⚠️ Taux de Réussite par Difficulté</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-6">
            <apexchart
              type="radar"
              :options="chartsConfig.difficulty.options"
              :series="chartsConfig.difficulty.series"
              height="280"
            />
          </VCardText>
        </VCard>
      </VCol>

      <!-- CHART 5: Comparaison FIE3 vs VAE (Radar) -->
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardItem>
            <VCardTitle>👥 Comparaison FIE3 vs VAE</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-6">
            <apexchart
              type="radar"
              :options="chartsConfig.learnerComparison.options"
              :series="chartsConfig.learnerComparison.series"
              height="280"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- CHART 6: Top Compétences (Bar) -->
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>🏆 Top 5 Compétences</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText class="pa-6">
        <apexchart
          type="bar"
          :options="chartsConfig.topCompetences.options"
          :series="chartsConfig.topCompetences.series"
          height="300"
        />
      </VCardText>
    </VCard>

    <!-- CHART 7: Heatmap -->
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>🔥 Heatmap: Compétences × Difficulté</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText class="pa-6">
        <apexchart
          type="heatmap"
          :options="chartsConfig.heatmap.options"
          :series="chartsConfig.heatmap.series"
          height="300"
        />
      </VCardText>
    </VCard>

    <!-- Tendance Compétences -->
    <VCard>
      <VCardItem>
        <VCardTitle>📉 Tendances Compétences (3 semaines)</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText class="pa-6">
        <apexchart
          type="line"
          :options="chartsConfig.competenceTrend.options"
          :series="chartsConfig.competenceTrend.series"
          height="300"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from "@/@admin/stores/admin";
import { computed, onMounted, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

const apexchart = VueApexCharts;
const adminStore = useAdminStore();

// State
const stats = ref({
  totalSessions: 0,
  sessionsTerminees: 0,
  sessionsAbandonnes: 0,
  dureeParMoyenne: 0,
  scoreParMoyenne: 0,
  sessionsParJour: [] as any[],
});

const activiteStats = ref(null as any);
const questionsStats = ref(null as any);
const performancesStats = ref(null as any);
const competencesStats = ref(null as any);
const heatmapStats = ref(null as any);

const isLoadingAll = computed(() =>
  Object.values(adminStore.loading).some((v) => v),
);

// Computed properties
const completionRate = computed(() => {
  if (stats.value.totalSessions === 0) return 0;
  return (
    (stats.value.sessionsTerminees / stats.value.totalSessions) *
    100
  ).toFixed(1);
});

const abandonRate = computed(() => {
  if (stats.value.totalSessions === 0) return 0;
  return (
    (stats.value.sessionsAbandonnes / stats.value.totalSessions) *
    100
  ).toFixed(1);
});

// Chart Configurations
const chartsConfig = ref({
  activite: {
    options: {
      chart: { type: "area", stacked: false, toolbar: { show: true } },
      colors: ["#2196F3", "#4CAF50"],
      xaxis: { categories: [] as string[] },
      yaxis: [
        { title: { text: "Sessions" } },
        { opposite: true, title: { text: "Apprenants Actifs" } },
      ],
      stroke: { width: 2, curve: "smooth" },
    },
    series: [] as any[],
  },
  questionType: {
    options: {
      labels: ["QCM Simple", "QCM Multiple", "Vrai/Faux", "Réponse Libre"],
      colors: ["#2196F3", "#FF9800", "#4CAF50", "#F44336"],
      chart: { type: "donut" },
    },
    series: [] as number[],
  },
  difficulty: {
    options: {
      chart: { type: "radar" },
      colors: ["#2196F3"],
      labels: ["Facile", "Moyen", "Difficile"],
      xaxis: { categories: ["Facile", "Moyen", "Difficile"] },
    },
    series: [] as any[],
  },
  scoreDistribution: {
    options: {
      chart: { type: "bar" },
      colors: ["#2196F3"],
      xaxis: { categories: [] as string[] },
      plotOptions: { bar: { horizontal: false } },
    },
    series: [] as any[],
  },
  learnerComparison: {
    options: {
      chart: { type: "radar" },
      labels: ["Score Moyen", "Nombre d'Apprenants"],
      xaxis: { categories: ["Score Moyen", "Apprenants"] },
      colors: ["#2196F3", "#FF9800"],
    },
    series: [] as any[],
  },
  topCompetences: {
    options: {
      chart: { type: "bar" },
      colors: ["#4CAF50"],
      xaxis: { categories: [] as string[] },
      plotOptions: { bar: { horizontal: true } },
    },
    series: [] as any[],
  },
  heatmap: {
    options: {
      chart: { type: "heatmap" },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 0.3, name: "Faible", color: "#F44336" },
              { from: 0.3, to: 0.6, name: "Moyen", color: "#FF9800" },
              { from: 0.6, to: 1, name: "Bon", color: "#4CAF50" },
            ],
          },
        },
      },
      xaxis: { categories: ["Facile", "Moyen", "Difficile"] },
    },
    series: [] as any[],
  },
  competenceTrend: {
    options: {
      chart: { type: "line" },
      colors: ["#2196F3", "#FF9800", "#4CAF50"],
      xaxis: { categories: ["Semaine 1", "Semaine 2", "Semaine 3"] },
      stroke: { width: 2, curve: "smooth" },
    },
    series: [] as any[],
  },
});

// Methods
const loadStatistics = async () => {
  try {
    console.log("🔄 Loading all statistics...");
    // Load all statistics in parallel
    const [
      sessionStats,
      activite,
      questions,
      performances,
      competences,
      heatmap,
    ] = await Promise.all([
      adminStore.fetchSessionStatistics(),
      adminStore.fetchActiviteStats("7j"),
      adminStore.fetchQuestionsStats(),
      adminStore.fetchPerformancesStats(),
      adminStore.fetchCompetencesStats(),
      adminStore.fetchHeatmapStats(),
    ]);

    console.log("✅ sessionStats:", sessionStats);
    console.log("✅ activite:", activite);
    console.log("✅ questions:", questions);
    console.log("✅ performances:", performances);
    console.log("✅ competences:", competences);
    console.log("✅ heatmap:", heatmap);

    if (sessionStats) {
      stats.value = sessionStats;
    }
    if (activite) activiteStats.value = activite;
    if (questions) questionsStats.value = questions;
    if (performances) performancesStats.value = performances;
    if (competences) competencesStats.value = competences;
    if (heatmap) heatmapStats.value = heatmap;

    initializeCharts();
  } catch (err) {
    console.error("❌ Error loading statistics:", err);
  }
};

const initializeCharts = () => {
  try {
    // CHART 1: Activité
    if (activiteStats.value?.sessionsParJour) {
      console.log("📊 CHART 1 - Activité Data:", activiteStats.value);
      const dates = activiteStats.value.sessionsParJour.map((d: any) =>
        new Date(d.date).toLocaleDateString("fr-FR", {
          month: "short",
          day: "numeric",
        }),
      );
      const sessions = activiteStats.value.sessionsParJour.map(
        (d: any) => d.nombre,
      );
      console.log("📊 sessions:", sessions);
      console.log(
        "📊 apprenantsActifs data:",
        activiteStats.value.apprenantsActifs,
      );
      const apprenants = (activiteStats.value.apprenantsActifs || []).map(
        (d: any) => d?.nombre || 0,
      );
      console.log("📊 apprenants:", apprenants);

      chartsConfig.value.activite = {
        options: {
          ...chartsConfig.value.activite.options,
          xaxis: { categories: dates },
        },
        series: [
          { name: "Sessions", data: sessions },
          { name: "Apprenants Actifs", data: apprenants },
        ],
      };
    }

    // CHART 2: Questions par Type
    if (questionsStats.value?.parType) {
      console.log("📊 CHART 2 - Questions Data:", questionsStats.value.parType);
      const typeData = questionsStats.value.parType;
      chartsConfig.value.questionType = {
        options: chartsConfig.value.questionType.options,
        series: [
          typeData.QCM_SIMPLE?.nombre || 0,
          typeData.QCM_MULTIPLE?.nombre || 0,
          typeData.VRAI_FAUX?.nombre || 0,
          typeData.REPONSE_LIBRE?.nombre || 0,
        ],
      };
      console.log("✅ CHART 2 ready");
    }

    // CHART 3: Distribution des Scores
    if (performancesStats.value?.distributionScore) {
      console.log(
        "📊 CHART 3 - Performances Data:",
        performancesStats.value.distributionScore,
      );
      const ranges = performancesStats.value.distributionScore.map(
        (d: any) => d.range,
      );
      const counts = performancesStats.value.distributionScore.map(
        (d: any) => d.nombre || 0,
      );

      chartsConfig.value.scoreDistribution = {
        options: {
          ...chartsConfig.value.scoreDistribution.options,
          xaxis: { categories: ranges },
        },
        series: [{ name: "Nombre d'Apprenants", data: counts }],
      };
      console.log("✅ CHART 3 ready");
    }

    // CHART 4: Difficulté
    if (questionsStats.value?.parDifficulte) {
      console.log(
        "📊 CHART 4 - Difficulty Data:",
        questionsStats.value.parDifficulte,
      );
      const diffData = questionsStats.value.parDifficulte;
      chartsConfig.value.difficulty = {
        options: chartsConfig.value.difficulty.options,
        series: [
          {
            name: "Taux de Réussite",
            data: [
              Math.round((diffData.FACILE?.tauxReussite || 0) * 100),
              Math.round((diffData.MOYEN?.tauxReussite || 0) * 100),
              Math.round((diffData.DIFFICILE?.tauxReussite || 0) * 100),
            ],
          },
        ],
      };
      console.log("✅ CHART 4 ready");
    }

    // CHART 5: Comparaison Apprenants
    if (performancesStats.value?.parTypApprenant) {
      console.log(
        "📊 CHART 5 - Learner Comparison Data:",
        performancesStats.value.parTypApprenant,
      );
      const appData = performancesStats.value.parTypApprenant;
      chartsConfig.value.learnerComparison = {
        options: chartsConfig.value.learnerComparison.options,
        series: [
          {
            name: "FIE3",
            data: [
              appData.ETUDIANT_FIE3?.scoreMoyen || 0,
              appData.ETUDIANT_FIE3?.nombreApprenants || 0,
            ],
          },
          {
            name: "VAE",
            data: [
              appData.CANDIDAT_VAE?.scoreMoyen || 0,
              appData.CANDIDAT_VAE?.nombreApprenants || 0,
            ],
          },
        ],
      };
      console.log("✅ CHART 5 ready");
    }

    // CHART 6: Top Compétences
    if (competencesStats.value?.topCompetences) {
      console.log(
        "📊 CHART 6 - Top Competences Data:",
        competencesStats.value.topCompetences,
      );
      const top = competencesStats.value.topCompetences.slice(0, 5);
      const names = top.map((c: any) => c.nom);
      const scores = top.map((c: any) => Math.round(c.scoreMoyen || 0));

      chartsConfig.value.topCompetences = {
        options: {
          ...chartsConfig.value.topCompetences.options,
          xaxis: { categories: names },
        },
        series: [{ name: "Score Moyen", data: scores }],
      };
      console.log("✅ CHART 6 ready");
    }

    // CHART 7: Heatmap
    if (heatmapStats.value?.competenceParDifficulte) {
      console.log(
        "📊 CHART 7 - Heatmap Data:",
        heatmapStats.value.competenceParDifficulte,
      );
      const heatmapData = heatmapStats.value.competenceParDifficulte.map(
        (row: any) => ({
          name: row.competence,
          data: [
            Math.round((row.FACILE || 0) * 100),
            Math.round((row.MOYEN || 0) * 100),
            Math.round((row.DIFFICILE || 0) * 100),
          ],
        }),
      );

      chartsConfig.value.heatmap = {
        options: chartsConfig.value.heatmap.options,
        series: heatmapData,
      };
      console.log("✅ CHART 7 ready");
    }

    // CHART 8: Tendance Compétences
    if (
      competencesStats.value?.competencesTendances &&
      competencesStats.value.competencesTendances.length > 0
    ) {
      console.log(
        "📊 CHART 8 - Tendances Data:",
        competencesStats.value.competencesTendances,
      );
      const trendData = competencesStats.value.competencesTendances
        .slice(0, 3)
        .map((comp: any) => ({
          name: comp.nom,
          data: [
            comp.semaine1?.score || 0,
            comp.semaine2?.score || 0,
            comp.semaine3?.score || 0,
          ],
        }));

      chartsConfig.value.competenceTrend = {
        options: chartsConfig.value.competenceTrend.options,
        series: trendData,
      };
      console.log("✅ CHART 8 ready");
    }

    console.log("✅✅✅ ALL CHARTS INITIALIZED");
  } catch (err) {
    console.error("❌ Error in initializeCharts:", err);
  }
};

const refresh = async () => {
  await loadStatistics();
};

const breadcrumbs = [
  { title: "Admin", href: "/admin", disabled: false },
  { title: "Statistiques", disabled: true },
];

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.admin-statistics {
  padding: 0;
}
</style>
