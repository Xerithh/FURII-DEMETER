<!-- src/@admin/pages/AdminStatistics.vue -->
<template>
  <div>
    <VBreadcrumbs :items="breadcrumbs" class="mb-4" />

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Statistiques Administrateur</h1>
      <VBtn
        color="primary"
        variant="tonal"
        prepend-icon="bx-refresh"
        @click="refresh"
        :loading="isLoadingAll"
      >
        Actualiser
      </VBtn>
    </div>

    <VProgressLinear v-if="isLoadingAll" indeterminate class="mb-6" />

    <!-- KPI Cards -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-start mb-4">
              <div>
                <p class="text-sm text-disabled mb-1">Sessions Totales</p>
                <h4 class="text-h4 font-weight-bold">{{ stats.totalSessions }}</h4>
              </div>
              <VAvatar color="primary" variant="tonal" rounded size="42">
                <VIcon icon="bx-play-circle" size="24" />
              </VAvatar>
            </div>
            <div class="d-flex align-center gap-1">
              <VIcon icon="bx-trending-up" color="success" size="18" />
              <span class="text-success text-xs font-weight-medium">
                {{ completionRate }}% complétées
              </span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-start mb-4">
              <div>
                <p class="text-sm text-disabled mb-1">Sessions Terminées</p>
                <h4 class="text-h4 font-weight-bold text-success">
                  {{ stats.sessionsTerminees }}
                </h4>
              </div>
              <VAvatar color="success" variant="tonal" rounded size="42">
                <VIcon icon="bx-check-circle" size="24" />
              </VAvatar>
            </div>
            <div class="d-flex align-center gap-1">
              <VChip color="success" size="x-small" variant="tonal">
                {{ completionRate }}%
              </VChip>
              <span class="text-xs text-disabled">du total</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-start mb-4">
              <div>
                <p class="text-sm text-disabled mb-1">Sessions Abandonnées</p>
                <h4 class="text-h4 font-weight-bold text-error">
                  {{ stats.sessionsAbandonnes }}
                </h4>
              </div>
              <VAvatar color="error" variant="tonal" rounded size="42">
                <VIcon icon="bx-x-circle" size="24" />
              </VAvatar>
            </div>
            <div class="d-flex align-center gap-1">
              <VChip color="error" size="x-small" variant="tonal">
                {{ abandonRate }}%
              </VChip>
              <span class="text-xs text-disabled">du total</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-start mb-4">
              <div>
                <p class="text-sm text-disabled mb-1">Score Moyen Global</p>
                <h4 class="text-h4 font-weight-bold text-warning">
                  {{ (stats.scoreParMoyenne * 100).toFixed(1) }}%
                </h4>
              </div>
              <VAvatar color="warning" variant="tonal" rounded size="42">
                <VIcon icon="bx-bar-chart" size="24" />
              </VAvatar>
            </div>
            <div class="d-flex align-center gap-1">
              <VProgressLinear
                :model-value="stats.scoreParMoyenne * 100"
                color="warning"
                height="6"
                rounded
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Activité + Questions Type -->
    <VRow class="mb-6">
      <VCol cols="12" md="8">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Activité Récente</VCardTitle>
            <VCardSubtitle>Sessions et apprenants sur 7 jours</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="area"
              :options="chartsConfig.activite.options"
              :series="chartsConfig.activite.series"
              height="260"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Questions par Type</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="donut"
              :options="chartsConfig.questionType.options"
              :series="chartsConfig.questionType.series"
              height="260"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Distribution scores + Difficulté -->
    <VRow class="mb-6">
      <VCol cols="12" md="6">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Distribution des Scores</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="bar"
              :options="chartsConfig.scoreDistribution.options"
              :series="chartsConfig.scoreDistribution.series"
              height="260"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Taux de Réussite par Difficulté</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="radar"
              :options="chartsConfig.difficulty.options"
              :series="chartsConfig.difficulty.series"
              height="260"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Comparaison FIE3 vs VAE + Top Compétences -->
    <VRow class="mb-6">
      <VCol cols="12" md="5">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Comparaison FIE3 vs VAE</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="radar"
              :options="chartsConfig.learnerComparison.options"
              :series="chartsConfig.learnerComparison.series"
              height="260"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="7">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Top 5 Compétences</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="bar"
              :options="chartsConfig.topCompetences.options"
              :series="chartsConfig.topCompetences.series"
              height="260"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Heatmap -->
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Heatmap : Compétences × Difficulté</VCardTitle>
        <VCardSubtitle>Taux de réussite par compétence et niveau</VCardSubtitle>
      </VCardItem>
      <VDivider />
      <VCardText>
        <apexchart
          type="heatmap"
          :options="chartsConfig.heatmap.options"
          :series="chartsConfig.heatmap.series"
          height="320"
        />
      </VCardText>
    </VCard>

  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/@admin/stores/admin'
