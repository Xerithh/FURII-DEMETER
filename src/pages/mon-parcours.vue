<script setup>
import { ref } from 'vue'

const parcours = {
  titre: 'Ingénieur Logiciel Full-Stack',
  progression: 68,
  annee: '2ème année',
  specialite: 'Informatique',
  dateDebut: 'Sept 2024',
  dateFin: 'Juin 2026',
}

const semestres = [
  {
    nom: 'Semestre 3',
    statut: 'Terminé',
    moyenne: 15.2,
    credits: 30,
    creditsObtenus: 30,
    modules: [
      { nom: 'Architecture Logicielle', note: 16, credits: 6, statut: 'validé' },
      { nom: 'Base de Données', note: 15, credits: 5, statut: 'validé' },
      { nom: 'Réseaux', note: 14, credits: 5, statut: 'validé' },
      { nom: 'Gestion de Projet', note: 16, credits: 4, statut: 'validé' },
      { nom: 'Anglais Technique', note: 15, credits: 3, statut: 'validé' },
      { nom: 'Développement Mobile', note: 15.5, credits: 7, statut: 'validé' },
    ],
  },
  {
    nom: 'Semestre 4',
    statut: 'En cours',
    moyenne: 14.8,
    credits: 30,
    creditsObtenus: 18,
    modules: [
      { nom: 'Développement Web Frontend', note: 'En cours', credits: 6, statut: 'en-cours', progression: 75 },
      { nom: 'Base de Données Relationnelles', note: 'En cours', credits: 5, statut: 'en-cours', progression: 90 },
      { nom: 'Algorithmique Avancée', note: 'En cours', credits: 7, statut: 'en-cours', progression: 45 },
      { nom: 'Sécurité Informatique', note: 'En cours', credits: 6, statut: 'en-cours', progression: 20 },
      { nom: 'DevOps & Cloud', note: null, credits: 6, statut: 'à-venir', progression: 0 },
    ],
  },
  {
    nom: 'Semestre 5',
    statut: 'À venir',
    credits: 30,
    modules: [
      { nom: 'Intelligence Artificielle', credits: 7, statut: 'à-venir' },
      { nom: 'Big Data & Analytics', credits: 6, statut: 'à-venir' },
      { nom: 'Blockchain', credits: 5, statut: 'à-venir' },
      { nom: 'Projet Professionnel', credits: 8, statut: 'à-venir' },
      { nom: 'Management', credits: 4, statut: 'à-venir' },
    ],
  },
]

const competencesAcquises = [
  { nom: 'Frontend Development', niveau: 85, color: 'primary' },
  { nom: 'Backend Development', niveau: 78, color: 'success' },
  { nom: 'Base de Données', niveau: 90, color: 'info' },
  { nom: 'Architecture', niveau: 82, color: 'warning' },
  { nom: 'DevOps', niveau: 65, color: 'error' },
  { nom: 'Gestion de Projet', niveau: 75, color: 'secondary' },
]

const objectifs = [
  {
    titre: 'Valider le semestre 4',
    progression: 68,
    echeance: 'Juin 2026',
    sousObjectifs: [
      { titre: 'Moyenne >= 12/20', atteint: true },
      { titre: 'Tous les modules validés', atteint: false },
      { titre: 'Stage trouvé', atteint: false },
    ],
  },
  {
    titre: 'Obtenir une certification AWS',
    progression: 40,
    echeance: 'Mars 2026',
    sousObjectifs: [
      { titre: 'Formation complétée', atteint: false },
      { titre: 'Examen blanc réussi', atteint: false },
      { titre: 'Inscription à l\'examen', atteint: true },
    ],
  },
  {
    titre: 'Projet personnel Full-Stack',
    progression: 55,
    echeance: 'Mai 2026',
    sousObjectifs: [
      { titre: 'Backend API terminé', atteint: true },
      { titre: 'Frontend en cours', atteint: false },
      { titre: 'Déploiement', atteint: false },
    ],
  },
]

