<script setup>
const modules = [
  {
    id: 1,
    titre: "Développement Web Frontend",
    code: "DWF-301",
    progression: 75,
    statut: "En cours",
    enseignant: "Marie Dupont",
    duree: "40h",
    credits: 6,
    prochaineCheance: "12 Fév 2026",
    competences: ["HTML5", "CSS3", "JavaScript", "Vue.js"],
    icon: "bx-code-alt",
    color: "primary",
    chapitres: [
      { titre: "Introduction au HTML5", complete: true },
      { titre: "CSS3 Avancé", complete: true },
      { titre: "JavaScript ES6+", complete: false },
      { titre: "Vue.js Fundamentals", complete: false },
    ],
  },
  {
    id: 2,
    titre: "Base de Données Relationnelles",
    code: "BDD-205",
    progression: 90,
    statut: "En cours",
    enseignant: "Jean Martin",
    duree: "35h",
    credits: 5,
    prochaineCheance: "8 Fév 2026",
    competences: ["SQL", "PostgreSQL", "Modélisation"],
    icon: "bx-data",
    color: "primary",
    chapitres: [
      { titre: "Modèle relationnel", complete: true },
      { titre: "SQL avancé", complete: true },
      { titre: "Optimisation", complete: true },
      { titre: "Projet final", complete: false },
    ],
  },
  {
    id: 3,
    titre: "Algorithmique Avancée",
    code: "ALG-402",
    progression: 45,
    statut: "En cours",
    enseignant: "Sophie Bernard",
    duree: "50h",
    credits: 7,
    prochaineCheance: "20 Fév 2026",
    competences: ["Algorithmes", "Structures de données", "Complexité"],
    icon: "bx-brain",
    color: "primary",
    chapitres: [
      { titre: "Tri et recherche", complete: true },
      { titre: "Graphes", complete: true },
      { titre: "Programmation dynamique", complete: false },
      { titre: "Algorithmes gloutons", complete: false },
    ],
  },
  {
    id: 4,
    titre: "Architecture Logicielle",
    code: "ARC-303",
    progression: 100,
    statut: "Terminé",
    enseignant: "Pierre Leroy",
    duree: "45h",
    credits: 6,
    note: "16/20",
    competences: ["Design Patterns", "Architecture", "UML"],
    icon: "bx-building",
    color: "primary",
    chapitres: [
      { titre: "Design Patterns", complete: true },
      { titre: "Architecture MVC", complete: true },
      { titre: "Microservices", complete: true },
      { titre: "Projet final", complete: true },
    ],
  },
  {
    id: 5,
    titre: "Sécurité Informatique",
    code: "SEC-401",
    progression: 20,
    statut: "En cours",
    enseignant: "Claire Dubois",
    duree: "40h",
    credits: 6,
    prochaineCheance: "28 Fév 2026",
    competences: ["Cryptographie", "Sécurité web", "Pentesting"],
    icon: "bx-shield",
    color: "primary",
    chapitres: [
      { titre: "Introduction à la sécurité", complete: true },
      { titre: "Cryptographie", complete: false },
      { titre: "Sécurité des applications", complete: false },
      { titre: "Audit de sécurité", complete: false },
    ],
  },
];
const recherche = ref("");
const filtreStatut = ref("Tous");
const filtreEnseignant = ref("Tous");

const getStatutColor = (statut) => {
  switch (statut) {
    case "Terminé":
      return "primary";
    case "En cours":
      return "primary";
    default:
      return "primary";
  }
};

const statuts = ["Tous", ...new Set(modules.map((module) => module.statut))];
const enseignants = computed(() => [
  "Tous",
  ...new Set(modules.map((module) => module.enseignant)),
]);

const modulesFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return modules.filter((module) => {
    const matchRecherche =
      !terme ||
      module.titre.toLowerCase().includes(terme) ||
      module.code.toLowerCase().includes(terme) ||
      module.enseignant.toLowerCase().includes(terme) ||
      module.competences.some((comp) => comp.toLowerCase().includes(terme));

    const matchStatut =
      filtreStatut.value === "Tous" || module.statut === filtreStatut.value;
    const matchEnseignant =
      filtreEnseignant.value === "Tous" ||
      module.enseignant === filtreEnseignant.value;

    return matchRecherche && matchStatut && matchEnseignant;
  });
});

const reinitialiserFiltres = () => {
  recherche.value = "";
  filtreStatut.value = "Tous";
  filtreEnseignant.value = "Tous";
};
</script>

<template>
  <div>
    <!-- Header Section -->
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div
              class="d-flex align-center justify-space-between flex-wrap gap-4"
            >
              <div>
                <h4 class="text-h4 mb-2">Mes Modules 📚</h4>
                <p class="text-body-1 text-medium-emphasis">
                  Suivez votre progression dans vos modules de formation
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
          placeholder="Ex: SQL, architecture, sécurité..."
          prepend-inner-icon="bx-search"
          clearable
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="3" lg="3">
        <VSelect
          v-model="filtreStatut"
          :items="statuts"
          label="Statut"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="3" lg="3">
        <VSelect
          v-model="filtreEnseignant"
          :items="enseignants"
          label="Enseignant"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>
    </VRow>

    <!-- Modules List -->
    <VRow>
      <VCol
        v-for="module in modulesFiltres"
        :key="module.id"
        cols="12"
        md="6"
        lg="3"
      >
        <VCard>
          <VCardItem>
            <div
              class="d-flex align-center justify-space-between flex-wrap gap-4"
            >
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
                  </div>
                  <p class="text-sm text-medium-emphasis">
                    {{ module.code }} • {{ module.enseignant }}
                  </p>
                </div>
              </div>
            </div>
          </VCardItem>

          <VCardText>
            <!-- Info Grid -->
            <VRow class="mb-4">
              <VCol cols="6" sm="3">
                <div class="d-flex align-center gap-2">
                  <VIcon icon="bx-time" size="20" />
                  <div>
                    <div class="text-sm text-medium-emphasis">Durée</div>
                    <div class="font-weight-medium">
                      {{ module.duree }}
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol cols="6" sm="3">
                <div class="d-flex align-center gap-2">
                  <VIcon icon="bx-trending-up" size="20" />
                  <div>
                    <div class="text-sm text-medium-emphasis">Progression</div>
                    <div class="font-weight-medium">
                      {{ module.progression }}%
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

            <!-- Compétences -->
            <div class="mb-4">
              <p class="text-sm font-weight-medium mb-2">Compétences :</p>
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
            <div class="d-flex">
              <VBtn block color="primary" prepend-icon="bx-play">
                Continuer
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
