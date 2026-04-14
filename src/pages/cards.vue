<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { referentielService } from "@/services/referentielService";
import type { ModuleReferentiel } from "@/services/referentielService";
import ModuleCard from "@/components/ModuleCard.vue";
import PageHeader from "@/components/PageHeader.vue";

const modules = ref<ModuleReferentiel[]>([]);
const isLoading = ref(true);
const recherche = ref("");
const filtreSemestre = ref("Tous");

onMounted(async () => {
  try {
    isLoading.value = true;
    modules.value = await referentielService.getAllModules();
  } catch (error) {
    console.error(
      "Erreur lors du chargement des modules de la bibliothèque",
      error,
    );
  } finally {
    isLoading.value = false;
  }
});

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
</script>

<template>
  <div>
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <PageHeader
              icon="bx-library"
              title="Bibliothèque de Modules"
              subtitle="Explorez l'ensemble des modules disponibles dans le référentiel."
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

    <VRow v-else-if="modulesFiltres.length === 0">
      <VCol cols="12">
        <VAlert color="info" variant="tonal">
          Aucun module trouvé pour cette recherche.
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
