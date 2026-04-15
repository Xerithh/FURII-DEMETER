<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { useHistoryStore, type HistoryEventType } from "@/stores/history";
import { useToastStore } from "@/stores/toast";
import { Award, Brain, Calendar, Check, Star } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const undrawSvgModules = import.meta.glob("/public/images/svg/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const undrawSvgPool = Object.keys(undrawSvgModules)
  .map((p) => p.split("/").pop())
  .filter(Boolean);

const undrawMap: Record<string, string> = {
  Session: "undraw_certificate.svg",
  "Validation de compétence": "undraw_problem_solving.svg",
  "Palier franchi": "undraw_awards.svg",
};

const historyStore = useHistoryStore();
const toastStore = useToastStore();
const router = useRouter();
const route = useRoute();
const { events, isLoading, isLoadingDetails, sessionDrawerDetail } =
  storeToRefs(historyStore);

const isDrawerOpen = ref(false);
const activeItem = ref<any>(null);

const eventTypeLabel: Record<HistoryEventType, string> = {
  SESSION: "Session",
  COMPETENCE_VALIDATION: "Validation de compétence",
  MILESTONE_REACHED: "Palier franchi",
};

const eventTypeIcon = (eventType: HistoryEventType, status?: string) => {
  if (eventType === "SESSION") return status === "COMPLETED" ? Check : Brain;
  if (eventType === "MILESTONE_REACHED") return Award;
  return Star;
};

const eventTypeColor = (eventType: HistoryEventType, status?: string) => {
  if (eventType === "SESSION")
    return status === "COMPLETED"
      ? { color: "text-green-600", bg: "bg-green-600" }
      : { color: "text-blue-600", bg: "bg-blue-600" };

  if (eventType === "MILESTONE_REACHED")
    return { color: "text-amber-600", bg: "bg-amber-600" };

  return { color: "text-indigo-600", bg: "bg-indigo-600" };
};

const historique = computed(() => {
  return events.value.map((event) => {
    const { color, bg } = eventTypeColor(event.eventType, event.status);
    return {
      id: event.id,
      date: historyStore.formatDateAbsolute(event.occurredAt),
      relativeDate: historyStore.formatDateRelative(event.occurredAt),
      preciseDate: historyStore.formatDatePrecise(event.occurredAt),
      type: eventTypeLabel[event.eventType],
      eventType: event.eventType,
      action: event.title,
      details: event.details,
      icon: eventTypeIcon(event.eventType, event.status),
      color,
      bg,
      note: event.score,
      status: event.status,
      sessionId: event.sessionId,
      competenceId: event.competenceId,
      competenceName: event.competenceName,
      competenceDescription: event.competenceDescription,
      levelBefore: event.levelBefore,
      levelAfter: event.levelAfter,
      progressPercentage:
        event.score !== undefined
          ? historyStore.scoreToPercent(event.score)
          : 0,
    };
  });
});

const fetchHistory = async () => {
  await historyStore.fetchHistory();
  if (historyStore.error) {
    toastStore.addToast({
      message: "Impossible de charger l'historique pour le moment.",
      type: "error",
    });
  }
};

const openAutoDetailsFromQuery = () => {
  const searchParam = route.query.search as string | undefined;
  const typeParam = route.query.type as string | undefined;

  if (!searchParam) return;

  // Chercher le premier élément correspondant
  const matchingItem = historique.value.find((item) => {
    const titleMatch = item.action
      .toLowerCase()
      .includes(searchParam.toLowerCase());
    const typeMatch =
      !typeParam || item.type.toLowerCase().includes(typeParam.toLowerCase());
    return titleMatch && typeMatch;
  });

  if (matchingItem) {
    openDrawer(matchingItem);
    recherche.value = searchParam;
    if (typeParam) {
      filtreType.value = matchingItem.type;
    }
  }
};

onMounted(() => {
  fetchHistory();
  // Ouvrir la modale automatiquement si des query params sont présents
  setTimeout(() => {
    openAutoDetailsFromQuery();
  }, 300);
});

const continueToModules = (item: any) => {
  closeDrawer();
  const q = item?.details || item?.action || "";
  router.push({ path: "/student/my-modules", query: { q } });
};

const openDrawer = async (item: any) => {
  activeItem.value = item;
  isDrawerOpen.value = true;

  if (item.eventType === "SESSION" && item.sessionId) {
    try {
      await historyStore.fetchSessionDrawerDetail(item.sessionId);
    } catch {
      toastStore.addToast({
        message: "Impossible de charger le détail de cette session.",
        type: "error",
      });
    }
    return;
  }

  historyStore.clearSessionDrawerDetail();
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  historyStore.clearSessionDrawerDetail();
  setTimeout(() => {
    activeItem.value = null;
  }, 200);
};

// Filtres et recherche
const recherche = ref("");
const filtreType = ref("Tous");
const filtreResultat = ref("Tous");

const types = computed(() => [
  "Tous",
  ...new Set(historique.value.map((item) => item.type).filter(Boolean)),
]);
const resultats = ["Tous", "Avec note", "Sans note"];

// Date du jour
const today = historyStore.formatDateAbsolute(new Date());

// Historique filtré
const historiqueFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return historique.value.filter((item) => {
    const matchRecherche =
      !terme ||
      item.action.toLowerCase().includes(terme) ||
      item.type.toLowerCase().includes(terme) ||
      item.details.toLowerCase().includes(terme) ||
      item.date.toLowerCase().includes(terme) ||
      item.relativeDate.toLowerCase().includes(terme) ||
      item.moduleScores?.some((m) => m.name.toLowerCase().includes(terme));

    const matchType =
      filtreType.value === "Tous" || item.type === filtreType.value;
    const matchResultat =
      filtreResultat.value === "Tous" ||
      (filtreResultat.value === "Avec note" && item.note !== undefined) ||
      (filtreResultat.value === "Sans note" && item.note === undefined);

    return matchRecherche && matchType && matchResultat;
  });
});