import { computed, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts
const adminStore = useAdminStore()

const stats = ref({
  totalSessions: 0,
  sessionsTerminees: 0,
  sessionsAbandonnes: 0,
  dureeParMoyenne: 0,
  scoreParMoyenne: 0,
  sessionsParJour: [] as any[],
})

const activiteStats    = ref(null as any)
const questionsStats   = ref(null as any)
const performancesStats = ref(null as any)
const competencesStats = ref(null as any)
const heatmapStats     = ref(null as any)

const isLoadingAll = computed(() =>
  Object.values(adminStore.loading).some(v => v)
)

const completionRate = computed(() => {
  if (stats.value.totalSessions === 0) return 0
  return ((stats.value.sessionsTerminees / stats.value.totalSessions) * 100).toFixed(1)
})

const abandonRate = computed(() => {
  if (stats.value.totalSessions === 0) return 0
  return ((stats.value.sessionsAbandonnes / stats.value.totalSessions) * 100).toFixed(1)
})

const chartsConfig = ref({
  activite: {
    options: {
      chart: { type: 'area', toolbar: { show: false } },
      colors: ['#7367F0', '#28C76F'],
      stroke: { width: 2, curve: 'smooth' },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
      xaxis: { categories: [] as string[] },
      yaxis: [
        { title: { text: 'Sessions' } },
        { opposite: true, title: { text: 'Apprenants Actifs' } },
      ],
      legend: { position: 'top' },
      grid: { borderColor: 'rgba(0,0,0,0.05)' },
    },
    series: [] as any[],
  },
  questionType: {
    options: {
      labels: ['QCM Simple', 'QCM Multiple', 'Vrai/Faux', 'Réponse Libre'],
      colors: ['#7367F0', '#FF9F43', '#28C76F', '#FF4C51'],
      legend: { position: 'bottom' },
      plotOptions: { pie: { donut: { size: '65%' } } },
      dataLabels: { enabled: false },
    },
    series: [] as number[],
  },
  difficulty: {
    options: {
      chart: { type: 'radar', toolbar: { show: false } },
      colors: ['#7367F0'],
      xaxis: { categories: ['Facile', 'Moyen', 'Difficile'] },
      yaxis: { max: 100 },
      fill: { opacity: 0.2 },
      markers: { size: 4 },
    },
    series: [] as any[],
  },
  scoreDistribution: {
    options: {
      chart: { type: 'bar', toolbar: { show: false } },
      colors: ['#7367F0'],
      plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
      xaxis: { categories: [] as string[] },
      dataLabels: { enabled: false },
      grid: { borderColor: 'rgba(0,0,0,0.05)' },
    },
    series: [] as any[],
  },
  learnerComparison: {
    options: {
      chart: { type: 'radar', toolbar: { show: false } },
      colors: ['#7367F0', '#FF9F43'],
      xaxis: { categories: ['Score Moyen', 'Apprenants'] },
      fill: { opacity: 0.2 },
      markers: { size: 4 },
      legend: { position: 'bottom' },
    },
    series: [] as any[],
  },
  topCompetences: {
    options: {
      chart: { type: 'bar', toolbar: { show: false } },
      colors: ['#28C76F'],
      plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
      xaxis: { categories: [] as string[] },
      dataLabels: { enabled: true },
      grid: { borderColor: 'rgba(0,0,0,0.05)' },
    },
    series: [] as any[],
  },
  heatmap: {
    options: {
      chart: { type: 'heatmap', toolbar: { show: false } },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0,  to: 30,  name: 'Faible', color: '#FF4C51' },
              { from: 30, to: 60,  name: 'Moyen',  color: '#FF9F43' },
              { from: 60, to: 100, name: 'Bon',    color: '#28C76F' },
            ],
          },
        },
      },
      xaxis: { categories: ['Facile', 'Moyen', 'Difficile'] },
      dataLabels: { enabled: true },
    },
    series: [] as any[],
  },
  competenceTrend: {
    options: {
      chart: { type: 'line', toolbar: { show: false } },
      colors: ['#7367F0', '#FF9F43', '#28C76F'],
      stroke: { width: 2, curve: 'smooth' },
      xaxis: { categories: ['Semaine 1', 'Semaine 2', 'Semaine 3'] },
      markers: { size: 4 },
      legend: { position: 'top' },
      grid: { borderColor: 'rgba(0,0,0,0.05)' },
    },
    series: [] as any[],
  },
})

const loadStatistics = async () => {
  try {
    const [sessionStats, activite, questions, performances, competences, heatmap] =
      await Promise.all([
        adminStore.fetchSessionStatistics(),
        adminStore.fetchActiviteStats('7j'),
        adminStore.fetchQuestionsStats(),
        adminStore.fetchPerformancesStats(),
        adminStore.fetchCompetencesStats(),
        adminStore.fetchHeatmapStats(),
      ])

    if (sessionStats)   stats.value           = sessionStats
    if (activite)       activiteStats.value    = activite
    if (questions)      questionsStats.value   = questions
    if (performances)   performancesStats.value = performances
    if (competences)    competencesStats.value  = competences
    if (heatmap)        heatmapStats.value      = heatmap

    initializeCharts()
  } catch (err) {
    console.error('Error loading statistics:', err)
  }
}

