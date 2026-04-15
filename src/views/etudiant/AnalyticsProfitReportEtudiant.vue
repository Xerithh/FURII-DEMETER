<script setup lang="ts">
import { useDashboardStore } from "@/stores/dashboard";
import { hexToRgb } from "@core/utils/colorConverter";
import { useDisplay, useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const display = useDisplay();
const dashboardStore = useDashboardStore();

const scoreMoyen = computed(
  () => dashboardStore.data?.scores?.scoreMoyenGlobal ?? 0,
);
const evolution = computed(
  () => dashboardStore.data?.scores?.evolutionScore ?? "",
);
const evolutionNumeric = computed(() => {
  const match = evolution.value.match(/-?\d+/);
  return match ? parseInt(match[0], 10) : 0;
});
const evolutionColor = computed(() => {
  if (evolutionNumeric.value >= 0) return "success";
  if (evolutionNumeric.value <= -20) return "error";
  return "warning";
});
const formattedEvolution = computed(() => {
  const val = evolution.value.replace("+", "");
  return val || "—";
});

// Courbe composite des 6 dernières sessions (on utilise sessionsTerminees comme proxy)
// NOTE Swagger: pas de série temporelle exposée → on affiche un seul point dynamique
const series = computed(() => [{ data: [scoreMoyen.value] }]);

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 12,
        blur: 4,
        left: 0,
        enabled: true,
        opacity: 0.12,
        color: currentTheme.warning,
      },
    },
    tooltip: { enabled: false },
    colors: [`rgba(${hexToRgb(String(currentTheme.warning))}, 1)`],
    stroke: { width: 4, curve: "smooth", lineCap: "round" },
    grid: { show: false, padding: { top: -21, left: -5, bottom: -8 } },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { labels: { show: false } },
    responsive: [
      {
        breakpoint: display.thresholds.value.lg,
        options: { chart: { height: 151, width: "100%" } },
      },
      {
        breakpoint: display.thresholds.value.md,
        options: { chart: { height: 131, width: "100%" } },
      },
    ],
  };
});
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between h-100">
      <div class="d-flex flex-column justify-space-between gap-y-4">
        <div>
          <h5 class="text-h5 mb-1">Rapport d'évaluation</h5>
          <VChip color="warning" size="small">
            {{ dashboardStore.data?.utilisateur ? "Année universitaire" : "—" }}
          </VChip>
        </div>

        <div v-if="dashboardStore.isLoading">
          <VSkeletonLoader type="text" />
        </div>
        <div v-else>
          <div
            class="d-flex gap-1 align-center"
            :class="`text-${evolutionColor}`"
          >
            <VIcon
              :icon="
                evolutionNumeric >= 0 ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'
              "
              size="20"
            />
            <span class="text-base d-inline-block">{{
              formattedEvolution
            }}</span>
          </div>
          <h4 class="text-h4">{{ scoreMoyen.toFixed(1) }}/20 Moyenne</h4>
        </div>
      </div>

      <div class="h-100 d-flex align-center">
        <VueApexCharts
          type="line"
          :height="131"
          width="80%"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </VCardText>
  </VCard>
</template>
