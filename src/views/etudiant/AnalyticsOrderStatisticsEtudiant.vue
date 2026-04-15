<script setup lang="ts">
import { useDashboardStore } from "@/stores/dashboard";
import { hexToRgb } from "@core/utils/colorConverter";
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const dashboardStore = useDashboardStore();

// Segment compétences par niveau
const countByNiveau = computed(() => {
  const competences = dashboardStore.data?.competences ?? [];
  return {
    acquis: competences.filter((c) => c.niveau === "ACQUIS").length,
    enCours: competences.filter((c) => c.niveau === "EN_COURS").length,
    nonDemarre: competences.filter((c) => c.niveau === "NON_DEMARRE").length,
    total: competences.length,
  };
});

const series = computed(() => [
  countByNiveau.value.acquis,
  countByNiveau.value.enCours,
  countByNiveau.value.nonDemarre,
]);

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const secondaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["medium-emphasis-opacity"]})`;
  const primaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["high-emphasis-opacity"]})`;

  return {
    chart: { sparkline: { enabled: true }, animations: { enabled: false } },
    stroke: { width: 6, colors: [currentTheme.surface] },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ["Acquises", "En Cours", "Non démarrées"],
    colors: [currentTheme.success, currentTheme.primary, currentTheme.warning],
    grid: { padding: { top: -7, bottom: 5 } },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: "13px",
              color: secondaryTextColor,
              fontFamily: "Public Sans",
            },
            value: {
              offsetY: -17,
              fontSize: "18px",
              color: primaryTextColor,
              fontFamily: "Public Sans",
              fontWeight: 500,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              formatter: () => String(countByNiveau.value.total),
              color: secondaryTextColor,
              fontFamily: "Public Sans",
            },
          },
        },
      },
    },
  };
});

const orders = computed(() => [
  {
    amount: String(countByNiveau.value.acquis),
    title: "Compétences Acquises",
    avatarColor: "success",
    subtitle: "Validées avec succès",
    avatarIcon: "bx-check-circle",
  },
  {
    amount: String(countByNiveau.value.enCours),
    title: "En Cours",
    avatarColor: "primary",
    subtitle: "Apprentissage actif",
    avatarIcon: "bx-book-open",
  },
  {
    amount: String(countByNiveau.value.nonDemarre),
    title: "Non Démarrées",
    avatarColor: "warning",
    subtitle: "À découvrir",
    avatarIcon: "bx-bulb",
  },
]);
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Répartition des Compétences</VCardTitle>
      <VCardSubtitle>{{ countByNiveau.total }} Compétences Total</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <div v-if="dashboardStore.isLoading" class="d-flex justify-center py-8">
        <VProgressCircular indeterminate color="primary" />
      </div>
      <template v-else>
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h3 class="text-h3 mb-1">{{ countByNiveau.total }}</h3>
            <div class="text-caption text-medium-emphasis">
              Total Compétences
            </div>
          </div>
          <VueApexCharts
            type="donut"
            :height="120"
            width="100"
            :options="chartOptions"
            :series="series"
          />
        </div>

        <VList class="card-list">
          <VListItem v-for="order in orders" :key="order.title">
            <template #prepend>
              <VAvatar
                size="40"
                rounded
                variant="tonal"
                :color="order.avatarColor"
              >
                <VIcon :icon="order.avatarIcon" />
              </VAvatar>
            </template>
            <VListItemTitle class="font-weight-medium">{{
              order.title
            }}</VListItemTitle>
            <VListItemSubtitle class="text-body-2">{{
              order.subtitle
            }}</VListItemSubtitle>
            <template #append>
              <span>{{ order.amount }}</span>
            </template>
          </VListItem>
        </VList>
      </template>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