const initializeCharts = () => {
  // Chart 1: Activité
  if (activiteStats.value?.sessionsParJour) {
    const dates     = activiteStats.value.sessionsParJour.map((d: any) =>
      new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
    )
    const sessions  = activiteStats.value.sessionsParJour.map((d: any) => d.nombre)
    const apprenants = (activiteStats.value.apprenantsActifs || []).map((d: any) => d?.nombre || 0)
    chartsConfig.value.activite = {
      options: { ...chartsConfig.value.activite.options, xaxis: { categories: dates } },
      series: [
        { name: 'Sessions', data: sessions },
        { name: 'Apprenants Actifs', data: apprenants },
      ],
    }
  }

  // Chart 2: Questions par type
  if (questionsStats.value?.parType) {
    const t = questionsStats.value.parType
    chartsConfig.value.questionType = {
      options: chartsConfig.value.questionType.options,
      series: [
        t.QCM_SIMPLE?.nombre    || 0,
        t.QCM_MULTIPLE?.nombre  || 0,
        t.VRAI_FAUX?.nombre     || 0,
        t.REPONSE_LIBRE?.nombre || 0,
      ],
    }
  }

  // Chart 3: Distribution scores
  if (performancesStats.value?.distributionScore) {
    const ranges = performancesStats.value.distributionScore.map((d: any) => d.range)
    const counts = performancesStats.value.distributionScore.map((d: any) => d.nombre || 0)
    chartsConfig.value.scoreDistribution = {
      options: { ...chartsConfig.value.scoreDistribution.options, xaxis: { categories: ranges } },
      series: [{ name: "Apprenants", data: counts }],
    }
  }

  // Chart 4: Difficulté
  if (questionsStats.value?.parDifficulte) {
    const d = questionsStats.value.parDifficulte
    chartsConfig.value.difficulty = {
      options: chartsConfig.value.difficulty.options,
      series: [{
        name: 'Taux de Réussite',
        data: [
          Math.round((d.FACILE?.tauxReussite    || 0) * 100),
          Math.round((d.MOYEN?.tauxReussite     || 0) * 100),
          Math.round((d.DIFFICILE?.tauxReussite || 0) * 100),
        ],
      }],
    }
  }

  // Chart 5: Comparaison
  if (performancesStats.value?.parTypApprenant) {
    const a = performancesStats.value.parTypApprenant
    chartsConfig.value.learnerComparison = {
      options: chartsConfig.value.learnerComparison.options,
      series: [
        { name: 'FIE3', data: [a.ETUDIANT_FIE3?.scoreMoyen || 0, a.ETUDIANT_FIE3?.nombreApprenants || 0] },
        { name: 'VAE',  data: [a.CANDIDAT_VAE?.scoreMoyen  || 0, a.CANDIDAT_VAE?.nombreApprenants  || 0] },
      ],
    }
  }

  // Chart 6: Top compétences
  if (competencesStats.value?.topCompetences) {
    const top   = competencesStats.value.topCompetences.slice(0, 5)
    const names = top.map((c: any) => c.nom)
    const scores = top.map((c: any) => Math.round(c.scoreMoyen || 0))
    chartsConfig.value.topCompetences = {
      options: { ...chartsConfig.value.topCompetences.options, xaxis: { categories: names } },
      series: [{ name: 'Score Moyen', data: scores }],
    }
  }

  // Chart 7: Heatmap
  if (heatmapStats.value?.competenceParDifficulte) {
    const heatmapData = heatmapStats.value.competenceParDifficulte.map((row: any) => ({
      name: row.competence,
      data: [
        Math.round((row.FACILE    || 0) * 100),
        Math.round((row.MOYEN     || 0) * 100),
        Math.round((row.DIFFICILE || 0) * 100),
      ],
    }))
    chartsConfig.value.heatmap = {
      options: chartsConfig.value.heatmap.options,
      series: heatmapData,
    }
  }

  // Chart 8: Tendances
  if (competencesStats.value?.competencesTendances?.length > 0) {
    const trendData = competencesStats.value.competencesTendances.slice(0, 3).map((comp: any) => ({
      name: comp.nom,
      data: [comp.semaine1?.score || 0, comp.semaine2?.score || 0, comp.semaine3?.score || 0],
    }))
    chartsConfig.value.competenceTrend = {
      options: chartsConfig.value.competenceTrend.options,
      series: trendData,
    }
  }
}

const refresh = async () => { await loadStatistics() }

const breadcrumbs = [
  { title: 'Admin', href: '/admin', disabled: false },
  { title: 'Statistiques', disabled: true },
]

onMounted(() => { loadStatistics() })
</script>