const selectedTab = ref('progression')
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
                  Mon Parcours 🎓
                </h4>
                <p class="text-body-1 text-medium-emphasis">
                  {{ parcours.titre }} • {{ parcours.annee }}
                </p>
              </div>
              <div class="d-flex gap-2">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="bx-download"
                >
                  Télécharger le relevé
                </VBtn>
                <VBtn
                  color="primary"
                  prepend-icon="bx-calendar"
                >
                  Planning
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
      <VTab value="progression">
        Progression par semestre
      </VTab>
      <VTab value="competences">
        Compétences
      </VTab>
      <VTab value="objectifs">
        Objectifs
      </VTab>
    </VTabs>

    <!-- Tab Content -->
    <VWindow v-model="selectedTab">
      <!-- Progression Tab -->
      <VWindowItem value="progression">
        <VRow>
          <VCol
            v-for="(semestre, idx) in semestres"
            :key="idx"
            cols="12"
          >
            <VCard>
              <VCardItem>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <h5 class="text-h5 mb-1">
                      {{ semestre.nom }}
                    </h5>
                    <VChip
                      :color="semestre.statut === 'Terminé' ? 'success' : semestre.statut === 'En cours' ? 'primary' : 'secondary'"
                      size="small"
                    >
                      {{ semestre.statut }}
                    </VChip>
                  </div>
                  <div
                    v-if="semestre.moyenne"
                    class="text-end"
                  >
                    <div class="text-h5 mb-1">
                      {{ semestre.moyenne }}/20
                    </div>
                    <div class="text-sm text-medium-emphasis">
                      Moyenne
                    </div>
                  </div>
                </div>
              </VCardItem>

              <VCardText>
                <div class="d-flex align-center gap-4 mb-4">
                  <div>
                    <VIcon
                      icon="bx-award"
                      size="20"
                    />
                    <span class="ms-2">{{ semestre.creditsObtenus || 0 }}/{{ semestre.credits }} crédits</span>
                  </div>
                  <VProgressLinear
                    :model-value="((semestre.creditsObtenus || 0) / semestre.credits) * 100"
                    color="success"
                    height="6"
                    rounded
                    class="flex-grow-1"
                  />
                </div>

                <VTable density="compact">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>Crédits</th>
                      <th>Note/Progression</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(module, midx) in semestre.modules"
                      :key="midx"
                    >
                      <td>{{ module.nom }}</td>
                      <td>{{ module.credits }} ECTS</td>
                      <td>
                        <span v-if="typeof module.note === 'number'">{{ module.note }}/20</span>
                        <div
                          v-else-if="module.progression !== undefined"
                          class="d-flex align-center gap-2"
                        >
                          <VProgressLinear
                            :model-value="module.progression"
                            color="primary"
                            height="6"
                            rounded
                            style="min-width: 100px"
                          />
                          <span class="text-sm">{{ module.progression }}%</span>
                        </div>
                        <span
                          v-else
                          class="text-medium-emphasis"
                        >-</span>
                      </td>
                      <td>
                        <VChip
                          :color="module.statut === 'validé' ? 'success' : module.statut === 'en-cours' ? 'warning' : 'secondary'"
                          size="x-small"
                        >
                          {{ module.statut }}
                        </VChip>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

      <!-- Compétences Tab -->
      <VWindowItem value="competences">
        <VRow>
          <VCol cols="12">
            <VCard title="Compétences acquises">
              <VCardText>
                <VRow>
                  <VCol
                    v-for="(comp, idx) in competencesAcquises"
                    :key="idx"
                    cols="12"
                    md="6"
                  >
                    <div class="mb-4">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="font-weight-medium">{{ comp.nom }}</span>
                        <span class="text-sm">{{ comp.niveau }}%</span>
                      </div>
                      <VProgressLinear
                        :model-value="comp.niveau"
                        :color="comp.color"
                        height="10"
                        rounded
                      />
                    </div>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>

      <!-- Objectifs Tab -->
      <VWindowItem value="objectifs">
        <VRow>
          <VCol
            v-for="(obj, idx) in objectifs"
            :key="idx"
            cols="12"
            md="6"
          >
            <VCard>
              <VCardItem>
                <h5 class="text-h6 mb-2">
                  {{ obj.titre }}
                </h5>
                <div class="d-flex align-center gap-2 mb-3">
                  <VIcon
                    icon="bx-calendar"
                    size="16"
                  />
                  <span class="text-sm text-medium-emphasis">Échéance: {{ obj.echeance }}</span>
                </div>
                <VProgressLinear
                  :model-value="obj.progression"
                  color="primary"
                  height="8"
                  rounded
                  class="mb-3"
                />
              </VCardItem>

              <VCardText>
                <p class="text-sm font-weight-medium mb-2">
                  Sous-objectifs :
                </p>
                <div
                  v-for="(sousObj, sidx) in obj.sousObjectifs"
                  :key="sidx"
                  class="d-flex align-center gap-2 mb-2"
                >
                  <VIcon
                    :icon="sousObj.atteint ? 'bx-check-circle' : 'bx-circle'"
                    :color="sousObj.atteint ? 'success' : 'secondary'"
                    size="20"
                  />
                  <span :class="sousObj.atteint ? 'text-success' : ''">{{ sousObj.titre }}</span>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
    </VWindow>
  </div>
</template>
