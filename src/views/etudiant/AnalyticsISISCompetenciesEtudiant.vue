<script setup lang="ts">
import { useDashboardStore } from "@/stores/dashboard";
import { hexToRgb } from "@core/utils/colorConverter";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const dashboardStore = useDashboardStore();
const router = useRouter();

// ─── Données dynamiques depuis le store ──────────────────────────────────────

const progressionPercent = computed(() => {
  const scores =
    dashboardStore.data?.competences?.map((competence) => competence.score) ??
    [];

  if (!scores.length) return 0;

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(Math.max(0, Math.min(100, average)));
});

const normalizeLevel = (
  competence: any,
): "ACQUIS" | "EN_COURS" | "NON_DEMARRE" => {
  const rawLevel = competence?.niveau ?? competence?.niveauAtteint;

  if (typeof rawLevel === "number") {
    if (rawLevel >= 2) return "ACQUIS";
    if (rawLevel === 1) return "EN_COURS";

    return "NON_DEMARRE";
  }

  const normalized = String(rawLevel || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  if (normalized === "ACQUIS" || normalized === "ACQUIRED") return "ACQUIS";
  if (
    normalized === "EN_COURS" ||
    normalized === "EN-COURS" ||
    normalized === "IN_PROGRESS" ||
    normalized === "A_RENFORCER"
  ) {
    return "EN_COURS";
  }

  return "NON_DEMARRE";
};

const criticalAndLearningCompetences = computed(() => {
  const competences = dashboardStore.data?.competences ?? [];

  return competences
    .map((c) => {
      const level = normalizeLevel(c);
      return { ...c, _normalizedLevel: level };
    })
    .filter(
      (c) =>
        c._normalizedLevel === "EN_COURS" ||
        c._normalizedLevel === "NON_DEMARRE",
    )
    .map((c) => ({
      nom: c.nom,
      score: Number((c.score ?? 0).toFixed(1)),
      lacunes: c.lacunes ?? (c as any).description,
      niveau: c._normalizedLevel,
      severity:
        c._normalizedLevel === "NON_DEMARRE" || c.score < 40
          ? "Critique"
          : "En apprentissage",
      color:
        c._normalizedLevel === "NON_DEMARRE" || c.score < 40
          ? "error"
          : "warning",
      icon:
        c._normalizedLevel === "NON_DEMARRE" || c.score < 40
          ? "bx-error-circle"
          : "bx-time-five",
    }))
    .sort((a, b) => a.score - b.score);
});

const goToModulesForCompetence = (competenceName: string) => {
  router.push({ path: "/student/my-modules", query: { q: competenceName } });
};

// ─── Statistiques badge/modules ──────────────────────────────────────────────

const nbAcquis = computed(
  () =>
    dashboardStore.data?.competences?.filter(
      (c) => normalizeLevel(c) === "ACQUIS",
    ).length ?? 0,
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
          track: {
            background: `rgba(${hexToRgb(String(currentTheme["on-surface"]))}, 0.04)`,
          },
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
</script>

<template>
  <VCard class="h-100 flex-grow-1 d-flex flex-column">
    <VRow no-gutters>
      <!-- Liste compétences critiques / en apprentissage -->
      <VCol
        cols="12"
        sm="7"
        xl="8"
        :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
      >
        <VCardItem class="pb-0">
          <VCardTitle>Référentiel ISIS</VCardTitle>
        </VCardItem>

        <VCardText class="pb-4">
          <div
            v-if="dashboardStore.isLoading"
            class="d-flex justify-center align-center py-16"
          >
            <VProgressCircular indeterminate color="primary" />
          </div>

          <template v-else-if="criticalAndLearningCompetences.length">
            <div class="scrollable-list">
              <VList class="card-list">
                <VListItem
                  v-for="item in criticalAndLearningCompetences"
                  :key="item.nom"
                  class="cursor-pointer"
                  @click="goToModulesForCompetence(item.nom)"
                >
                  <template #prepend>
                    <VAvatar
                      rounded
                      variant="tonal"
                      :color="item.color"
                      :icon="item.icon"
                      size="40"
                    />
                  </template>

                  <VListItemTitle>{{ item.nom }}</VListItemTitle>
                  <VListItemSubtitle>
                    {{ item.severity }}
                  </VListItemSubtitle>

                  <template #append>
                    <VListItemAction>
                      <VChip :color="item.color" size="small" variant="tonal">
                        {{ item.score }}
                      </VChip>
                    </VListItemAction>
                  </template>
                </VListItem>
              </VList>
            </div>
          </template>

          <VAlert v-else type="success" variant="tonal" class="mt-4">
            Aucune compétence critique ou en apprentissage. Excellent travail.
          </VAlert>
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

<style lang="scss" scoped>
@use "@core/scss/template/libs/apex-chart.scss";

.scrollable-list {
  max-height: 360px;
  overflow-y: auto;
  margin-top: 1.25rem;
}

.card-list {
  --v-card-list-gap: 1.5rem;
}

.cursor-pointer {
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(var(--v-theme-primary-rgb), 0.05);
  }
}
</style>
