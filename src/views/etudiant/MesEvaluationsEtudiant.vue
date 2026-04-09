<script setup>
import { ref } from 'vue'

const evaluations = [
  {
    id: 1,
    titre: 'Examen Final - Base de Données',
    module: 'Base de Données Relationnelles',
    type: 'Examen',
    date: '8 Février 2026',
    duree: '2h',
    statut: 'À venir',
    note: null,
    coefficient: 0.4,
    salle: 'Amphi B',
    heure: '14h00',
    icon: 'bx-edit',
    color: 'warning',
    ressources: ['Cours complet', 'TP 1-6', 'Projet SQL'],
  },
  {
    id: 2,
    titre: 'Projet Frontend - Application Vue.js',
    module: 'Développement Web Frontend',
    type: 'Projet',
    date: '12 Février 2026',
    duree: null,
    statut: 'En cours',
    note: null,
    coefficient: 0.5,
    progression: 65,
    icon: 'bx-code-alt',
    color: 'primary',
    taches: [
      { titre: 'Setup projet', complete: true },
      { titre: 'Composants de base', complete: true },
      { titre: 'Routing', complete: true },
      { titre: 'Intégration API', complete: false },
      { titre: 'Tests', complete: false },
      { titre: 'Documentation', complete: false },
    ],
  },
  {
    id: 3,
    titre: 'Quiz Algorithmique - Graphes',
    module: 'Algorithmique Avancée',
    type: 'Quiz',
    date: '15 Février 2026',
    duree: '30 min',
    statut: 'À venir',
    note: null,
    coefficient: 0.2,
    icon: 'bx-brain',
    color: 'success',
    chapitres: ['Parcours de graphes', 'Plus court chemin', 'Arbres couvrants'],
  },
  {
    id: 4,
    titre: 'TP Noté - Cryptographie',
    module: 'Sécurité Informatique',
    type: 'TP',
    date: '28 Février 2026',
    duree: '3h',
    statut: 'À venir',
    note: null,
    coefficient: 0.3,
    salle: 'Salle Info 3',
    heure: '9h00',
    icon: 'bx-shield',
    color: 'error',
  },
  {
    id: 5,
    titre: 'Examen - Architecture MVC',
    module: 'Architecture Logicielle',
    type: 'Examen',
    date: '15 Janvier 2026',
    duree: '2h',
    statut: 'Terminé',
    note: 16,
    coefficient: 0.4,
    commentaire: 'Très bon travail, analyse approfondie',
    icon: 'bx-building',
    color: 'secondary',
  },
  {
    id: 6,
    titre: 'Projet - Application Mobile',
    module: 'Développement Mobile',
    type: 'Projet',
    date: '20 Décembre 2025',
    duree: null,
    statut: 'Terminé',
    note: 15.5,
    coefficient: 0.5,
    commentaire: 'Application fonctionnelle et bien documentée',
    icon: 'bx-mobile',
    color: 'info',
  },
]

const selectedTab = ref('a-venir')

const evaluationsAVenir = evaluations.filter(e => e.statut === 'À venir')
const evaluationsEnCours = evaluations.filter(e => e.statut === 'En cours')
const evaluationsTerminees = evaluations.filter(e => e.statut === 'Terminé')

const getTypeIcon = (type) => {
  switch (type) {
    case 'Examen': return 'bx-edit'
    case 'Projet': return 'bx-code-alt'
    case 'Quiz': return 'bx-brain'
    case 'TP': return 'bx-laptop'
    default: return 'bx-file'
  }
}

const getStatutColor = (statut) => {
  switch (statut) {
    case 'À venir': return 'warning'
    case 'En cours': return 'primary'
    case 'Terminé': return 'success'
    default: return 'secondary'
  }
}

