<script setup>
const categories = [
  {
    titre: 'Articles & Tutoriels',
    icon: 'bx-file',
    color: 'primary',
    count: 24,
    ressources: [
      {
        titre: 'Guide complet de Vue 3 Composition API',
        type: 'Article',
        duree: '15 min',
        auteur: 'Marie Dupont',
        tags: ['Vue.js', 'Frontend'],
        difficulte: 'Intermédiaire',
      },
      {
        titre: 'Les Design Patterns en JavaScript',
        type: 'Tutoriel',
        duree: '30 min',
        auteur: 'Jean Martin',
        tags: ['JavaScript', 'Architecture'],
        difficulte: 'Avancé',
      },
      {
        titre: 'Introduction à Docker pour les débutants',
        type: 'Article',
        duree: '20 min',
        auteur: 'Sophie Bernard',
        tags: ['DevOps', 'Docker'],
        difficulte: 'Débutant',
      },
    ],
  },
  {
    titre: 'Vidéos & Webinaires',
    icon: 'bx-video',
    color: 'error',
    count: 18,
    ressources: [
      {
        titre: 'Masterclass: Architecture Microservices',
        type: 'Webinaire',
        duree: '1h 30min',
        auteur: 'Pierre Leroy',
        tags: ['Architecture', 'Microservices'],
        difficulte: 'Avancé',
      },
      {
        titre: 'Machine Learning avec Python',
        type: 'Vidéo',
        duree: '45 min',
        auteur: 'Claire Dubois',
        tags: ['Python', 'ML'],
        difficulte: 'Intermédiaire',
      },
      {
        titre: 'Les bases de Git et GitHub',
        type: 'Vidéo',
        duree: '25 min',
        auteur: 'Thomas Petit',
        tags: ['Git', 'Versioning'],
        difficulte: 'Débutant',
      },
    ],
  },
  {
    titre: 'Exercices & Challenges',
    icon: 'bx-code',
    color: 'success',
    count: 32,
    ressources: [
      {
        titre: 'Challenge: Algorithmes de tri',
        type: 'Exercice',
        duree: '1h',
        auteur: 'Plateforme AUXO',
        tags: ['Algorithmes', 'Python'],
        difficulte: 'Intermédiaire',
      },
      {
        titre: 'Quiz: Sécurité des applications web',
        type: 'Quiz',
        duree: '30 min',
        auteur: 'Plateforme AUXO',
        tags: ['Sécurité', 'Web'],
        difficulte: 'Avancé',
      },
      {
        titre: 'TP: Créer une API REST',
        type: 'Projet',
        duree: '2h',
        auteur: 'Marc Rousseau',
        tags: ['API', 'Backend'],
        difficulte: 'Intermédiaire',
      },
    ],
  },
  {
    titre: 'Documentation & Références',
    icon: 'bx-book-bookmark',
    color: 'warning',
    count: 15,
    ressources: [
      {
        titre: 'Documentation officielle React 18',
        type: 'Documentation',
        duree: 'Référence',
        auteur: 'React Team',
        tags: ['React', 'Frontend'],
        difficulte: 'Tous niveaux',
      },
      {
        titre: 'Cheat Sheet TypeScript',
        type: 'Référence',
        duree: '5 min',
        auteur: 'Communauté',
        tags: ['TypeScript'],
        difficulte: 'Tous niveaux',
      },
      {
        titre: 'Guide des bonnes pratiques CSS',
        type: 'Guide',
        duree: '20 min',
        auteur: 'Emma Laurent',
        tags: ['CSS', 'Frontend'],
        difficulte: 'Intermédiaire',
      },
    ],
  },
]

const getDifficulteColor = difficulte => {
  switch (difficulte) {
  case 'Débutant': return 'success'
  case 'Intermédiaire': return 'warning'
  case 'Avancé': return 'error'
  default: return 'info'
  }
}

const moreList = [
  { title: 'Ouvrir', value: 'Open' },
  { title: 'Ajouter aux favoris', value: 'Favorite' },
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
                  Ressources Complémentaires 📚
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  Une bibliothèque complète pour approfondir vos connaissances
                </p>
              </div>
              <div class="d-flex gap-2">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="bx-filter"
                >
                  Filtrer
                </VBtn>
                <VBtn
                  color="primary"
                  prepend-icon="bx-search"
                >
                  Rechercher
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Ressources par catégorie -->
    <VRow>
      <VCol
        v-for="cat in categories"
        :key="cat.titre"
        cols="12"
      >
        <VCard>
          <VCardItem>
            <div class="d-flex align-center gap-3">
              <VAvatar
                :icon="cat.icon"
                :color="cat.color"
                size="48"
                rounded
                variant="tonal"
              />
              <div>
                <h5 class="text-h5">
                  {{ cat.titre }}
                </h5>
                <p class="text-sm text-medium-emphasis">
                  {{ cat.count }} ressources disponibles
                </p>
              </div>
            </div>
          </VCardItem>

          <VCardText>
            <VRow>
              <VCol
                v-for="(ressource, idx) in cat.ressources"
                :key="idx"
                cols="12"
                md="4"
              >
                <VCard variant="tonal">
                  <VCardItem>
                    <div class="d-flex align-center justify-space-between">
                      <VChip
                        :color="cat.color"
                        size="small"
                      >
                        {{ ressource.type }}
                      </VChip>
                      <MoreBtn
                        :menu-list="moreList"
                        size="small"
                      />
                    </div>
                  </VCardItem>

                  <VCardText>
                    <h6 class="text-h6 mb-3">
                      {{ ressource.titre }}
                    </h6>

                    <div class="d-flex align-center justify-space-between text-sm mb-3">
                      <div class="d-flex align-center gap-1">
                        <VIcon
                          icon="bx-time"
                          size="16"
                        />
                        <span>{{ ressource.duree }}</span>
                      </div>
                      <VChip
                        :color="getDifficulteColor(ressource.difficulte)"
                        size="x-small"
                      >
                        {{ ressource.difficulte }}
                      </VChip>
                    </div>

                    <div class="d-flex align-center gap-1 text-sm mb-3">
                      <VIcon
                        icon="bx-user"
                        size="16"
                      />
                      <span class="text-medium-emphasis">{{ ressource.auteur }}</span>
                    </div>

                    <div class="d-flex flex-wrap gap-1 mb-4">
                      <VChip
                        v-for="tag in ressource.tags"
                        :key="tag"
                        size="x-small"
                        variant="outlined"
                      >
                        {{ tag }}
                      </VChip>
                    </div>

                    <VBtn
                      block
                      :color="cat.color"
                      size="small"
                      prepend-icon="bx-play-circle"
                    >
                      Accéder
                    </VBtn>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <VBtn
              variant="tonal"
              :color="cat.color"
              class="mt-4"
              block
              prepend-icon="bx-plus"
            >
              Voir toutes les {{ cat.titre.toLowerCase() }}
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
