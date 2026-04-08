<script setup>
import { ref } from 'vue'

const historique = [
  {
    date: '15 Janvier 2026',
    type: 'Évaluation',
    action: 'Examen validé',
    details: 'Architecture Logicielle - Examen Final',
    note: 16,
    icon: 'bx-check-circle',
    color: 'success',
  },
  {
    date: '12 Janvier 2026',
    type: 'Module',
    action: 'Module complété',
    details: 'Architecture Logicielle - 100%',
    icon: 'bx-book',
    color: 'primary',
  },
  {
    date: '20 Décembre 2025',
    type: 'Projet',
    action: 'Projet rendu',
    details: 'Application Mobile - Note: 15.5/20',
    note: 15.5,
    icon: 'bx-code-alt',
    color: 'info',
  },
  {
    date: '15 Décembre 2025',
    type: 'Badge',
    action: 'Badge obtenu',
    details: 'Expert Frontend - Maîtrise de Vue.js',
    icon: 'bx-award',
    color: 'warning',
  },
  {
    date: '10 Décembre 2025',
    type: 'Quiz',
    action: 'Quiz réussi',
    details: 'Base de Données - Normalisation',
    note: 18,
    icon: 'bx-brain',
    color: 'success',
  },
  {
    date: '5 Décembre 2025',
    type: 'Module',
    action: 'Nouveau module démarré',
    details: 'Sécurité Informatique',
    icon: 'bx-play-circle',
    color: 'primary',
  },
  {
    date: '1 Décembre 2025',
    type: 'Compétence',
    action: 'Compétence validée',
    details: 'Base de Données SQL - Niveau Avancé',
    icon: 'bx-star',
    color: 'warning',
  },
  {
    date: '25 Novembre 2025',
    type: 'Évaluation',
    action: 'TP validé',
    details: 'Réseaux - Configuration serveur',
    note: 14,
    icon: 'bx-check-circle',
    color: 'success',
  },
  {
    date: '20 Novembre 2025',
    type: 'Certificat',
    action: 'Certificat obtenu',
    details: 'JavaScript ES6+ Avancé',
    icon: 'bx-certification',
    color: 'error',
  },
  {
    date: '15 Novembre 2025',
    type: 'Module',
    action: 'Module complété',
    details: 'Développement Mobile - 100%',
    icon: 'bx-book',
    color: 'primary',
  },
  {
    date: '10 Novembre 2025',
    type: 'Badge',
    action: 'Badge obtenu',
    details: 'Développeur Full-Stack',
    icon: 'bx-award',
    color: 'warning',
  },
  {
    date: '5 Novembre 2025',
    type: 'Évaluation',
    action: 'Examen validé',
    details: 'Réseaux - Note: 14/20',
    note: 14,
    icon: 'bx-check-circle',
    color: 'success',
  },
]

// Badges et certificats supprimés — section retirée

const selectedTab = ref('timeline')
const filtreType = ref('Tous')

const typesActivite = ['Tous', 'Module', 'Évaluation', 'Projet', 'Compétence', 'Quiz']

const historiqueFiltre = filtreType.value === 'Tous' 
  ? historique 
  : historique.filter(h => h.type === filtreType.value)

const statsParMois = [
  { mois: 'Janvier 2026', modules: 1, evaluations: 2, badges: 1 },
  { mois: 'Décembre 2025', modules: 2, evaluations: 3, badges: 2 },
  { mois: 'Novembre 2025', modules: 2, evaluations: 2, badges: 1 },
]
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
                <h4 class="text-h4 mb-2">
                  Historique d'Apprentissage 📜
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  Retracez votre parcours et vos accomplissements
                </p>
              </div>
              <div class="d-flex gap-2">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="bx-download"
                >
                  Exporter
                </VBtn>
                <VBtn
                  color="primary"
                  prepend-icon="bx-bar-chart"
                >
                  Statistiques
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Tabs -->
    <VTabs
      v-model="selectedTab"
      class="mb-6"
    >
      <VTab value="timeline">
        Chronologie
      </VTab>
      <VTab value="stats">
        Statistiques mensuelles
      </VTab>
    </VTabs>

    <!-- Tab Content -->
    <VWindow v-model="selectedTab">
      <!-- Timeline Tab -->
      <VWindowItem value="timeline">
        <!-- Filtre -->
        <VRow class="mb-4">
          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="filtreType"
              :items="typesActivite"
              label="Filtrer par type"
              prepend-inner-icon="bx-filter"
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <VCard>
              <VCardText>
                <VTimeline
                  side="start"
                  align="start"
                  truncate-line="both"
                >
                  <VTimelineItem
                    v-for="(item, idx) in historiqueFiltre"
                    :key="idx"
                    :dot-color="item.color"
                    size="small"
                    side="start"
                    class="w-100"
                    style="width:100%; padding-inline-start:0 !important; margin-inline-start:0 !important;"
                  >
                    <template #icon>
                      <VIcon
                        :icon="item.icon"
                        size="18"
                      />
                    </template>

                    <VCard variant="tonal" class="timeline-card w-100" style="width:100%; min-height:140px; display:flex; flex-direction:column;">
                      <VCardText class="timeline-card-content" style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <VChip
                            :color="item.color"
                            size="small"
                          >
                            {{ item.type }}
                          </VChip>
                          <span class="text-sm text-medium-emphasis">{{ item.date }}</span>
                        </div>
                        <h6 class="text-h6 mb-1">
                          {{ item.action }}
                        </h6>
                        <p class="text-sm text-medium-emphasis mb-2">
                          {{ item.details }}
                        </p>
                        <div
                          v-if="item.note"
                          class="d-flex align-center gap-2"
                        >
                          <VIcon
                            icon="bx-star"
                            size="16"
                            :color="item.note >= 15 ? 'success' : item.note >= 10 ? 'warning' : 'error'"
                          />
                          <span
                            class="text-sm font-weight-medium"
                            :class="item.note >= 15 ? 'text-success' : item.note >= 10 ? 'text-warning' : 'text-error'"
                          >
                            Note: {{ item.note }}/20
                          </span>
                        </div>
                      </VCardText>
                    </VCard>
                  </VTimelineItem>
                </VTimeline>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

      <!-- Badges & certificats section removed -->

      <!-- Stats Tab -->
      <VWindowItem value="stats">
        <VRow>
          <VCol
            v-for="(stat, idx) in statsParMois"
            :key="idx"
            cols="12"
          >
            <VCard>
              <VCardItem>
                <h5 class="text-h5">
                  {{ stat.mois }}
                </h5>
              </VCardItem>
              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    sm="4"
                  >
                    <div class="d-flex align-center gap-3">
                      <VAvatar
                        icon="bx-book"
                        color="primary"
                        size="48"
                        rounded
                        variant="tonal"
                      />
                      <div>
                        <h6 class="text-h6">
                          {{ stat.modules }}
                        </h6>
                        <p class="text-sm text-medium-emphasis">
                          Modules
                        </p>
                      </div>
                    </div>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="4"
                  >
                    <div class="d-flex align-center gap-3">
                      <VAvatar
                        icon="bx-edit"
                        color="success"
                        size="48"
                        rounded
                        variant="tonal"
                      />
                      <div>
                        <h6 class="text-h6">
                          {{ stat.evaluations }}
                        </h6>
                        <p class="text-sm text-medium-emphasis">
                          Évaluations
                        </p>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
    </VWindow>
  </div>
</template>