// Return a background utility class (e.g. 'bg-green-500') derived from item.color ('text-green-500')
const getBgClass = (item) => {
  if (!item) return "bg-white";
  if (item.bg) return item.bg;
  if (item.color && item.color.startsWith("text-"))
    return item.color.replace("text-", "bg-");
  return "bg-white";
};

const getModalBgClass = (item) => {
  if (!item) return "bg-white";
  return getBgClass(item);
};

// SVG path based on filtered items
const svgPath = computed(() => {
  const items = historiqueFiltres.value.length;
  if (items === 0) return "";
  const pathParts = [];
  pathParts.push("M 50 0");

  let lastX = 50;
  for (let i = 0; i < items; i++) {
    const cycle = i % 4;
    const yTarget = i * 160 + 80;

    let xTarget = 50;
    if (cycle === 1) xTarget = 15;
    else if (cycle === 3) xTarget = 85;

    if (i === 0) {
      pathParts.push(`L ${xTarget} ${yTarget}`);
    } else {
      const prevCycle = (i - 1) % 4;
      let xPrev = 50;
      if (prevCycle === 1) xPrev = 15;
      else if (prevCycle === 3) xPrev = 85;
      const yPrev = (i - 1) * 160 + 80;

      pathParts.push(
        `C ${xPrev} ${yPrev + 80}, ${xTarget} ${yTarget - 80}, ${xTarget} ${yTarget}`,
      );
    }
    lastX = xTarget;
  }

  const lastY = (items - 1) * 160 + 80;
  pathParts.push(`L ${lastX} ${lastY + 80}`);

  return pathParts.join(" ");
});

// Positions based on filtered items
const positions = computed(() => {
  return historiqueFiltres.value.map((_, i) => {
    const cycle = i % 4;
    let x = 50;
    if (cycle === 1) x = 15;
    if (cycle === 3) x = 85;
    const y = i * 160 + 80;
    return { x, y };
  });
});

