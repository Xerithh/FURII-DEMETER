<script setup>
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

const undrawSvgModules = import.meta.glob("/public/images/svg/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const undrawSvgPool = Object.keys(undrawSvgModules)
  .map((p) => p.split("/").pop())
  .filter(Boolean);

const historique = [
  {
    id: 1,
    date: "15 Janvier 2026",
    type: "Évaluation",
    action: "Examen validé",
    details: "Architecture Logicielle - Examen Final",
    note: 16,
    progressPercentage: 85,
    icon: Check,
    color: "text-blue-700",
    aiInsight:
      "Vos réponses montrent une excellente compréhension des patterns de conception et de l'architecture microservices. Vous maîtrisez particulièrement les principes SOLID.",
    moduleScores: [
      { name: "Architecture", percentage: 92, color: "bg-blue-600" },
      { name: "Design Patterns", percentage: 88, color: "bg-blue-500" },
      { name: "Microservices", percentage: 85, color: "bg-blue-400" },
    ],
  },
  {
    id: 2,
    date: "12 Janvier 2026",
    type: "Module",
    action: "Module complété",
    details: "Architecture Logicielle - 100%",
    icon: Book,
    color: "text-blue-700",
    progressPercentage: 100,
    aiInsight:
      "Félicitations ! Vous avez complété ce module avec succès. Vos performances indiquent une belle progression.",
    moduleScores: [
      { name: "Concepts", percentage: 100, color: "bg-blue-600" },
      { name: "Application", percentage: 95, color: "bg-blue-500" },
    ],
  },
  {
    id: 3,
    date: "20 Décembre 2025",
    type: "Projet",
    action: "Projet rendu",
    details: "Application Mobile - Note: 15.5/20",
    note: 15.5,
    progressPercentage: 72,
    icon: Code,
    color: "text-blue-600",
    aiInsight:
      "Très bonne approche du problème. L'interface utilisateur est intuitive, mais quelques optimisations de performance pourraient améliorer l'accessibilité.",
    moduleScores: [
      { name: "React Native", percentage: 82, color: "bg-blue-500" },
      { name: "UI/UX", percentage: 79, color: "bg-blue-400" },
      { name: "Performance", percentage: 72, color: "bg-blue-300" },
    ],
  },
  {
    id: 4,
    date: "15 Décembre 2025",
    type: "Badge",
    action: "Badge obtenu",
    details: "Expert Frontend - Maîtrise de Vue.js",
    icon: Award,
    color: "text-blue-600",
    progressPercentage: 95,
    aiInsight:
      "Bravo ! Vous avez atteint le statut d'Expert Frontend grâce à votre progression constante dans l'écosystème Vue.js.",
    moduleScores: [
      { name: "Vue 3", percentage: 95, color: "bg-blue-600" },
      { name: "Composition API", percentage: 92, color: "bg-blue-500" },
    ],
  },
  {
    id: 5,
    date: "10 Décembre 2025",
    type: "Quiz",
    action: "Quiz réussi",
    details: "Base de Données - Normalisation",
    note: 18,
    progressPercentage: 90,
    icon: Brain,
    color: "text-blue-700",
    aiInsight:
      "Maîtrise impressionnante des formes normales. Vos réponses démontrent une compréhension profonde de la théorie relationnelle.",
    moduleScores: [
      { name: "Base de Données", percentage: 90, color: "bg-blue-600" },
      { name: "Normalisation", percentage: 94, color: "bg-blue-500" },
      { name: "SQL", percentage: 88, color: "bg-blue-400" },
    ],
  },
  {
    id: 6,
    date: "5 Décembre 2025",
    type: "Module",
    action: "Nouveau module démarré",
    details: "Sécurité Informatique",
    icon: PlayCircle,
    color: "text-blue-500",
    progressPercentage: 45,
    aiInsight:
      "Bienvenue ! Ce module couvre les fondamentaux de la sécurité informatique. Concentrez-vous d'abord sur les principes cryptographiques de base.",
    moduleScores: [
      { name: "Cryptographie", percentage: 65, color: "bg-blue-400" },
      { name: "OWASP", percentage: 58, color: "bg-blue-300" },
    ],
  },
  {
    id: 7,
    date: "1 Décembre 2025",
    type: "Compétence",
    action: "Compétence validée",
    details: "Base de Données SQL - Niveau Avancé",
    icon: Star,
    color: "text-blue-600",
    progressPercentage: 88,
    aiInsight:
      "Compétence validée ! Vous êtes désormais capable d'optimiser des requêtes complexes et utiliser les jointures avancées efficacement.",
    moduleScores: [
      { name: "SQL", percentage: 91, color: "bg-blue-600" },
      { name: "Optimisation", percentage: 87, color: "bg-blue-500" },
      { name: "Indexation", percentage: 84, color: "bg-blue-400" },
    ],
  },
  {
    id: 8,
    date: "25 Novembre 2025",
    type: "Évaluation",
    action: "TP validé",
    details: "Réseaux - Configuration serveur",
    note: 14,
    progressPercentage: 70,
    icon: Check,
    color: "text-blue-500",
    aiInsight:
      "Bon travail ! Votre configuration est solide, mais il y a quelques optimisations possibles sur le routage dynamique que vous devriez explorer.",
    moduleScores: [
      { name: "Réseaux", percentage: 80, color: "bg-blue-600" },
      { name: "DevOps", percentage: 75, color: "bg-blue-500" },
      { name: "Serveurs", percentage: 82, color: "bg-blue-400" },
    ],
  },
  {
    id: 9,
    date: "20 Novembre 2025",
    type: "Certificat",
    action: "Certificat obtenu",
    details: "JavaScript ES6+ Avancé",
    icon: Certification,
    color: "text-blue-700",
    progressPercentage: 92,
    aiInsight:
      "Certificat obtenu ! Vous maîtrisez les fonctionnalités modernes de JavaScript et êtes prêt pour les frameworks avancés.",
    moduleScores: [
      { name: "JavaScript", percentage: 94, color: "bg-blue-600" },
      { name: "ES6+", percentage: 91, color: "bg-blue-500" },
    ],
  },
];

const isModalOpen = ref(false);
const activeItem = ref(null);

const router = useRouter();

const continueToModules = (item) => {
  // close modal then navigate to 'mes-modules' with a query pointing to the module/details
  closeModal();
  const q = item?.details || item?.action || "";
  router.push({ path: "/mes-modules", query: { q } });
};

const openModal = (item) => {
  activeItem.value = item;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => (activeItem.value = null), 200);
};

