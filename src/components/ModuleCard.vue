<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { referentielService } from "@/services/referentielService";
import type {
  ModuleReferentiel,
  CompetenceReferentiel,
} from "@/services/referentielService";

const props = defineProps<{
  module: ModuleReferentiel;
}>();

const router = useRouter();
const isLoading = ref(false);
const competences = ref<CompetenceReferentiel[]>([]);
const isDrawerOpen = ref(false);

const hebergement = computed(
  () =>
    props.module.uniteEnseignement?.libelle ||
    "Unité d'enseignement non renseignée",
);

const totalHours = computed(
  () =>
    props.module.heuresTotal ??
    (props.module.heuresCM || 0) +
      (props.module.heuresTD || 0) +
      (props.module.heuresTP || 0) +
      (props.module.heuresProjet || 0),
);

onMounted(async () => {
  try {
    isLoading.value = true;
    const comps = await referentielService.getModuleCompetences(
      props.module.id,
    );
    if (comps) {
      competences.value = comps;
    }
  } catch (e) {
    console.error("Failed to load competencies for", props.module.code, e);
  } finally {
    isLoading.value = false;
  }
});

const keyStats = computed(() => [
  { label: "ECTS", value: props.module.uniteEnseignement?.ects ?? "-" },
  { label: "Heures", value: totalHours.value },
]);

const startSession = () => {
  router.push(`/student/evaluations/${props.module.id}`);
};
</script>