const containerHeight = computed(() => {
  const items = historiqueFiltres.value.length;
  return Math.max(items * 160 + 160, 220);
});

const xToSide = (x) => {
  if (x <= 20) return "left";
  if (x >= 80) return "right";
  return "center";
};

const patternSvgMarkers = computed(() => {
  const markers = {};

  for (let i = 0; i < positions.value.length; i++) {
    const side = xToSide(positions.value[i].x);

    if (side === "left") {
      markers[i] = { side: "right", img: null };
    } else if (side === "right") {
      markers[i] = { side: "left", img: null };
    }
  }

  return markers;
});

// assign a random image per detected marker from all svg files in /public/images/svg
const assignRandomMarkers = computed(() => {
  const m = patternSvgMarkers.value;
  const out = {};

  const keys = Object.keys(m)
    .map((k) => Number(k))
    .sort((a, b) => a - b);
  let prev1 = null; // most recent pick
  let prev2 = null; // one before

  for (const idx of keys) {
    const entry = m[idx];
    if (!entry) continue;

    if (!undrawSvgPool || undrawSvgPool.length === 0) {
      out[idx] = { ...entry, img: null };
      prev1 = prev2 = null;
      continue;
    }

    let pick = null;
    if (undrawSvgPool.length === 1) {
      pick = undrawSvgPool[0];
    } else {
      // try random picks, avoid repeating prev1 or prev2
      let attempts = 0;
      do {
        pick = undrawSvgPool[Math.floor(Math.random() * undrawSvgPool.length)];
        attempts++;
      } while ((pick === prev1 || pick === prev2) && attempts < 20);

      // if still equal after attempts, pick a deterministic different one if possible
      if (pick === prev1 || pick === prev2) {
        pick = null;
        for (const p of undrawSvgPool) {
          if (p !== prev1 && p !== prev2) {
            pick = p;
            break;
          }
        }
        // fallback: if none found (pool too small), pick first non-equal to prev1
        if (!pick) {
          for (const p of undrawSvgPool) {
            if (p !== prev1) {
              pick = p;
              break;
            }
          }
        }
      }
    }

    out[idx] = { ...entry, img: pick };
    prev2 = prev1;
    prev1 = pick;
  }

  return out;
});

const getMarkerSrc = (index, item) => {
  const marker = assignRandomMarkers.value[index];
  if (marker && marker.img) return `/images/svg/${marker.img}`;
  return getUndrawForItem(item);
};

const getUndrawForItem = (item) => {
  const key = undrawMap[item.type] || "undraw_illustration.svg";
  return `/images/svg/${key}`;
};

// Responsive marker sizing and offset (desktop vs smaller screens)
const viewportWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1200,
);
let resizeHandler: (() => void) | null = null;

const _desktopMarkerSize = 200; // px (increased)
const _mobileMarkerSize = 90; // px (reduced)

const _desktopOffset = 700; // px (far away)
const _mobileOffset = 200; // px

onMounted(() => {
  resizeHandler = () => (viewportWidth.value = window.innerWidth);
  window.addEventListener("resize", resizeHandler);
});

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
});

