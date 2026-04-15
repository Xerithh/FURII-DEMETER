<script setup lang="ts">
import { useDashboardStore } from "@/stores/dashboard";
import { hexToRgb } from "@core/utils/colorConverter";
import { computed } from "vue";
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const dashboardStore = useDashboardStore();

const competenceGroups = computed(() => {
  const competences = dashboardStore.data?.competences ?? [];
  const counts = {
    ACQUIS: 0,
    EN_COURS: 0,
    NON_DEMARRE: 0,
  } as Record<string, number>;

  for (const competence of competences) {
    const niveau = competence.niveau ?? "NON_DEMARRE";
    counts[niveau] = (counts[niveau] ?? 0) + 1;
  }

  return [
    {
      label: "Acquises",
      key: "ACQUIS",
      color: "success",
      value: counts.ACQUIS ?? 0,
    },
    {
      label: "En cours",
      key: "EN_COURS",
      color: "warning",
      value: counts.EN_COURS ?? 0,
    },
    {
      label: "Non démarrées",
      key: "NON_DEMARRE",
      color: "secondary",
      value: counts.NON_DEMARRE ?? 0,
    },
  ];
});

const totalCompetences = computed(
  () => dashboardStore.data?.competences?.length ?? 0,
);

const donutSeries = computed(() => {
  const values = competenceGroups.value.map((item) => item.value);
  const hasData = values.some((value) => value > 0);

  return hasData ? values : [1];
});

const donutLabels = computed(() => {
  const hasData = competenceGroups.value.some((item) => item.value > 0);
  return hasData
    ? competenceGroups.value.map((item) => item.label)
    : ["Aucune donnée"];
});

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const borderColor = `rgba(${hexToRgb(String(variableTheme["border-color"]))},${variableTheme["border-opacity"]})`;
  const labelColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["medium-emphasis-opacity"]})`;
  const hasData = competenceGroups.value.some((item) => item.value > 0);

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    labels: donutLabels.value,
    stroke: { width: 0 },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => `${Math.round(value)}%`,
    },
    legend: {
      show: false,
    },
    colors: hasData
      ? [currentTheme.success, currentTheme.warning, currentTheme.secondary]
      : [currentTheme["on-surface-variant"]],
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 18,
              color: labelColor,
              fontSize: "13px",
              fontFamily: "Public Sans",
            },
            value: {
              show: true,
              offsetY: -10,
              fontSize: "24px",
              fontWeight: 700,
              color: currentTheme["on-surface"],
              fontFamily: "Public Sans",
              formatter: (val: string) => `${Math.round(Number(val))}`,
            },
            total: {
              show: true,
              label: "Compétences",
              color: labelColor,
              fontSize: "13px",
              fontFamily: "Public Sans",
              formatter: () => `${totalCompetences.value}`,
            },
          },
        },
      },
    },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    grid: {
      borderColor,
      padding: {
        top: -12,
      },
    },
  };
});
</script>

<template>
  <VCard class="h-100 d-flex flex-column">
    <VCardItem>
      <VCardTitle>Répartition des Compétences</VCardTitle>
      <VCardSubtitle>{{ totalCompetences }} Compétences Total</VCardSubtitle>
    </VCardItem>

    <VCardText class="pt-2">
      <div
        v-if="dashboardStore.isLoading"
        class="d-flex justify-center align-center py-10"
      >
        <VProgressCircular indeterminate color="primary" />
      </div>

      <template v-else>
        <VueApexCharts
          type="donut"
          :height="260"
          :options="chartOptions"
          :series="donutSeries"
        />

        <div class="d-flex flex-wrap justify-center gap-3 mt-3">
          <div
            v-for="item in competenceGroups"
            :key="item.key"
            class="d-flex align-center gap-2"
          >
            <VAvatar :color="item.color" size="10" rounded />
            <span class="text-body-2">{{ item.label }}: {{ item.value }}</span>
          </div>
        </div>
      </template>
    </VCardText>
  </VCard>
</template>
