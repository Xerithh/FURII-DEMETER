<script setup>
const modules = [
  {
    id: 1,
    titre: 'Développement Web Frontend',
    code: 'DWF-301',
    progression: 75,
    statut: 'En cours',
    enseignant: 'Marie Dupont',
    duree: '40h',
    credits: 6,
    prochaineCheance: '12 Fév 2026',
    competences: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js'],
    icon: 'bx-code-alt',
    color: 'primary',
    chapitres: [
      { titre: 'Introduction au HTML5', complete: true },
      { titre: 'CSS3 Avancé', complete: true },
      { titre: 'JavaScript ES6+', complete: false },
      { titre: 'Vue.js Fundamentals', complete: false },
    ],
  },
  {
    id: 2,
    titre: 'Base de Données Relationnelles',
    code: 'BDD-205',
    progression: 90,
    statut: 'En cours',
    enseignant: 'Jean Martin',
    duree: '35h',
    credits: 5,
    prochaineCheance: '8 Fév 2026',
    competences: ['SQL', 'PostgreSQL', 'Modélisation'],
    icon: 'bx-data',
    color: 'info',
    chapitres: [
      { titre: 'Modèle relationnel', complete: true },
      { titre: 'SQL avancé', complete: true },
      { titre: 'Optimisation', complete: true },
      { titre: 'Projet final', complete: false },
    ],
  },
  {
    id: 3,
    titre: 'Algorithmique Avancée',
    code: 'ALG-402',
    progression: 45,
    statut: 'En cours',
    enseignant: 'Sophie Bernard',
    duree: '50h',
    credits: 7,
    prochaineCheance: '20 Fév 2026',
    competences: ['Algorithmes', 'Structures de données', 'Complexité'],
    icon: 'bx-brain',
    color: 'success',
    chapitres: [
      { titre: 'Tri et recherche', complete: true },
      { titre: 'Graphes', complete: true },
      { titre: 'Programmation dynamique', complete: false },
      { titre: 'Algorithmes gloutons', complete: false },
    ],
  },
  {
    id: 4,
    titre: 'Architecture Logicielle',
    code: 'ARC-303',
    progression: 100,
    statut: 'Terminé',
    enseignant: 'Pierre Leroy',
    duree: '45h',
    credits: 6,
    note: '16/20',
    competences: ['Design Patterns', 'Architecture', 'UML'],
    icon: 'bx-building',
    color: 'secondary',
    chapitres: [
      { titre: 'Design Patterns', complete: true },
      { titre: 'Architecture MVC', complete: true },
      { titre: 'Microservices', complete: true },
      { titre: 'Projet final', complete: true },
    ],
  },
  {
    id: 5,
    titre: 'Sécurité Informatique',
    code: 'SEC-401',
    progression: 20,
    statut: 'En cours',
    enseignant: 'Claire Dubois',
    duree: '40h',
    credits: 6,
    prochaineCheance: '28 Fév 2026',
    competences: ['Cryptographie', 'Sécurité web', 'Pentesting'],
    icon: 'bx-shield',
    color: 'warning',
    chapitres: [
      { titre: 'Introduction à la sécurité', complete: true },
      { titre: 'Cryptographie', complete: false },
      { titre: 'Sécurité des applications', complete: false },
      { titre: 'Audit de sécurité', complete: false },
    ],
  },
]

const getStatutColor = statut => {
  switch (statut) {
  case 'Terminé': return 'success'
  case 'En cours': return 'primary'
  default: return 'secondary'
  }
}

const moreList = [
  { title: 'Voir le contenu', value: 'Content' },
  { title: 'Planning', value: 'Schedule' },
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
                  Mes Modules 📚
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  Suivez votre progression dans vos modules de formation
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

    <!-- Modules List -->
    <VRow>
      <VCol
        v-for="module in modules"
        :key="module.id"
        cols="12"
      >
        <VCard>
          <VCardItem>
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div class="d-flex align-center gap-4">
                <VAvatar
                  :icon="module.icon"
                  :color="module.color"
                  size="64"
                  rounded
                  variant="tonal"
                />
                <div>
                  <div class="d-flex align-center gap-2 mb-1">
                    <h5 class="text-h5">
                      {{ module.titre }}
                    </h5>
                    <VChip
                      :color="getStatutColor(module.statut)"
                      size="small"
                    >
                      {{ module.statut }}
                    </VChip>
                  </div>
                  <p class="text-sm text-medium-emphasis">
                    {{ module.code }} • {{ module.enseignant }}
                  </p>
                </div>
              </div>
              <MoreBtn :menu-list="moreList" />
            </div>
          </VCardItem>

          <VCardText>
            <!-- Info Grid -->
            <VRow class="mb-4">
              <VCol
                cols="6"
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
                      {{ module.duree }}
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                cols="6"
                sm="3"
              >
                <div class="d-flex align-center gap-2">
                  <VIcon
                    icon="bx-award"
                    size="20"
                  />
                  <div>
                    <div class="text-sm text-medium-emphasis">
                      Crédits
                    </div>
                    <div class="font-weight-medium">
                      {{ module.credits }} ECTS
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                cols="6"
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
                      {{ module.progression }}%
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                cols="6"
                sm="3"
              >
                <div class="d-flex align-center gap-2">
                  <VIcon
                    :icon="module.note ? 'bx-check-circle' : 'bx-calendar'"
                    size="20"
                  />
                  <div>
                    <div class="text-sm text-medium-emphasis">
                      {{ module.note ? 'Note' : 'Échéance' }}
                    </div>
                    <div class="font-weight-medium">
                      {{ module.note || module.prochaineCheance }}
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>

            <!-- Progress Bar -->
            <VProgressLinear
              :model-value="module.progression"
              :color="module.color"
              height="8"
              rounded
              class="mb-4"
            />

            <!-- Chapitres -->
            <div class="mb-4">
              <p class="text-sm font-weight-medium mb-3">
                Chapitres :
              </p>
              <VRow>
                <VCol
                  v-for="(chapitre, idx) in module.chapitres"
                  :key="idx"
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <div class="d-flex align-center gap-2">
                    <VIcon
                      :icon="chapitre.complete ? 'bx-check-circle' : 'bx-circle'"
                      :color="chapitre.complete ? 'success' : 'secondary'"
                      size="18"
                    />
                    <span
                      :class="chapitre.complete ? 'text-success' : 'text-medium-emphasis'"
                      class="text-sm"
                    >
                      {{ chapitre.titre }}
                    </span>
                  </div>
                </VCol>
              </VRow>
            </div>

            <!-- Compétences -->
            <div class="mb-4">
              <p class="text-sm font-weight-medium mb-2">
                Compétences :
              </p>
              <div class="d-flex flex-wrap gap-2">
                <VChip
                  v-for="comp in module.competences"
                  :key="comp"
                  size="small"
                  :color="module.color"
                  variant="tonal"
                >
                  {{ comp }}
                </VChip>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2">
              <VBtn
                v-if="module.statut !== 'Terminé'"
                color="primary"
                prepend-icon="bx-play"
              >
                Continuer
              </VBtn>
              <VBtn
                v-else
                variant="tonal"
                color="success"
                prepend-icon="bx-download"
              >
                Certificat
              </VBtn>
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="bx-info-circle"
              >
                Détails
              </VBtn>
              <VBtn
                variant="tonal"
                icon="bx-bookmark"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
