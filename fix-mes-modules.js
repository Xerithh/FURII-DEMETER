const fs = require('fs');
const content = `
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { referentielService } from '@/services/referentielService';
import type { ModuleReferentiel } from '@/services/referentielService';
import ModuleCard from '@/components/ModuleCard.vue';

const modules = ref<ModuleReferentiel[]>([]);
const isLoading = ref(true);
const recherche = ref('');
const filtreSemestre = ref('Tous');

onMounted(async () => {
  try {
    isLoading.value = true;
    modules.value = await referentielService.getAllModules();
  } catch (error) {
    console.error('Erreur lors du chargement des modules', error);
  } finally {
    isLoading.value = false;
  }
});

const semestres = computed(() => {
  const s = new Set(modules.value.map((m) => m.semestre));
  return ['Tous', ...Array.from(s).filter(Boolean).sort()];
});

const modulesFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return modules.value.filter((module) => {
    const matchRecherche = !terme ||
      (module.titre && module.titre.toLowerCase().includes(terme)) ||
      (module.code && module.code.toLowerCase().includes(terme));

    const matchSemestre = filtreSemestre.value === 'Tous' || module.semestre === filtreSemestre.value;

    return matchRecherche && matchSemestre;
  });
});
</script>

<template>
  <div>
    <!-- Header Section -->
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div>
                <h4 class="text-h4 mb-2">Mes Modules 📚</h4>
                <p class="text-body-1 text-medium-emphasis">
                  Consultez les modules de la formation et explorez vos évaluations.
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

    <!-- Modules List / Skeleton -->
    <VRow v-if="isLoading">
      <VCol v-for="i in 8" :key="i" cols="12" md="6" lg="4" xl="3">
        <VSkeletonLoader type="card, article"></VSkeletonLoader>
      </VCol>
    </VRow>
    
    <VRow v-else-if="modulesFiltres.length === 0">
      <VCol cols="12">
        <VAlert color="info" variant="tonal">Aucun module trouvé pour cette recherche.</VAlert>
      </VCol>
    </VRow>
    
    <VRow v-else>
      <VCol v-for="module in modulesFiltres" :key="module.id" cols="12" md="6" lg="4" xl="3">
        <ModuleCard :module="module" />
      </VCol>
    </VRow>
  </div>
</template>
`;
fs.writeFileSync('./src/pages/mes-modules.vue', content.trim());