<template>
  <div class="module-card-wrapper h-100">
    <VCard
      class="module-card d-flex flex-column h-100 rounded-lg cursor-pointer overflow-hidden"
      @click="startSession"
      ripple
    >
      <VCardText class="d-flex flex-column h-100 pa-6">
        <div class="d-flex align-start justify-space-between gap-3 mb-5">
          <div class="min-w-0 flex-grow-1 position-relative">
            <span class="module-bg-word" aria-hidden="true">{{
              module.nom.toUpperCase()
            }}</span>
            <h3
              class="module-title text-h6 font-weight-bold mb-1 text-truncate position-relative z-10"
            >
              {{ module.nom }}
            </h3>

            <div class="text-caption text-medium-emphasis text-truncate">
              {{ hebergement }} · S{{ module.semestre?.replace("S", "") }}
            </div>
          </div>

          <VChip
            size="x-small"
            :color="module.evaluable ? 'primary' : 'grey'"
            variant="outlined"
            class="flex-shrink-0"
          >
            {{ module.evaluable ? "Évaluable" : "Non évalué" }}
          </VChip>
        </div>

        <div class="mb-5 flex-grow-1">
          <div
            class="text-caption text-medium-emphasis text-uppercase letter-space-1 mb-1"
          >
            Prérequis
          </div>
          <div
            v-if="module.prerequisTexte"
            class="text-caption text-primary prereq-text"
          >
            {{ module.prerequisTexte }}
          </div>
          <div v-else class="text-caption text-medium-emphasis">Aucun</div>
        </div>

        <div
          class="d-flex align-center justify-space-between mt-auto pt-5 border-top"
        >
          <div class="d-flex gap-4">
            <div v-for="stat in keyStats" :key="stat.label">
              <div
                class="text-caption text-medium-emphasis text-uppercase letter-space-1"
              >
                {{ stat.label }}
              </div>
              <div class="module-value font-weight-bold text-body-2">
                {{ stat.value }}
                <span v-if="stat.label === 'Heures'">h</span>
              </div>
            </div>
          </div>

          <div class="d-flex align-center">
            <VBtn
              icon="bx-info-circle"
              variant="text"
              color="primary"
              class="mr-3 btn-info"
              size="small"
              @click.stop="isDrawerOpen = true"
            />
            <VBtn
              color="primary"
              variant="flat"
              class="btn-commencer rounded text-none px-5"
              append-icon="bx-right-arrow-alt"
              @click.stop="startSession"
            >
              Commencer
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VNavigationDrawer
      v-model="isDrawerOpen"
      location="right"
      temporary
      width="400"
      class="module-drawer"
    >
      <div class="pa-5 d-flex flex-column h-100">
        <div class="d-flex align-center justify-space-between mb-6">
          <h2 class="text-h5 font-weight-bold module-title">
            {{ module.code }}
          </h2>
          <VBtn
            icon="bx-x"
            variant="text"
            size="small"
            @click="isDrawerOpen = false"
          />
        </div>

        <h3 class="text-h6 font-weight-bold mb-2">{{ module.nom }}</h3>
        <p class="text-body-2 text-medium-emphasis mb-6">
          {{ hebergement }} (S{{ module.semestre?.replace("S", "") }})
        </p>

        <div class="mb-6">
          <h4
            class="text-subtitle-2 font-weight-bold mb-2 text-uppercase letter-space-1"
          >
            Informations
          </h4>
          <div class="d-flex gap-4 flex-wrap">
            <VChip
              size="small"
              :color="module.evaluable ? 'primary' : 'grey'"
              variant="outlined"
            >
              {{ module.evaluable ? "Évaluable" : "Non évalué" }}
            </VChip>
            <VChip size="small" variant="tonal" color="primary">
              {{ totalHours }} heures totales
            </VChip>
            <VChip
              size="small"
              variant="tonal"
              color="primary"
              v-if="module.uniteEnseignement?.ects"
            >
              {{ module.uniteEnseignement.ects }} ECTS
            </VChip>
          </div>
        </div>

        <div class="mb-6">
          <h4
            class="text-subtitle-2 font-weight-bold mb-2 text-uppercase letter-space-1"
          >
            Prérequis
          </h4>
          <p class="text-body-2 text-medium-emphasis">
            {{ module.prerequisTexte || "Aucun prérequis spécifié." }}
          </p>
        </div>

        <div class="flex-grow-1 overflow-y-auto">
          <h4
            class="text-subtitle-2 font-weight-bold mb-3 text-uppercase letter-space-1"
          >
            Compétences Visées ({{ competences.length }})
          </h4>

          <div v-if="isLoading" class="d-flex justify-center my-4">
            <VProgressCircular indeterminate color="primary" size="24" />
          </div>

          <div
            v-else-if="competences.length > 0"
            class="d-flex flex-column gap-3"
          >
            <VCard
              v-for="comp in competences"
              :key="comp.id"
              variant="outlined"
              class="competence-list-item pa-4"
            >
              <div class="d-flex align-start mb-1">
                <span class="font-weight-medium text-body-2 text-primary">{{
                  comp.intitule
                }}</span>
              </div>
              <p class="text-caption text-medium-emphasis mb-1">
                {{ comp.description }}
              </p>
              <div class="text-caption text-disabled">
                Niveau attendu : {{ comp.niveauAttendu }}
              </div>
            </VCard>
          </div>

          <p v-else class="text-body-2 text-medium-emphasis">
            Aucune compétence renseignée pour ce module.
          </p>
        </div>

        <div class="mt-4 pt-4 border-top">
          <VBtn
            block
            color="primary"
            @click="startSession"
            append-icon="bx-right-arrow-alt"
          >
            Commencer le module
          </VBtn>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<style scoped>
.module-card-wrapper {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.module-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.module-title {
  color: rgb(var(--v-theme-on-surface));
}
.module-value {
  color: rgb(var(--v-theme-on-surface));
}
.letter-space-1 {
  letter-spacing: 0.08em;
}
.border-top {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.module-card-wrapper:hover .module-card {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px -16px rgba(15, 39, 71, 0.24) !important;
  border-color: rgba(37, 99, 235, 0.18);
}
.btn-commencer {
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}
.module-card-wrapper:hover .btn-commencer {
  transform: scale(1.05);
}
.btn-info {
  background-color: rgba(37, 99, 235, 0.05);
}
.btn-info:hover {
  background-color: rgba(37, 99, 235, 0.15);
}
.competence-list-item {
  border-color: rgba(37, 99, 235, 0.2);
  background-color: rgba(37, 99, 235, 0.02);
}
.module-bg-word {
  position: absolute;
  top: -100%;
  left: -8%;
  z-index: 0;
  color: transparent;
  font-size: clamp(32px, 7vw, 72px);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 0.85;
  pointer-events: none;
  text-transform: uppercase;
  user-select: none;
  -webkit-text-stroke: 1px rgba(15, 23, 42, 0.05);
  word-break: break-word;
  max-width: 200%;
}
.z-10 {
  position: relative;
  z-index: 10;
}
.position-relative {
  position: relative;
}
</style>
