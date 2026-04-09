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

const badges = [
  { titre: 'Expert Frontend', date: '15 Déc 2025', icon: 'bx-trophy', color: 'warning' },
  { titre: 'Développeur Full-Stack', date: '10 Nov 2025', icon: 'bx-award', color: 'primary' },
  { titre: 'Maître SQL', date: '1 Déc 2025', icon: 'bx-data', color: 'info' },
  { titre: 'Architecte Logiciel', date: '15 Jan 2026', icon: 'bx-building', color: 'success' },
]

const certificats = [
  { titre: 'JavaScript ES6+ Avancé', organisme: 'Plateforme AUXO', date: '20 Nov 2025' },
  { titre: 'Vue.js Certification', organisme: 'Vue School', date: '15 Déc 2025' },
]

const selectedTab = ref('timeline')
const filtreType = ref('Tous')

const typesActivite = ['Tous', 'Module', 'Évaluation', 'Projet', 'Badge', 'Certificat', 'Compétence', 'Quiz']

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

    <!-- Stats Cards -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-book"
              color="primary"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ historique.filter(h => h.type === 'Module' && h.action.includes('complété')).length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              Modules complétés
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-edit"
              color="success"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ historique.filter(h => h.type === 'Évaluation').length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              Évaluations réussies
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-award"
              color="warning"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ badges.length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              Badges obtenus
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-certification"
              color="error"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ certificats.length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              Certificats
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Tabs -->
    <VTabs
      v-model="selectedTab"
      class="mb-6"
    >
      <VTab value="timeline">Chronologie</VTab>
      <VTab value="badges">Badges & Certificats</VTab>
      <VTab value="stats">Statistiques mensuelles</VTab>
    </VTabs>

    <!-- Tab Content -->
    <VWindow v-model="selectedTab">
      <!-- Timeline Tab -->
      <VWindowItem value="timeline">
        <!-- Filtre -->
        <VRow class="mb-4">
          <VCol cols="12" md="4">
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
                  side="end"
                  align="start"
                  truncate-line="both"
                >
                  <VTimelineItem
                    v-for="(item, idx) in historiqueFiltre"
                    :key="idx"
                    :dot-color="item.color"
                    size="small"
                  >
                    <template #icon>
                      <VIcon :icon="item.icon" size="18" />
                    </template>

                    <VCard variant="tonal">
                      <VCardText>
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
                        <div v-if="item.note" class="d-flex align-center gap-2">
                          <VIcon icon="bx-star" size="16" :color="item.note >= 15 ? 'success' : item.note >= 10 ? 'warning' : 'error'" />
                          <span class="text-sm font-weight-medium" :class="item.note >= 15 ? 'text-success' : item.note >= 10 ? 'text-warning' : 'text-error'">
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

      <!-- Badges Tab -->
      <VWindowItem value="badges">
        <VRow>
          <VCol cols="12">
            <VCard title="Badges obtenus">
              <VCardText>
                <VRow>
                  <VCol
                    v-for="(badge, idx) in badges"
                    :key="idx"
                    cols="12"
                    sm="6"
                    md="3"
                  >
                    <VCard variant="tonal">
                      <VCardText class="text-center">
                        <VAvatar
                          :icon="badge.icon"
                          :color="badge.color"
                          size="80"
                          rounded
                          variant="tonal"
                          class="mb-4"
                        />
                        <h6 class="text-h6 mb-2">
                          {{ badge.titre }}
                        </h6>
                        <p class="text-sm text-medium-emphasis">
                          Obtenu le {{ badge.date }}
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>

          <VCol cols="12">
            <VCard title="Certificats">
              <VCardText>
                <VRow>
                  <VCol
                    v-for="(cert, idx) in certificats"
                    :key="idx"
                    cols="12"
                    md="6"
                  >
                    <VCard variant="tonal" color="error">
                      <VCardText>
                        <div class="d-flex align-center gap-3">
                          <VAvatar
                            icon="bx-certification"
                            color="error"
                            size="64"
                            rounded
                            variant="tonal"
                          />
                          <div class="flex-grow-1">
                            <h6 class="text-h6 mb-1">
                              {{ cert.titre }}
                            </h6>
                            <p class="text-sm text-medium-emphasis mb-2">
                              {{ cert.organisme }}
                            </p>
                            <div class="d-flex align-center gap-2">
                              <VIcon icon="bx-calendar" size="16" />
                              <span class="text-sm">{{ cert.date }}</span>
                            </div>
                          </div>
                        </div>
                        <VBtn
                          block
                          color="error"
                          class="mt-4"
                          prepend-icon="bx-download"
                        >
                          Télécharger
                        </VBtn>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

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
                  <VCol cols="12" sm="4">
                    <div class="d-flex align-center gap-3">
                      <VAvatar
                        icon="bx-book"
                        color="primary"
                        size="48"
                        rounded
                        variant="tonal"
                      />
                      <div>
                        <h6 class="text-h6">{{ stat.modules }}</h6>
                        <p class="text-sm text-medium-emphasis">Modules</p>
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" sm="4">
                    <div class="d-flex align-center gap-3">
                      <VAvatar
                        icon="bx-edit"
                        color="success"
                        size="48"
                        rounded
                        variant="tonal"
                      />
                      <div>
                        <h6 class="text-h6">{{ stat.evaluations }}</h6>
                        <p class="text-sm text-medium-emphasis">Évaluations</p>
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" sm="4">
                    <div class="d-flex align-center gap-3">
                      <VAvatar
                        icon="bx-award"
                        color="warning"
                        size="48"
                        rounded
                        variant="tonal"
                      />
                      <div>
                        <h6 class="text-h6">{{ stat.badges }}</h6>
                        <p class="text-sm text-medium-emphasis">Badges</p>
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
