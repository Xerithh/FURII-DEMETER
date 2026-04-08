<script setup>
const modulesRecommandes = [
  {
    titre: 'Développement Web Avancé',
    description: 'Maîtrisez les technologies modernes du web : React, Vue.js, et les API REST',
    niveau: 'Intermédiaire',
    duree: '40h',
    tags: ['Développement', 'Web', 'Frontend'],
    progression: 0,
    icon: 'bx-code-alt',
    color: 'primary',
    match: 92,
  },
  {
    titre: 'Intelligence Artificielle',
    description: 'Découvrez les fondamentaux du Machine Learning et des réseaux de neurones',
    niveau: 'Avancé',
    duree: '60h',
    tags: ['IA', 'Python', 'Data Science'],
    progression: 0,
    icon: 'bx-brain',
    color: 'success',
    match: 88,
  },
  {
    titre: 'Architecture Logicielle',
    description: 'Concevez des systèmes robustes et scalables avec les design patterns',
    niveau: 'Avancé',
    duree: '35h',
    tags: ['Architecture', 'Design Patterns'],
    progression: 0,
    icon: 'bx-building',
    color: 'info',
    match: 85,
  },
  {
    titre: 'Cybersécurité',
    description: 'Protégez vos applications contre les menaces courantes',
    niveau: 'Intermédiaire',
    duree: '45h',
    tags: ['Sécurité', 'Réseau'],
    progression: 0,
    icon: 'bx-shield',
    color: 'warning',
    match: 80,
  },
  {
    titre: 'DevOps & Cloud',
    description: 'Automatisez vos déploiements avec Docker, Kubernetes et CI/CD',
    niveau: 'Intermédiaire',
    duree: '50h',
    tags: ['DevOps', 'Cloud', 'AWS'],
    progression: 0,
    icon: 'bx-server',
    color: 'error',
    match: 78,
  },
  {
    titre: 'Base de Données Avancées',
    description: 'Optimisez vos requêtes SQL et découvrez le NoSQL',
    niveau: 'Intermédiaire',
    duree: '30h',
    tags: ['SQL', 'NoSQL', 'MongoDB'],
    progression: 0,
    icon: 'bx-data',
    color: 'secondary',
    match: 75,
  },
]

const moreList = [
  { title: 'Voir les détails', value: 'Details' },
  { title: 'Ajouter à mon parcours', value: 'Add' },
  { title: 'Marquer comme vu', value: 'Seen' },
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
                  Modules Suggérés 🎯
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  Basé sur votre profil et vos compétences actuelles, nous avons sélectionné ces modules pour vous
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
                  prepend-icon="bx-refresh"
                >
                  Actualiser
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modules Grid -->
    <VRow>
      <VCol
        v-for="module in modulesRecommandes"
        :key="module.titre"
        cols="12"
        md="6"
        lg="4"
      >
        <VCard>
          <VCardItem>
            <div class="d-flex align-center justify-space-between">
              <VAvatar
                :icon="module.icon"
                :color="module.color"
                size="56"
                rounded
                variant="tonal"
              />
              <MoreBtn :menu-list="moreList" />
            </div>
          </VCardItem>

          <VCardText>
            <div class="d-flex align-center justify-space-between mb-2">
              <h5 class="text-h6">
                {{ module.titre }}
              </h5>
              <VChip
                :color="module.color"
                size="small"
              >
                {{ module.match }}% match
              </VChip>
            </div>
            
            <p class="text-sm text-medium-emphasis mb-4">
              {{ module.description }}
            </p>

            <div class="d-flex flex-wrap gap-2 mb-4">
              <VChip
                v-for="tag in module.tags"
                :key="tag"
                size="small"
                variant="tonal"
              >
                {{ tag }}
              </VChip>
            </div>

            <div class="d-flex align-center justify-space-between text-sm mb-4">
              <div class="d-flex align-center gap-1">
                <VIcon
                  icon="bx-time"
                  size="18"
                />
                <span>{{ module.duree }}</span>
              </div>
              <div class="d-flex align-center gap-1">
                <VIcon
                  icon="bx-medal"
                  size="18"
                />
                <span>{{ module.niveau }}</span>
              </div>
            </div>

            <VProgressLinear
              :model-value="module.progression"
              color="primary"
              height="6"
              rounded
              class="mb-4"
            />

            <div class="d-flex gap-2">
              <VBtn
                block
                color="primary"
              >
                Commencer
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
