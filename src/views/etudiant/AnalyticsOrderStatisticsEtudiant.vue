<script setup lang="ts">
import { dashboardService } from "@/services/dashboardService";
import { useDashboardStore } from "@/stores/dashboard";
import { hexToRgb } from "@core/utils/colorConverter";
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const dashboardStore = useDashboardStore();

type SessionProgressPoint = {
  id: number;
  date: string;
  score: number;
};

const sessionProgress = ref<SessionProgressPoint[]>([]);
const timelineLoading = ref(false);
const timelineError = ref<string | null>(null);

const timelineSeries = computed(() => [
  {
    name: "Score global",
    data: sessionProgress.value.map((point) => ({
      x: new Date(point.date).getTime(),
      y: Number(point.score.toFixed(2)),
    })),
  },
]);

const completedSessionsCount = computed(() => sessionProgress.value.length);

const latestScore = computed(() => {
  if (!sessionProgress.value.length) return null;

  const last = sessionProgress.value[sessionProgress.value.length - 1];
  return Number(last.score.toFixed(2));
});

const formatSessionDate = (isoDate?: string) => {
  if (!isoDate) return "Date inconnue";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "Date inconnue";

  return parsed.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const loadSessionTimeline = async () => {
  if (timelineLoading.value) return;

  timelineLoading.value = true;
  timelineError.value = null;

  try {
    const sessions = await dashboardService.getSessions();

    const detailResponses = await Promise.all(
      sessions.map(async (session) => {
        try {
          const details = await dashboardService.getSessionDetails(session.id);

          return {
            id: session.id,
            date:
              details.dateFin ||
              details.dateDebut ||
              session.dateFin ||
              session.dateDebut,
            score: Number(details.scoreGlobal ?? 0),
          } as SessionProgressPoint;
        } catch {
          return null;
        }
      }),
    );

    sessionProgress.value = detailResponses
      .filter((item): item is SessionProgressPoint => !!item)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch {
    timelineError.value =
      "Impossible de charger la progression des sessions pour le moment.";
  } finally {
    timelineLoading.value = false;
  }
};

onMounted(() => {
  void loadSessionTimeline();
});

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const secondaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["medium-emphasis-opacity"]})`;
  const primaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["high-emphasis-opacity"]})`;

  return {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 4,
      hover: { size: 6 },
    },
    legend: { show: false },
    tooltip: {
      x: {
        formatter: (
          _: unknown,
          { dataPointIndex }: { dataPointIndex: number },
        ) => {
          const point = sessionProgress.value[dataPointIndex];
          return point ? formatSessionDate(point.date) : "Session";
        },
      },
      y: {
        formatter: (val: number) => `${val.toFixed(2)}`,
      },
    },
    dataLabels: { enabled: false },
    colors: [currentTheme.primary],
    grid: {
      borderColor: `rgba(${hexToRgb(String(currentTheme["on-surface"]))},0.08)`,
      strokeDashArray: 4,
      padding: { top: 4, right: 8, left: 4, bottom: 0 },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: secondaryTextColor,
          fontSize: "12px",
          fontFamily: "Public Sans",
        },
        datetimeFormatter: {
          month: "MMM yy",
          day: "dd MMM",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value: number) => value.toFixed(1),
        style: {
          colors: secondaryTextColor,
          fontSize: "12px",
          fontFamily: "Public Sans",
        },
      },
      title: {
        text: "Score",
        style: {
          color: primaryTextColor,
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: "Public Sans",
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.03,
        stops: [0, 90, 100],
      },
    },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
  };
});
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Progression par session</VCardTitle>
      <VCardSubtitle>
        Évolution de la note globale en fonction du temps
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <div
        v-if="dashboardStore.isLoading || timelineLoading"
        class="d-flex justify-center py-8"
      >
        <VProgressCircular indeterminate color="primary" />
      </div>

      <VAlert
        v-else-if="timelineError"
        type="warning"
        variant="tonal"
        class="mb-2"
      >
        {{ timelineError }}
      </VAlert>

      <template v-else-if="completedSessionsCount > 0">
        <div
          class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3"
        >
          <div class="metric-pill">
            <div class="text-caption text-medium-emphasis">Sessions</div>
            <div class="text-h6 font-weight-bold">
              {{ completedSessionsCount }}
            </div>
          </div>
          <div class="metric-pill">
            <div class="text-caption text-medium-emphasis">Dernière note</div>
            <div class="text-h6 font-weight-bold">{{ latestScore ?? "-" }}</div>
          </div>
        </div>

        <div class="chart-shell">
          <VueApexCharts
            type="line"
            :height="280"
            width="100%"
            :options="chartOptions"
            :series="timelineSeries"
          />
        </div>
      </template>

      <VAlert v-else type="info" variant="tonal" class="mb-2">
        Pas encore assez de sessions pour afficher une progression temporelle.
      </VAlert>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.chart-shell {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px;
  padding: 0.5rem 0.25rem;
}

.metric-pill {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
}
</style>
