const fs = require('fs');

const content = `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { referentielService } from '@/services/referentielService';
import type { ModuleReferentiel } from '@/services/referentielService';

const modules = ref([]);
const isLoading = ref(true);
const recherche = ref('');
const filtreSemestre = ref('Tous');
const isDrawerOpen = ref(false);
const activeModule = ref(null);

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
  return ["Tous", ...Array.from(s).filter(Boolean).sort()];
});

const modulesFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return modules.value.filter((module) => {
    const matchRecherche =
      !terme ||
      (module.titre && module.titre.toLowerCase().includes(terme)) ||
      (module.code && module.code.toLowerCase().includes(terme));

    const matchSemestre =
      filtreSemestre.value === "Tous" || module.semestre === filtreSemestre.value;

    return matchRecherche && matchSemestre;
  });
});

const getColorBySemestre = (semestre) => {
  switch (semestre) {
    case 'S1': return 'primary';
    case 'S2': return 'success';
    case 'S3': return 'warning';
    case 'S4': return 'info';
    case 'S5': return 'error';
    default: return 'primary';
  }
};

const getRandomIcon = () => {
    const icons = ['bx-code-alt', 'bx-data', 'bx-brain', 'bx-building', 'bx-shield', 'bx-desktop'];
    return icons[Math.floor(Math.random() * icons.length)];
};

const openModuleDetails = async (module) => {
  activeModule.value = module;
  isDrawerOpen.value = true;
  if (!activeModule.value.description) {
    try {
      const details = await referentielService.getModuleById(module.id);
      activeModule.value = details;
      const index = modules.value.findIndex(m => m.id === module.id);
      if (index !== -1) {
        modules.value[index] = details;
      }
    } catch(err) {
      console.error(err);
    }
  }
};
</script>

<template>
  <div>
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div>
                <h4 class="text-h4 mb-2">Mes Modules 📚</h4>
                <p class="text-body-1 text-medium-emphasis">
                  Consultez les modules de la formation et explorez leurs détails.
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

    <VRow v-if="isLoading">
      <VCol v-for="i in 8" :key="i" cols="12" md="6" lg="3">
        <VSkeletonLoader type="card, article"></VSkeletonLoader>
      </VCol>
    </VRow>
    <VRow v-else-if="modulesFiltres.length === 0">
      <VCol cols="12">
        <VAlert color="info" variant="tonal">Aucun module trouvé pour cette recherche.</VAlert>
      </VCol>
    </VRow>
    <VRow v-else>
      <VCol v-for="module in modulesFiltres" :key="module.id" cols="12" md="6" lg="3">
        <VCard @click="openModuleDetails(module)" ripple class="cursor-pointer" style="height: 100%; display: flex; flex-direction: column;">
          <VCardItem>
            <div class="d-flex align-center gap-4">
              <VAvatar
                :icon="getRandomIcon()"
                :color="getColorBySemestre(module.semestre)"
                size="64"
                rounded
                variant="tonal"
              />
              <div>
                <div class="d-flex align-center gap-2 mb-1">
                  <h5 class="text-h5" style="line-height: normal;">
                    {{ module.titre }}
                  </h5>
                </div>
                <p class="text-sm text-medium-emphasis">
                  {{ module.code }} • Semestre {{ module.semestre }}
                </p>
              </div>
            </div>
          </VCardItem>

          <VCardText style="flex-grow: 1;">
            <VRow class="mb-4">
              <VCol cols="6" sm="6">
                <div class="d-flex align-center gap-2">
                  <VIcon icon="bx-time" size="20" />
                  <div>
                    <div class="text-sm text-medium-emphasis">Durée</div>
                    <div class="font-weight-medium">
                      {{ module.dureePrevueHeures }}h
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol cols="6" sm="6">
                <div class="d-flex align-center gap-2">
                  <VIcon icon="bx-award" size="20" />
                  <div>
                    <div class="text-sm text-medium-emphasis">Crédits</div>
                    <div class="font-weight-medium">
                      {{ module.credits }}
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>

            <div class="mb-4 d-flex justify-space-between align-end">
              <div v-if="module.uniteEnseignement?.nom" class="d-flex gap-2">
                <VChip size="small" :color="getColorBySemestre(module.semestre)" variant="tonal">
                  {{ module.uniteEnseignement.nom }}
                </VChip>
              </div>
              <div v-if="module.prerequisModulesId && module.prerequisModulesId.length > 0">
                <VIcon color="warning" icon="bx-error" size="24" :title="\`\${module.prerequisModulesId.length} pré-requis\`" />
              </div>
            </div>

            <VBtn block :color="getColorBySemestre(module.semestre)" variant="tonal" prepend-icon="bx-info-circle">
              Plus de détails
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VNavigationDrawer
      v-model="isDrawerOpen"
      location="right"
      temporary
      width="400"
    >
      <div v-if="activeModule" class="pa-4 h-100 d-flex flex-column">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h5">Détails du Module</h2>
          <VBtn icon="bx-x" variant="text" size="small" @click="isDrawerOpen = false"></VBtn>
        </div>

        <VAvatar
          :color="getColorBySemestre(activeModule.semestre)"
          size="80"
          rounded
          variant="tonal"
          class="mb-4 align-self-center"
          :icon="getRandomIcon()"
        />

        <h3 class="text-h4 text-center mb-1">{{ activeModule.titre }}</h3>
        <p class="text-center text-medium-emphasis mb-6">
          {{ activeModule.code }} - Semestre {{ activeModule.semestre }}
        </p>

        <VDivider class="mb-6"></VDivider>

        <div class="flex-grow-1">
          <div class="mb-4">
            <h4 class="text-h6 mb-2 d-flex align-center">
              <VIcon icon="bx-book-open" class="mr-2" /> Unité d'enseignement
            </h4>
            <p v-if="activeModule.uniteEnseignement">{{ activeModule.uniteEnseignement.code }} - {{ activeModule.uniteEnseignement.nom }}</p>
            <p v-else class="text-medium-emphasis">Non définie</p>
          </div>

          <div class="mb-4">
            <h4 class="text-h6 mb-2 d-flex align-center">
              <VIcon icon="bx-detail" class="mr-2" /> Description
            </h4>
            <p v-if="activeModule.description" style="white-space: pre-line">{{ activeModule.description }}</p>
            <v-skeleton-loader v-else type="paragraph"></v-skeleton-loader>
          </div>

          <div class="mb-4" border rounded pa-3>
            <VRow>
              <VCol cols="6">
                <strong>Crédits:</strong> {{ activeModule.credits }}
              </VCol>
              <VCol cols="6">
                <strong>Durée:</strong> {{ activeModule.dureePrevueHeures }}h
              </VCol>
            </VRow>
          </div>
          
          <div v-if="activeModule.prerequisModulesId && activeModule.prerequisModulesId.length > 0" class="mb-4">
            <VAlert
              type="warning"
              variant="tonal"
              title="Pré-requis nécessaires"
            >
              Ce module nécessite la validation de {{ activeModule.prerequisModulesId.length }} autre(s) module(s).
            </VAlert>
          </div>
        </div>

      </div>
    </VNavigationDrawer>
  </div>
</template>
`;

fs.writeFileSync('C:/Users/teste/Desktop/Académique/Cycle-Ingénieur/S2/PTUT/AUXO/src/pages/mes-modules.vue', content, 'utf8');
console.log('Done!');