// Filtres et recherche
const recherche = ref("");
const filtreType = ref("Tous");
const filtreResultat = ref("Tous");

const types = computed(() => [
  "Tous",
  ...new Set(historique.map((item) => item.type)),
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

  return historique.filter((item) => {
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

const _desktopMarkerSize = 200; // px (increased)
const _mobileMarkerSize = 90; // px (reduced)

const _desktopOffset = 700; // px (far away)
const _mobileOffset = 200; // px

onMounted(() => {
  const onResize = () => (viewportWidth.value = window.innerWidth);
  window.addEventListener("resize", onResize);
  // store handler for cleanup
  viewportWidth._handler = onResize;
});

onBeforeUnmount(() => {
  if (viewportWidth._handler)
    window.removeEventListener("resize", viewportWidth._handler);
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
  <!-- Header Section (adapted for Mon Parcours) -->
  <VRow class="mb-6">
    <VCol cols="12">
      <VCard>
        <VCardText>
          <div
            class="d-flex align-center justify-space-between flex-wrap gap-4"
          >
            <div>
              <h4 class="text-h4 mb-2">Mon Parcours 🧭</h4>
              <p class="text-body-1 text-medium-emphasis">
                Filtrez et recherchez vos activités, évaluations et modules
                récents
              </p>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
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
  <div
    class="bg-white min-h-screen font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300"
  >
    <div class="max-w-md mx-auto py-12 px-4 scroll-smooth">
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
      <div class="relative w-full" :style="{ height: containerHeight + 'px' }">
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
          <div v-for="(item, index) in historiqueFiltres" :key="item.id">
            <button
              @click="openModal(item)"
              class="absolute w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center shadow-sm cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 transform-gpu"
              :class="[getBgClass(item)]"
              :style="{
                left: positions[index].x + '%',
                top: positions[index].y + 'px',
                transform: 'translate(-50%, -50%)',
              }"
            >
              <component
                :is="item.icon"
                class="w-7 h-7 text-white transition-colors duration-300"
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
                v-if="assignRandomMarkers[index] || patternSvgMarkers[index]"
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

    <Teleport defer to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          @click="closeModal"
        ></div>

        <div
          class="relative bg-white text-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-slate-200"
          style="background-color: white; color: #1f2937"
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-20 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X class="w-6 h-6 text-slate-400 hover:text-slate-600" />
          </button>

          <div class="p-8">
            <template v-if="activeItem">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-slate-100 shrink-0"
                  :class="getModalBgClass(activeItem)"
                >
                  <component :is="activeItem.icon" class="w-8 h-8 text-white" />
                </div>
                <div class="flex-1">
                  <div
                    class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1"
                  >
                    {{ activeItem.type }}
                  </div>
                  <h3 class="text-2xl font-bold leading-tight">
                    {{ activeItem.action }}
                  </h3>
                </div>
              </div>

              <div class="space-y-6">
                <p
                  class="text-slate-700 dark:text-slate-200 font-medium text-base"
                >
                  {{ activeItem.details }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="activeItem.note">
                    <div
                      class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
                    >
                      Note
                    </div>
                    <div class="text-4xl font-bold" :class="activeItem.color">
                      {{ activeItem.note
                      }}<span class="text-lg text-slate-400">/20</span>
                    </div>
                  </div>

                  <div v-if="activeItem.progressPercentage !== undefined">
                    <div
                      class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
                    >
                      Progression
                    </div>
                    <div class="text-4xl font-bold text-blue-600">
                      {{ activeItem.progressPercentage
                      }}<span class="text-lg text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="
                    activeItem.moduleScores &&
                    activeItem.moduleScores.length > 0
                  "
                  class="w-full"
                >
                  <div
                    class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3"
                  >
                    Performance par module
                  </div>
                  <div class="space-y-3">
                    <div
                      v-for="(module, idx) in activeItem.moduleScores"
                      :key="idx"
                      class="space-y-1"
                    >
                      <div
                        class="flex items-center justify-between text-sm mb-1"
                      >
                        <span
                          class="font-medium text-slate-700 dark:text-slate-200"
                          >{{ module.name }}</span
                        >
                        <span
                          class="font-bold text-slate-900 dark:text-slate-100"
                          >{{ module.percentage }}%</span
                        >
                      </div>
                      <div class="w-full bg-slate-200 h-2.5 overflow-hidden">
                        <div
                          :class="module.color"
                          class="h-full transition-all duration-500"
                          :style="{ width: module.percentage + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="activeItem.aiInsight"
                  class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-blue-900 text-sm leading-relaxed flex gap-3"
                >
                  <Brain class="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                  <p>{{ activeItem.aiInsight }}</p>
                </div>
              </div>
            </template>
          </div>

          <div
            class="p-4 border-t border-slate-100 bg-white flex justify-end sticky bottom-0 gap-3"
          >
            <VBtn
              v-if="activeItem"
              @click="continueToModules(activeItem)"
              class="continue-module-btn"
            >
              Continuer le module
            </VBtn>

            <VBtn variant="tonal" color="secondary" @click="closeModal">
              Fermer
            </VBtn>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
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
