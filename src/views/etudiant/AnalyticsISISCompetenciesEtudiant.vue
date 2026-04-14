<script setup lang="ts">
import { hexToRgb } from "@core/utils/colorConverter";
import { useDashboardStore } from "@/stores/dashboard";
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const dashboardStore = useDashboardStore();

// ─── Données dynamiques depuis le store ──────────────────────────────────────

const competenceLabels = computed(() => dashboardStore.competenceLabels);
const competenceScores = computed(() => dashboardStore.competenceScores);
const progressionPercent = computed(() => dashboardStore.progressionPercent);

// Niveau requis fixé à 60% (seuil pédagogique)
const SEUIL = 60;

const series = computed(() => [
  {
    name: "Votre niveau",
    data: competenceScores.value.length > 0 ? competenceScores.value : [0],
  },
  {
    name: "Minimum requis",
    data:
      competenceScores.value.length > 0
        ? Array(competenceScores.value.length).fill(SEUIL)
        : [SEUIL],
  },
]);

const categories = computed(() =>
  competenceLabels.value.length > 0 ? competenceLabels.value : ["—"],
);

// ─── Statistiques badge/modules ──────────────────────────────────────────────

const nbAcquis = computed(
  () =>
    dashboardStore.data?.competences?.filter((c) => c.niveau === "ACQUIS")
      .length ?? 0,
);

const balanceData = computed(() => [
  {
    icon: "bx-book-open",
    amount: `${dashboardStore.data?.competences?.length ?? 0} compétences`,
    label: "Total",
    color: "primary",
  },
  {
    icon: "bx-trophy",
    amount: `${nbAcquis.value} acquises`,
    label: "Validées",
    color: "success",
  },
]);

// ─── Options des graphiques (inchangé visuellement) ──────────────────────────

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const primaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["high-emphasis-opacity"]})`;
  const secondaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["medium-emphasis-opacity"]})`;
  const drawColor = "rgba(34,48,62,0.7)";

  return {
    radar: {
      chart: { height: 400, type: "radar", toolbar: { show: false } },
      colors: [
        `rgba(${hexToRgb(String(currentTheme.primary))}, 1)`,
        `rgba(${hexToRgb(String(currentTheme.warning))}, 1)`,
      ],
      stroke: { width: 2 },
      fill: { opacity: 0.15 },
      markers: { size: 0, hover: { size: 6 } },
      xaxis: {
        categories: categories.value,
        labels: {
          style: {
            colors: Array(categories.value.length).fill(drawColor),
            fontSize: "13px",
            fontFamily: "Public Sans",
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: { style: { colors: drawColor, fontSize: "12px" } },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "13px",
        fontFamily: "Public Sans",
        labels: { colors: drawColor },
        markers: { width: 11, height: 11, radius: 10 },
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: `rgba(${hexToRgb(String(variableTheme["border-color"]))},${variableTheme["border-opacity"]})`,
            connectorColors: `rgba(${hexToRgb(String(variableTheme["border-color"]))},${variableTheme["border-opacity"]})`,
          },
        },
      },
      responsive: [
        { breakpoint: 768, options: { xaxis: { labels: { show: false } } } },
      ],
    },
    radial: {
      chart: { sparkline: { enabled: true } },
      labels: ["Progression"],
      stroke: { dashArray: 5 },
      colors: [`rgba(${hexToRgb(String(currentTheme.primary))}, 1)`],
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          opacityTo: 0.5,
          opacityFrom: 1,
          shadeIntensity: 0.5,
          stops: [30, 70, 100],
          inverseColors: false,
          gradientToColors: [currentTheme.primary],
        },
      },
      plotOptions: {
        radialBar: {
          endAngle: 150,
          startAngle: -140,
          hollow: { size: "55%" },
          track: { background: "transparent" },
          dataLabels: {
            name: {
              offsetY: 25,
              fontWeight: 500,
              fontSize: "14px",
              color: secondaryTextColor,
              fontFamily: "Public Sans",
            },
            value: {
              offsetY: -15,
              fontWeight: 600,
              fontSize: "26px",
              color: primaryTextColor,
              fontFamily: "Public Sans",
              formatter: (val: number) => val + "%",
            },
          },
        },
      },
    },
  };
});

const moreList = [
  { title: "Exporter", value: "Export" },
  { title: "Actualiser", value: "Refresh" },
  { title: "Rapport Détaillé", value: "Details" },
];
</script>

<template>
  <VCard class="h-100 flex-grow-1 d-flex flex-column">
    <VRow no-gutters>
      <!-- Graphique Radar dynamique -->
      <VCol
        cols="12"
        sm="7"
        xl="8"
        :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
      >
        <VCardItem class="pb-0">
          <VCardTitle>Compétences ISIS</VCardTitle>
          <template #append>
            <MoreBtn :menu-list="moreList" />
          </template>
        </VCardItem>

        <VCardText class="pb-0">
          <div
            v-if="dashboardStore.isLoading"
            class="d-flex justify-center align-center py-16"
          >
            <VProgressCircular indeterminate color="primary" />
          </div>
          <VueApexCharts
            v-else
            type="radar"
            :height="400"
            :options="chartOptions.radar"
            :series="series"
          />
        </VCardText>
      </VCol>

      <!-- Graphique Radial progression dynamique -->
      <VCol cols="12" sm="5" xl="4">
        <VCardText class="text-center pt-10">
          <!-- Radial chart -->
          <div
            v-if="dashboardStore.isLoading"
            class="d-flex justify-center align-center py-8"
          >
            <VProgressCircular indeterminate color="primary" size="48" />
          </div>
          <template v-else>
            <VueApexCharts
              type="radialBar"
              :height="200"
              :options="chartOptions.radial"
              :series="[progressionPercent]"
            />
            <h6 class="text-h6 text-medium-emphasis mb-8 mt-1">
              {{ progressionPercent }}% Parcours Complété
            </h6>

            <div
              class="d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3"
            >
              <div
                v-for="data in balanceData"
                :key="data.label"
                class="d-flex align-center gap-2"
              >
                <VAvatar
                  :icon="data.icon"
                  :color="data.color"
                  size="38"
                  rounded
                  variant="tonal"
                />
                <div class="text-start">
                  <span class="text-sm">{{ data.label }}</span>
                  <h6 class="text-h6">{{ data.amount }}</h6>
                </div>
              </div>
            </div>
          </template>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
