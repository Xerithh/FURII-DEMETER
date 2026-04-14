<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { ModuleReferentiel } from "@/services/referentielService";
import { useModuleStore } from "@/stores/module";
import ModuleCard from "@/components/ModuleCard.vue";
import PageHeader from "@/components/PageHeader.vue";

const moduleStore = useModuleStore();
const recherche = ref("");
const filtreSemestre = ref("Tous");

onMounted(async () => {
  await moduleStore.fetchRecommendedModules();
});

const modules = computed<ModuleReferentiel[]>(() => moduleStore.modules);
const isLoading = computed(() => moduleStore.isLoading);

const semestres = computed(() => {
  const s = new Set(modules.value.map((m) => m.semestre));
  return ["Tous", ...Array.from(s).filter(Boolean).sort()];
});

const modulesFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return modules.value.filter((module) => {
    const matchRecherche =
      !terme ||
      (module.nom && module.nom.toLowerCase().includes(terme)) ||
      (module.code && module.code.toLowerCase().includes(terme));

    const matchSemestre =
      filtreSemestre.value === "Tous" ||
      module.semestre === filtreSemestre.value;

    return matchRecherche && matchSemestre;
  });
});

const hasNoRecommendations = computed(
  () =>
    moduleStore.hasFetched &&
    !moduleStore.isLoading &&
    modules.value.length === 0,
);
</script>

<template>
  <div>
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <PageHeader
              icon="bx-book-open"
              title="Mes Modules"
              subtitle="Consultez les modules de la formation et explorez vos évaluations."
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mb-6">
      <VCol cols="12" md="6" lg="5">
        <VTextField
          v-model="recherche"
          label="Rechercher un module"
          placeholder="Ex: Programmation, architecture..."
          prepend-inner-icon="bx-search"
          clearable
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="3" lg="3">
        <VSelect
          v-model="filtreSemestre"
          :items="semestres"
          label="Semestre"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>
    </VRow>

    <VRow v-if="isLoading">
      <VCol v-for="i in 8" :key="i" cols="12" md="6" lg="4" xl="3">
        <VSkeletonLoader type="card, article" />
      </VCol>
    </VRow>

    <VRow v-else-if="moduleStore.error">
      <VCol cols="12">
        <VAlert color="error" variant="tonal">{{ moduleStore.error }}</VAlert>
      </VCol>
    </VRow>

    <VRow v-else-if="hasNoRecommendations">
      <VCol cols="12">
        <VAlert color="info" variant="tonal">
          Réalisez une évaluation globale pour obtenir vos premières
          recommandations de modules.
        </VAlert>
      </VCol>
    </VRow>

    <VRow v-else-if="modulesFiltres.length === 0">
      <VCol cols="12">
        <VAlert color="info" variant="tonal">
          Aucun module recommandé ne correspond à votre recherche.
        </VAlert>
      </VCol>
    </VRow>

    <VRow v-else>
      <VCol
        v-for="module in modulesFiltres"
        :key="module.id"
        cols="12"
        md="6"
        lg="4"
        xl="3"
      >
        <ModuleCard :module="module" />
      </VCol>
    </VRow>
  </div>
</template>
