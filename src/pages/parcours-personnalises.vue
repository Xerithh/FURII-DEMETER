<script setup>
const parcours = [
  {
    titre: 'Expert Full-Stack',
    description: 'Devenez un développeur complet maîtrisant frontend, backend et bases de données',
    modules: 8,
    duree: '6 mois',
    niveau: 'Intermédiaire à Avancé',
    progression: 35,
    competences: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    icon: 'bx-code-alt',
    color: 'primary',
    etapes: [
      { titre: 'Fondamentaux JavaScript', statut: 'completed' },
      { titre: 'React Avancé', statut: 'completed' },
      { titre: 'API REST avec Node.js', statut: 'in-progress' },
      { titre: 'Bases de données', statut: 'locked' },
      { titre: 'DevOps & Déploiement', statut: 'locked' },
    ],
  },
  {
    titre: 'Data Scientist',
    description: 'Analysez et exploitez vos données avec Python et les outils de Machine Learning',
    modules: 10,
    duree: '8 mois',
    niveau: 'Avancé',
    progression: 15,
    competences: ['Python', 'TensorFlow', 'Pandas', 'SQL'],
    icon: 'bx-chart',
    color: 'success',
    etapes: [
      { titre: 'Python pour la Data', statut: 'completed' },
      { titre: 'Statistiques Appliquées', statut: 'in-progress' },
      { titre: 'Machine Learning', statut: 'locked' },
      { titre: 'Deep Learning', statut: 'locked' },
      { titre: 'Projet Final', statut: 'locked' },
    ],
  },
  {
    titre: 'Architecte Cloud',
    description: 'Concevez et déployez des infrastructures cloud scalables et sécurisées',
    modules: 6,
    duree: '5 mois',
    niveau: 'Avancé',
    progression: 0,
    competences: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    icon: 'bx-cloud',
    color: 'info',
    etapes: [
      { titre: 'Fondamentaux Cloud', statut: 'locked' },
      { titre: 'Infrastructure as Code', statut: 'locked' },
      { titre: 'Conteneurisation', statut: 'locked' },
      { titre: 'Orchestration', statut: 'locked' },
      { titre: 'Sécurité Cloud', statut: 'locked' },
    ],
  },
]

const getStatutColor = statut => {
  switch (statut) {
  case 'completed': return 'success'
  case 'in-progress': return 'warning'
  default: return 'secondary'
  }
}

const getStatutIcon = statut => {
  switch (statut) {
  case 'completed': return 'bx-check-circle'
  case 'in-progress': return 'bx-time'
  default: return 'bx-lock'
  }
}

const moreList = [
  { title: 'Reprendre', value: 'Resume' },
  { title: 'Voir le programme', value: 'Program' },
  { title: 'Partager', value: 'Share' },
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
                  Parcours Personnalisés 🚀
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  Des programmes complets adaptés à vos objectifs professionnels
                </p>
              </div>
              <div class="d-flex gap-2">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="bx-plus"
                >
                  Créer un parcours
                </VBtn>
                <VBtn
                  color="primary"
                  prepend-icon="bx-search"
                >
                  Explorer
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Parcours Cards -->
    <VRow>
      <VCol
        v-for="(p, index) in parcours"
        :key="index"
        cols="12"
      >
        <VCard>
          <VCardItem>
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div class="d-flex align-center gap-4">
                <VAvatar
                  :icon="p.icon"
                  :color="p.color"
                  size="64"
                  rounded
                  variant="tonal"
                />
                <div>
                  <h5 class="text-h5 mb-1">
                    {{ p.titre }}
                  </h5>
                  <p class="text-sm text-medium-emphasis">
                    {{ p.description }}
                  </p>
                </div>
              </div>
              <MoreBtn :menu-list="moreList" />
            </div>
          </VCardItem>

          <VCardText>
            <!-- Info Row -->
            <VRow class="mb-4">
              <VCol
                cols="12"
                sm="3"
              >
                <div class="d-flex align-center gap-2">
                  <VIcon
                    icon="bx-book"
                    size="20"
                  />
                  <div>
                    <div class="text-sm text-medium-emphasis">
                      Modules
                    </div>
                    <div class="font-weight-medium">
                      {{ p.modules }}
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                cols="12"
                sm="3"
              >
                <div class="d-flex align-center gap-2">
                  <VIcon
                    icon="bx-time"
                    size="20"
                  />
                  <div>
                    <div class="text-sm text-medium-emphasis">
                      Durée
                    </div>
                    <div class="font-weight-medium">
                      {{ p.duree }}
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                cols="12"
                sm="3"
              >
                <div class="d-flex align-center gap-2">
                  <VIcon
                    icon="bx-medal"
                    size="20"
                  />
                  <div>
                    <div class="text-sm text-medium-emphasis">
                      Niveau
                    </div>
                    <div class="font-weight-medium">
                      {{ p.niveau }}
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                cols="12"
                sm="3"
              >
                <div class="d-flex align-center gap-2">
                  <VIcon
                    icon="bx-trending-up"
                    size="20"
                  />
                  <div>
                    <div class="text-sm text-medium-emphasis">
                      Progression
                    </div>
                    <div class="font-weight-medium">
                      {{ p.progression }}%
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>

            <!-- Progress Bar -->
            <VProgressLinear
              :model-value="p.progression"
              :color="p.color"
              height="8"
              rounded
              class="mb-4"
            />

            <!-- Compétences -->
            <div class="mb-4">
              <p class="text-sm font-weight-medium mb-2">
                Compétences acquises :
              </p>
              <div class="d-flex flex-wrap gap-2">
                <VChip
                  v-for="comp in p.competences"
                  :key="comp"
                  size="small"
                  :color="p.color"
                  variant="tonal"
                >
                  {{ comp }}
                </VChip>
              </div>
            </div>

            <!-- Étapes du parcours -->
            <div class="mb-4">
              <p class="text-sm font-weight-medium mb-3">
                Étapes du parcours :
              </p>
              <VTimeline
                side="end"
                align="start"
                density="compact"
                truncate-line="both"
              >
                <VTimelineItem
                  v-for="(etape, idx) in p.etapes"
                  :key="idx"
                  :dot-color="getStatutColor(etape.statut)"
                  size="small"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-2">
                      <VIcon
                        :icon="getStatutIcon(etape.statut)"
                        size="18"
                        :color="getStatutColor(etape.statut)"
                      />
                      <span :class="etape.statut === 'locked' ? 'text-medium-emphasis' : ''">
                        {{ etape.titre }}
                      </span>
                    </div>
                    <VChip
                      v-if="etape.statut === 'in-progress'"
                      color="warning"
                      size="x-small"
                    >
                      En cours
                    </VChip>
                  </div>
                </VTimelineItem>
              </VTimeline>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2">
              <VBtn
                v-if="p.progression > 0"
                color="primary"
                prepend-icon="bx-play"
              >
                Continuer
              </VBtn>
              <VBtn
                v-else
                color="primary"
                prepend-icon="bx-rocket"
              >
                Commencer
              </VBtn>
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="bx-info-circle"
              >
                Détails
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