const moreList = [
  { title: 'Voir les détails', value: 'Details' },
  { title: 'Ajouter au calendrier', value: 'Calendar' },
  { title: 'Ressources', value: 'Resources' },
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
                  Mes Évaluations 📝
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  Suivez vos examens, projets et quiz
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
                  prepend-icon="bx-calendar"
                >
                  Calendrier
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
              icon="bx-calendar-check"
              color="warning"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ evaluationsAVenir.length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              Évaluations à venir
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-time"
              color="primary"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ evaluationsEnCours.length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              En cours
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-check-circle"
              color="success"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ evaluationsTerminees.length }}
            </h6>
            <p class="text-sm text-medium-emphasis">
              Terminées
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VAvatar
              icon="bx-bar-chart"
              color="info"
              size="48"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-1">
              {{ (evaluationsTerminees.reduce((acc, e) => acc + (e.note || 0), 0) / evaluationsTerminees.length).toFixed(1) }}/20
            </h6>
            <p class="text-sm text-medium-emphasis">
              Moyenne
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
      <VTab value="a-venir">À venir ({{ evaluationsAVenir.length }})</VTab>
      <VTab value="en-cours">En cours ({{ evaluationsEnCours.length }})</VTab>
      <VTab value="terminees">Terminées ({{ evaluationsTerminees.length }})</VTab>
    </VTabs>

    <!-- Tab Content -->
    <VWindow v-model="selectedTab">
      <!-- À venir Tab -->
      <VWindowItem value="a-venir">
        <VRow>
          <VCol
            v-for="eval in evaluationsAVenir"
            :key="eval.id"
            cols="12"
            md="6"
          >
            <VCard>
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center gap-3">
                    <VAvatar
                      :icon="eval.icon"
                      :color="eval.color"
                      size="56"
                      rounded
                      variant="tonal"
                    />
                    <div>
                      <h6 class="text-h6 mb-1">
                        {{ eval.titre }}
                      </h6>
                      <p class="text-sm text-medium-emphasis">
                        {{ eval.module }}
                      </p>
                    </div>
                  </div>
                  <MoreBtn :menu-list="moreList" />
                </div>
              </VCardItem>

              <VCardText>
                <div class="d-flex flex-wrap gap-4 mb-4">
                  <div class="d-flex align-center gap-2">
                    <VIcon icon="bx-calendar" size="18" />
                    <span class="text-sm">{{ eval.date }}</span>
                  </div>
                  <div v-if="eval.duree" class="d-flex align-center gap-2">
                    <VIcon icon="bx-time" size="18" />
                    <span class="text-sm">{{ eval.duree }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <VIcon icon="bx-bar-chart" size="18" />
                    <span class="text-sm">Coef. {{ eval.coefficient }}</span>
                  </div>
                </div>

                <div v-if="eval.salle" class="d-flex align-center gap-2 mb-3">
                  <VIcon icon="bx-door-open" size="18" />
                  <span class="text-sm">{{ eval.salle }} • {{ eval.heure }}</span>
                </div>

                <div v-if="eval.ressources" class="mb-4">
                  <p class="text-sm font-weight-medium mb-2">Ressources à réviser :</p>
                  <div class="d-flex flex-wrap gap-1">
                    <VChip
                      v-for="ressource in eval.ressources"
                      :key="ressource"
                      size="small"
                      variant="tonal"
                    >
                      {{ ressource }}
                    </VChip>
                  </div>
                </div>

                <div v-if="eval.chapitres" class="mb-4">
                  <p class="text-sm font-weight-medium mb-2">Chapitres concernés :</p>
                  <ul class="ps-4">
                    <li v-for="chap in eval.chapitres" :key="chap" class="text-sm">{{ chap }}</li>
                  </ul>
                </div>

                <div class="d-flex gap-2">
                  <VBtn
                    color="primary"
                    size="small"
                    prepend-icon="bx-book-open"
                  >
                    Réviser
                  </VBtn>
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    size="small"
                    prepend-icon="bx-calendar-plus"
                  >
                    Rappel
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

      <!-- En cours Tab -->
      <VWindowItem value="en-cours">
        <VRow>
          <VCol
            v-for="eval in evaluationsEnCours"
            :key="eval.id"
            cols="12"
          >
            <VCard>
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center gap-3">
                    <VAvatar
                      :icon="eval.icon"
                      :color="eval.color"
                      size="56"
                      rounded
                      variant="tonal"
                    />
                    <div>
                      <h6 class="text-h6 mb-1">
                        {{ eval.titre }}
                      </h6>
                      <p class="text-sm text-medium-emphasis">
                        {{ eval.module }}
                      </p>
                    </div>
                  </div>
                  <MoreBtn :menu-list="moreList" />
                </div>
              </VCardItem>

              <VCardText>
                <div class="d-flex align-center gap-4 mb-4">
                  <div class="d-flex align-center gap-2">
                    <VIcon icon="bx-calendar" size="18" />
                    <span class="text-sm">Échéance: {{ eval.date }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <VIcon icon="bx-bar-chart" size="18" />
                    <span class="text-sm">Coef. {{ eval.coefficient }}</span>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-sm font-weight-medium">Progression</span>
                    <span class="text-sm">{{ eval.progression }}%</span>
                  </div>
                  <VProgressLinear
                    :model-value="eval.progression"
                    :color="eval.color"
                    height="8"
                    rounded
                  />
                </div>

                <div v-if="eval.taches" class="mb-4">
                  <p class="text-sm font-weight-medium mb-3">Tâches :</p>
                  <VRow>
                    <VCol
                      v-for="(tache, idx) in eval.taches"
                      :key="idx"
                      cols="12"
                      sm="6"
                    >
                      <div class="d-flex align-center gap-2">
                        <VIcon
                          :icon="tache.complete ? 'bx-check-circle' : 'bx-circle'"
                          :color="tache.complete ? 'success' : 'secondary'"
                          size="18"
                        />
                        <span :class="tache.complete ? 'text-success' : ''" class="text-sm">
                          {{ tache.titre }}
                        </span>
                      </div>
                    </VCol>
                  </VRow>
                </div>

                <div class="d-flex gap-2">
                  <VBtn
                    color="primary"
                    prepend-icon="bx-play"
                  >
                    Continuer
                  </VBtn>
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    prepend-icon="bx-info-circle"
                  >
                    Consignes
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

      <!-- Terminées Tab -->
      <VWindowItem value="terminees">
        <VRow>
          <VCol
            v-for="eval in evaluationsTerminees"
            :key="eval.id"
            cols="12"
            md="6"
          >
            <VCard>
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center gap-3">
                    <VAvatar
                      :icon="eval.icon"
                      :color="eval.color"
                      size="56"
                      rounded
                      variant="tonal"
                    />
                    <div>
                      <h6 class="text-h6 mb-1">
                        {{ eval.titre }}
                      </h6>
                      <p class="text-sm text-medium-emphasis">
                        {{ eval.module }}
                      </p>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="text-h5 mb-1" :class="eval.note >= 10 ? 'text-success' : 'text-error'">
                      {{ eval.note }}/20
                    </div>
                    <div class="text-sm text-medium-emphasis">Coef. {{ eval.coefficient }}</div>
                  </div>
                </div>
              </VCardItem>

              <VCardText>
                <div class="d-flex align-center gap-2 mb-3">
                  <VIcon icon="bx-calendar" size="18" />
                  <span class="text-sm">{{ eval.date }}</span>
                </div>

                <VAlert
                  v-if="eval.commentaire"
                  color="info"
                  variant="tonal"
                  class="mb-3"
                >
                  <div class="d-flex align-center gap-2">
                    <VIcon icon="bx-message-square-detail" size="18" />
                    <span class="text-sm">{{ eval.commentaire }}</span>
                  </div>
                </VAlert>

                <div class="d-flex gap-2">
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    size="small"
                    prepend-icon="bx-file"
                  >
                    Voir le sujet
                  </VBtn>
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    size="small"
                    prepend-icon="bx-download"
                  >
                    Télécharger
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
    </VWindow>
  </div>
</template>
