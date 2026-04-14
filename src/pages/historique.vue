<script setup lang="ts">
import {
  Award,
  Book,
  Brain,
  Calendar,
  Award as Certification,
  Check,
  Code,
  PlayCircle,
  Star,
  X,
} from "lucide-vue-next";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { dashboardService } from "@/services/dashboardService";

const undrawSvgModules = import.meta.glob("/public/images/svg/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const undrawSvgPool = Object.keys(undrawSvgModules)
  .map((p) => p.split("/").pop())
  .filter(Boolean);

const undrawMap: Record<string, string> = {
  Évaluation: "undraw_certificate.svg",
  Module: "undraw_online_learning.svg",
  Projet: "undraw_project.svg",
  Badge: "undraw_awards.svg",
  Quiz: "undraw_quiz.svg",
  Compétence: "undraw_problem_solving.svg",
  Certificat: "undraw_certificate.svg",
};

const historique = ref<any[]>([]);

const isDrawerOpen = ref(false);
const activeItem = ref<any>(null);
const isLoading = ref(true);
const isLoadingDetails = ref(false);
const detailsData = ref<any>(null);

const router = useRouter();

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const data = await dashboardService.getSessions();
    historique.value = data.map((session: any) => {
      // Map API to Historique format
      return {
        id: session.id,
        date: new Date(session.dateDebut).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        type: "Évaluation",
        action: `Session #${session.numeroSession || session.id}`,
        details:
          session.statut === "COMPLETED"
            ? "Session terminée"
            : "Session en cours",
        icon: session.statut === "COMPLETED" ? Check : Brain,
        color:
          session.statut === "COMPLETED" ? "text-green-600" : "text-blue-600",
        bg: session.statut === "COMPLETED" ? "bg-green-600" : "bg-blue-600",
        // Default properties that will be fetched dynamically
        note: undefined,
        progressPercentage: session.statut === "COMPLETED" ? 100 : 50,
      };
    });
  } catch (err) {
    console.error("Failed to load history sessions", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHistory();
});

const continueToModules = (item: any) => {
  closeDrawer();
  const q = item?.details || item?.action || "";
  router.push({ path: "/student/my-modules", query: { q } });
};

const openDrawer = async (item: any) => {
  activeItem.value = item;
  isDrawerOpen.value = true;
  isLoadingDetails.value = true;
  detailsData.value = null;

  try {
    const details = await dashboardService.getSessionDetails(item.id);
    const recs = await dashboardService.getSessionRecommendations(item.id);

    // Provide the details to our active binding
    detailsData.value = {
      scoreGlobal: details.scoreGlobal,
      moduleScores: details.competencesEvaluees?.map((c: any) => ({
        name: c.nomCompetence || "Compétence",
        percentage: Math.round((c.score || 0) * 100),
        color: "bg-blue-600",
      })),
      aiInsight: recs?.map((r: any) => r.texte).join("\n\n") || "",
    };
  } catch (err) {
    console.error("Failed to load side drawer details", err);
  } finally {
    isLoadingDetails.value = false;
  }
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  setTimeout(() => {
    activeItem.value = null;
    detailsData.value = null;
  }, 200);
};

// Filtres et recherche
const recherche = ref("");
const filtreType = ref("Tous");
const filtreResultat = ref("Tous");

const types = computed(() => [
  "Tous",
  ...new Set(historique.value.map((item) => item.type)),
]);
const resultats = ["Tous", "Avec note", "Sans note"];