const getMarkerStyle = (index) => {
  const marker =
    assignRandomMarkers.value[index] || patternSvgMarkers.value[index];
  let side =
    marker && marker.side
      ? marker.side
      : xToSide(positions.value[index]?.x || 50);

  const isDesktop = viewportWidth.value >= 1024;
  const size = isDesktop ? _desktopMarkerSize : _mobileMarkerSize;
  const offset = isDesktop ? _desktopOffset : _mobileOffset;

  const style = {
    width: size + "px",
    height: size + "px",
    maxWidth: "none",
    maxHeight: "none",
    display: "block",
    top: "50%",
    transform: "translateY(-50%)",
    position: "absolute",
    pointerEvents: "none",
    objectFit: "contain",
    zIndex: 999,
  };

  if (side === "left") {
    style.left = `-${offset}px`;
  } else {
    style.right = `-${offset}px`;
  }

  return style;
};
</script>
<template>
  <VRow v-if="isLoading">
    <VCol cols="12">
      <VCard>
        <VCardText>
          <VSkeletonLoader type="heading, text, actions" class="mb-4" />
          <VSkeletonLoader
            v-for="i in 5"
            :key="`history-skeleton-${i}`"
            type="list-item-avatar, list-item-two-line"
            class="mb-2"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <div v-else-if="historique && historique.length > 0">
    <VRow class="mb-6">
      <VCol cols="12" md="6" lg="5">
        <VTextField
          v-model="recherche"
          label="Rechercher une activité"
          placeholder="Ex: SQL, architecture, sécurité..."
          prepend-inner-icon="bx-search"
          clearable
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="3" lg="3">
        <VSelect
          v-model="filtreType"
          :items="types"
          label="Type"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="3" lg="3">
        <VSelect
          v-model="filtreResultat"
          :items="resultats"
          label="Résultats"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="font-sans scroll-smooth">
              <div class="max-w-md mx-auto py-12 px-4">
                <div class="text-center mb-10 flex flex-col items-center gap-6">
                  <div class="relative flex items-center justify-center">
                    <div
                      class="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center"
                    >
                      <div
                        class="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center relative overflow-hidden"
                      >
                        <Calendar
                          class="w-7 h-7 text-white transition-colors duration-300 relative z-10"
                        />
                        <div
                          class="absolute -top-1 -left-3 w-12 h-5 rounded-full bg-white/50 dark:bg-white/35 opacity-50 transform rotate-12 pointer-events-none blur-sm z-20"
                        ></div>
                        <div
                          class="absolute -bottom-1 -right-3 w-14 h-7 rounded-full bg-white/50 dark:bg-white/35 opacity-50 transform rotate-12 pointer-events-none blur-sm z-20"
                        ></div>
                      </div>
                    </div>

                    <div
                      class="uppercase absolute top-1/2 -translate-y-1/2 left-[calc(100vw/2+40px)] sm:left-[240px] text-xs font-bold text-slate-400 dark:text-slate-400 whitespace-nowrap hidden sm:block"
                    >
                      Aujourd'hui, {{ today }}
                    </div>
                  </div>
                </div>
                <div
                  class="relative w-full"
                  :style="{ height: containerHeight + 'px' }"
                >
                  <div class="absolute inset-0 pointer-events-none z-0">
                    <svg
                      class="w-full h-full text-slate-200 dark:text-slate-700"
                      preserveAspectRatio="none"
                      :viewBox="`0 0 100 ${containerHeight}`"
                      width="100%"
                    >
                      <path
                        :d="svgPath"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        vector-effect="non-scaling-stroke"
                        class="transition-all duration-1000"
                      />
                    </svg>
                  </div>

                  <div class="absolute inset-0 z-10">
                    <div
                      v-for="(item, index) in historiqueFiltres"
                      :key="item.id || index"
                    >
                      <button
                        @click="openDrawer(item)"
                        class="absolute w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center shadow-sm cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md hover:border-slate-300 transform-gpu group"
                        :class="[getBgClass(item)]"
                        :style="{
                          left: positions[index].x + '%',
                          top: positions[index].y + 'px',
                          transform: 'translate(-50%, -50%)',
                        }"
                      >
                        <component
                          :is="item.icon"
                          class="w-7 h-7 text-white transition-transform duration-200 transform-gpu group-hover:scale-110"
                        />

                        <div
                          class="uppercase absolute top-1/2 -translate-y-1/2 left-[calc(100vw/2+40px)] sm:left-[240px] text-xs font-bold text-slate-400 dark:text-slate-400 whitespace-nowrap hidden sm:block"
                        >
                          {{ item.date }}
                        </div>

                        <span
                          class="uppercase absolute -bottom-8 w-24 text-center text-[10px] text-slate-400 dark:text-slate-400 block sm:hidden font-bold"
                        >
                          {{ item.date }}
                        </span>

                        <img
                          v-if="
                            assignRandomMarkers[index] ||
                            patternSvgMarkers[index]
                          "
                          :src="getMarkerSrc(index, item)"
                          alt="illustration"
                          class="absolute opacity-100"
                          :style="getMarkerStyle(index)"
                        />
                        <div
                          class="absolute -top-1 -left-3 w-12 h-5 rounded-full bg-white/50 dark:bg-white/35 opacity-50 transform rotate-12 pointer-events-none blur-sm z-20"
                        ></div>
                        <div
                          class="absolute -bottom-1 -right-3 w-14 h-7 rounded-full bg-white/50 dark:bg-white/35 opacity-50 transform rotate-12 pointer-events-none blur-sm z-20"
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>

  <VRow v-else>
    <!-- EMPTY STATE -->
    <VCol cols="12">
      <VCard>
        <VCardText>
          <PageHeader
            icon="bx-history"
            title="Votre Historique"
            subtitle="Aucune session trouvée dans votre historique"
          />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex flex-column align-center text-center py-10">
          <p class="text-body-1 mb-6" style="max-width: 640px">
            Vous n'avez pas encore d'historique. Lancez une première évaluation
            pour commencer à suivre votre progression.
          </p>

          <img
            src="/images/undraw_waiting-for-you.svg"
            alt="Illustration historique vide"
            class="mb-6"
            style="max-width: 320px; width: 100%; height: auto"
          />

          <VBtn
            color="primary"
            size="large"
            prepend-icon="bx-play"
            to="/quiz-aleatoire"
          >
            Lancer une première évaluation
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Navigation Drawer positioned at page level for proper stacking context -->
  <VNavigationDrawer
    v-model="isDrawerOpen"
    location="right"
    temporary
    width="450"
    class="module-drawer bg-white border-l border-slate-200 history-drawer"
  >
    <div class="pa-5 d-flex flex-column h-100">
      <div class="d-flex align-center justify-space-between mb-6">
        <h2 class="text-h5 font-weight-bold module-title">
          {{ activeItem?.type || "Historique" }}
        </h2>
        <VBtn icon="bx-x" variant="text" size="small" @click="closeDrawer" />
      </div>

      <h3 class="text-h6 font-weight-bold mb-2">
        {{ activeItem?.action || "Détail de l'activité" }}
      </h3>
      <p class="text-body-2 text-medium-emphasis mb-6">
        {{ activeItem?.details || "Aucun détail disponible." }}
      </p>

      <div class="mb-6">
        <h4
          class="text-subtitle-2 font-weight-bold mb-2 text-uppercase letter-space-1"
        >
          Informations
        </h4>
        <div class="d-flex gap-4 flex-wrap">
          <VChip size="small" variant="outlined" color="primary">
            {{ activeItem?.type || "Historique" }}
          </VChip>
          <VChip size="small" variant="tonal" color="primary">
            {{ activeItem?.date || "-" }}
          </VChip>
          <VChip
            v-if="activeItem?.eventType === 'SESSION' && sessionDrawerDetail"
            size="small"
            variant="tonal"
            color="primary"
          >
            Score {{ sessionDrawerDetail.scorePercent }}%
          </VChip>
          <VChip
            v-if="activeItem?.eventType === 'SESSION' && sessionDrawerDetail"
            size="small"
            variant="tonal"
            color="primary"
          >
            Durée {{ sessionDrawerDetail.duration }}
          </VChip>
        </div>
      </div>

      <div class="flex-grow-1 overflow-y-auto">
        <div v-if="isLoadingDetails" class="d-flex justify-center my-4">
          <VProgressCircular indeterminate color="primary" size="24" />
        </div>

        <template
          v-else-if="activeItem?.eventType === 'SESSION' && sessionDrawerDetail"
        >
          <h4
            class="text-subtitle-2 font-weight-bold mb-3 text-uppercase letter-space-1"
          >
            Compétences Traitées ({{
              sessionDrawerDetail.treatedCompetences.length
            }})
          </h4>

          <div
            v-if="sessionDrawerDetail.treatedCompetences.length"
            class="d-flex gap-2 flex-wrap mb-5"
          >
            <VChip
              v-for="name in sessionDrawerDetail.treatedCompetences"
              :key="name"
              size="small"
              variant="outlined"
              color="primary"
            >
              {{ name }}
            </VChip>
          </div>

          <h4
            class="text-subtitle-2 font-weight-bold mb-3 text-uppercase letter-space-1"
          >
            Détails par compétence ({{
              sessionDrawerDetail.competences.length
            }})
          </h4>

          <div
            v-if="sessionDrawerDetail.competences.length > 0"
            class="d-flex flex-column gap-3"
          >
            <VCard
              v-for="(comp, idx) in sessionDrawerDetail.competences"
              :key="idx"
              variant="outlined"
              class="competence-list-item pa-4"
            >
              <div class="d-flex align-start justify-space-between mb-1 gap-2">
                <span class="font-weight-medium text-body-2 text-primary">
                  {{ comp.competenceName }}
                </span>
                <span class="text-caption font-weight-bold">
                  {{ comp.afterLabel }}
                </span>
              </div>
              <p class="text-caption text-medium-emphasis mb-1">
                Évolution : {{ comp.beforeLabel }} →
                {{ comp.afterLabel }}
              </p>
              <div class="text-caption text-disabled">
                Niveau : {{ comp.levelBefore ?? "N/A" }} →
                {{ comp.levelAfter ?? "N/A" }}
              </div>
            </VCard>
          </div>

          <p v-else class="text-body-2 text-medium-emphasis">
            Aucune compétence détaillée pour cette évaluation.
          </p>
        </template>

        <template
          v-else-if="
            activeItem?.eventType === 'MILESTONE_REACHED' ||
            activeItem?.eventType === 'COMPETENCE_VALIDATION'
          "
        >
          <h4
            class="text-subtitle-2 font-weight-bold mb-3 text-uppercase letter-space-1"
          >
            Détail du palier
          </h4>

          <VCard variant="outlined" class="competence-list-item pa-4 mb-4">
            <div class="d-flex align-start mb-1">
              <span class="font-weight-medium text-body-2 text-primary">
                {{ activeItem?.competenceName || activeItem?.action }}
              </span>
            </div>
            <p class="text-caption text-medium-emphasis mb-1">
              {{
                activeItem?.competenceDescription ||
                "Aucune description détaillée fournie."
              }}
            </p>
            <div class="text-caption text-disabled">
              Niveau : {{ activeItem?.levelBefore ?? "N/A" }} →
              {{ activeItem?.levelAfter ?? "N/A" }}
            </div>
          </VCard>

          <div class="text-body-2 text-medium-emphasis">
            Validé {{ activeItem?.relativeDate }} ({{
              activeItem?.preciseDate
            }})
          </div>
        </template>
      </div>

      <div class="mt-4 pt-4 border-top">
        <VBtn
          block
          color="primary"
          variant="flat"
          @click="continueToModules(activeItem)"
          append-icon="bx-right-arrow-alt"
        >
          Voir le module
        </VBtn>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<style scoped>
.animate-in {
  animation: modal-enter 0.2s ease-out forwards;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.continue-module-btn {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: none !important;
  text-transform: none !important;
}

.continue-module-btn:hover {
  background-color: #2563eb !important;
  color: #ffffff !important;
}

.module-title {
  color: rgb(var(--v-theme-on-surface));
}

.letter-space-1 {
  letter-spacing: 0.08em;
}

.border-top {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.competence-list-item {
  border-color: rgba(37, 99, 235, 0.2);
  background-color: rgba(37, 99, 235, 0.02);
}

.history-drawer {
  z-index: 3000 !important;
}
</style>