// Date du jour
const today = new Date().toLocaleDateString("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

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
  <div v-if="historique && historique.length > 0">
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

              <VNavigationDrawer
                v-model="isDrawerOpen"
                location="right"
                temporary
                width="450"
                class="module-drawer bg-white border-l border-slate-200"
              >
                <div class="h-full flex flex-col text-slate-800">
                  <div class="p-6 pb-2 relative shrink-0">
                    <button
                      @click="closeDrawer"
                      class="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <X class="w-5 h-5 text-slate-500" />
                    </button>

                    <template v-if="activeItem">
                      <div class="flex items-center gap-4 mb-4 mt-2">
                        <div
                          class="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white"
                          :class="activeItem.bg"
                        >
                          <component :is="activeItem.icon" class="w-7 h-7" />
                        </div>
                        <div>
                          <div
                            class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
                          >
                            {{ activeItem.type }}
                          </div>
                          <h3 class="text-xl font-bold leading-tight">
                            {{ activeItem.action }}
                          </h3>
                          <p class="text-sm text-slate-500 mt-1">
                            {{ activeItem.date }}
                          </p>
                        </div>
                      </div>
                      <p
                        class="text-slate-700 font-medium text-sm border-b border-slate-100 pb-4"
                      >
                        {{ activeItem.details }}
                      </p>
                    </template>
                  </div>

                  <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    <!-- Loading State -->
                    <div
                      v-if="isLoadingDetails"
                      class="d-flex justify-center my-8"
                    >
                      <VProgressCircular
                        indeterminate
                        color="primary"
                        size="32"
                      />
                    </div>

                    <template v-else-if="detailsData">
                      <!-- Overview Metrics -->
                      <div class="grid grid-cols-2 gap-4">
                        <div
                          v-if="detailsData.scoreGlobal !== undefined"
                          class="bg-slate-50 p-4 rounded-xl border border-slate-100"
                        >
                          <div
                            class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
                          >
                            Score Global
                          </div>
                          <div class="text-3xl font-bold text-blue-600">
                            {{ detailsData.scoreGlobal
                            }}<span class="text-base text-slate-400 font-medium"
                              >/20</span
                            >
                          </div>
                        </div>

                        <div
                          v-else-if="
                            activeItem?.progressPercentage !== undefined
                          "
                          class="bg-slate-50 p-4 rounded-xl border border-slate-100"
                        >
                          <div
                            class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
                          >
                            Progression
                          </div>
                          <div class="text-3xl font-bold text-blue-600">
                            {{ activeItem.progressPercentage
                            }}<span class="text-base text-slate-400 font-medium"
                              >%</span
                            >
                          </div>
                        </div>
                      </div>

                      <!-- AI Insights / Recommendations -->
                      <div
                        v-if="detailsData.aiInsight"
                        class="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-blue-900 text-sm leading-relaxed flex gap-3 shadow-sm"
                      >
                        <Brain class="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                        <p class="whitespace-pre-line">
                          {{ detailsData.aiInsight }}
                        </p>
                      </div>

                      <!-- Competencies/Modules list -->
                      <div
                        v-if="
                          detailsData.moduleScores &&
                          detailsData.moduleScores.length > 0
                        "
                      >
                        <div
                          class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between"
                        >
                          <span>Compétences Évaluées</span>
                          <span
                            class="bg-slate-100 text-slate-600 py-1 px-2 rounded-full"
                            >{{ detailsData.moduleScores.length }}</span
                          >
                        </div>

                        <div class="space-y-4">
                          <div
                            v-for="(module, idx) in detailsData.moduleScores"
                            :key="idx"
                            class="bg-white border border-slate-100 p-3 rounded-lg shadow-sm"
                          >
                            <div
                              class="flex items-start justify-between text-sm mb-2 gap-4"
                            >
                              <span
                                class="font-medium text-slate-700 leading-snug"
                                >{{ module.name }}</span
                              >
                              <span class="font-bold text-slate-900 shrink-0"
                                >{{ module.percentage }}%</span
                              >
                            </div>
                            <div
                              class="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
                            >
                              <div
                                :class="module.color"
                                class="h-full rounded-full transition-all duration-500"
                                :style="{ width: module.percentage + '%' }"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>

                  <div
                    class="shrink-0 p-6 pt-4 border-t border-slate-100 bg-slate-50 flex gap-3"
                  >
                    <VBtn
                      block
                      color="primary"
                      variant="flat"
                      @click="continueToModules(activeItem)"
                      prepend-icon="bx-right-arrow-alt"
                      class="font-weight-bold"
                    >
                      Voir le module
                    </VBtn>
                  </div>
                </div>
              </VNavigationDrawer>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>

  <VRow v-else-if="!isLoading" class="mt-4">
    <!-- EMPTY STATE -->
    <VCol cols="12">
      <VCard>
        <VCardText>
          <h4 class="text-h4 mb-2">Votre Historique</h4>
          <p class="text-body-1 text-medium-emphasis">
            Aucune session trouvée dans votre historique
          </p>
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
  <VRow v-else class="mt-4 justify-center">
    <VProgressCircular indeterminate color="primary" />
  </VRow>
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
</style>
