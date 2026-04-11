<script setup>
const modulesBibliotheque = [
  {
    id: 1,
    titre: "Développement Web Frontend",
    description:
      "HTML5, CSS3, JavaScript moderne et Vue.js pour construire des interfaces modernes.",
    categorie: "Développement",
    niveau: "Intermédiaire",
    duree: 40,
    format: "Cours + TP",
    langue: "Français",
    popularite: 95,
    noteMoyenne: 4.8,
    tags: ["Vue.js", "JavaScript", "Frontend"],
    icon: "bx-code-alt",
    color: "primary",
  },
  {
    id: 2,
    titre: "Base de Données Relationnelles",
    description:
      "Modélisation, SQL avancé et optimisation des requêtes pour PostgreSQL/MySQL.",
    categorie: "Data",
    niveau: "Intermédiaire",
    duree: 35,
    format: "Cours + Projet",
    langue: "Français",
    popularite: 89,
    noteMoyenne: 4.6,
    tags: ["SQL", "PostgreSQL", "Modélisation"],
    icon: "bx-data",
    color: "primary",
  },
  {
    id: 3,
    titre: "Algorithmique Avancée",
    description:
      "Graphes, complexité, programmation dynamique et techniques d’optimisation.",
    categorie: "Algorithmique",
    niveau: "Avancé",
    duree: 50,
    format: "Cours + Quiz",
    langue: "Français",
    popularite: 84,
    noteMoyenne: 4.5,
    tags: ["Graphes", "Complexité", "Optimisation"],
    icon: "bx-brain",
    color: "primary",
  },
  {
    id: 4,
    titre: "Architecture Logicielle",
    description:
      "Design patterns, architecture en couches, microservices et gouvernance technique.",
    categorie: "Architecture",
    niveau: "Avancé",
    duree: 45,
    format: "Cours + Étude de cas",
    langue: "Français",
    popularite: 86,
    noteMoyenne: 4.7,
    tags: ["Design Patterns", "Microservices", "UML"],
    icon: "bx-building",
    color: "primary",
  },
  {
    id: 5,
    titre: "Cybersécurité Fondamentale",
    description:
      "Principes de sécurité, cryptographie, protection des applications et audit de base.",
    categorie: "Sécurité",
    niveau: "Intermédiaire",
    duree: 42,
    format: "Cours + Atelier",
    langue: "Français",
    popularite: 82,
    noteMoyenne: 4.4,
    tags: ["Sécurité Web", "Cryptographie", "Audit"],
    icon: "bx-shield",
    color: "primary",
  },
  {
    id: 6,
    titre: "DevOps & Cloud",
    description:
      "CI/CD, conteneurs, orchestration et bonnes pratiques de déploiement cloud.",
    categorie: "DevOps",
    niveau: "Intermédiaire",
    duree: 48,
    format: "Cours + Projet",
    langue: "Français",
    popularite: 91,
    noteMoyenne: 4.7,
    tags: ["Docker", "CI/CD", "Cloud"],
    icon: "bx-server",
    color: "primary",
  },
  {
    id: 7,
    titre: "Intelligence Artificielle Appliquée",
    description:
      "ML supervisé, pipelines de données et introduction aux réseaux de neurones.",
    categorie: "IA",
    niveau: "Avancé",
    duree: 60,
    format: "Cours + Lab",
    langue: "Français",
    popularite: 93,
    noteMoyenne: 4.9,
    tags: ["Machine Learning", "Python", "Data"],
    icon: "bx-bot",
    color: "success",
  },
  {
    id: 8,
    titre: "API REST & Intégration",
    description:
      "Conception d’API REST, tests, sécurité et intégration avec des clients front.",
    categorie: "Développement",
    niveau: "Intermédiaire",
    duree: 30,
    format: "Cours + TP",
    langue: "Français",
    popularite: 79,
    noteMoyenne: 4.3,
    tags: ["API", "Backend", "Tests"],
    icon: "bx-link",
    color: "primary",
  },
  {
    id: 9,
    titre: "UX/UI pour Développeurs",
    description:
      "Principes UX, design system et accessibilité pour interfaces web et mobiles.",
    categorie: "Design",
    niveau: "Débutant",
    duree: 24,
    format: "Cours + Atelier",
    langue: "Français",
    popularite: 74,
    noteMoyenne: 4.2,
    tags: ["UX", "UI", "Accessibilité"],
    icon: "bx-palette",
    color: "primary",
  },
  {
    id: 10,
    titre: "Programmation Python",
    description:
      "Bases solides en Python, manipulation de données et scripts d’automatisation.",
    categorie: "Développement",
    niveau: "Débutant",
    duree: 28,
    format: "Cours + Quiz",
    langue: "Français",
    popularite: 88,
    noteMoyenne: 4.6,
    tags: ["Python", "Automatisation", "Scripting"],
    icon: "bx-code-curly",
    color: "primary",
  },
  {
    id: 11,
    titre: "Réseaux Informatiques",
    description:
      "Protocoles réseau, routage, sécurité et troubleshooting d’architectures LAN/WAN.",
    categorie: "Réseaux",
    niveau: "Intermédiaire",
    duree: 36,
    format: "Cours + TP",
    langue: "Français",
    popularite: 71,
    noteMoyenne: 4.1,
    tags: ["TCP/IP", "Routage", "Réseau"],
    icon: "bx-wifi",
    color: "primary",
  },
  {
    id: 12,
    titre: "Gestion de Projet Agile",
    description:
      "Scrum, Kanban, pilotage d’équipe et livraison incrémentale orientée valeur.",
    categorie: "Management",
    niveau: "Débutant",
    duree: 20,
    format: "Cours + Cas pratique",
    langue: "Français",
    popularite: 77,
    noteMoyenne: 4.3,
    tags: ["Scrum", "Kanban", "Produit"],
    icon: "bx-task",
    color: "primary",
  },
];

const recherche = ref("");
const filtreCategorie = ref("Toutes");
const filtreNiveau = ref("Tous");
const filtreDuree = ref("Toutes");

const categories = computed(() => [
  "Toutes",
  ...new Set(modulesBibliotheque.map((module) => module.categorie)),
]);
const niveaux = computed(() => [
  "Tous",
  ...new Set(modulesBibliotheque.map((module) => module.niveau)),
]);
const durees = ["Toutes", "< 30h", "30h - 45h", "> 45h"];

const modulesFiltres = computed(() => {
  return modulesBibliotheque.filter((module) => {
    const terme = recherche.value.trim().toLowerCase();
    const matchRecherche =
      !terme ||
      module.titre.toLowerCase().includes(terme) ||
      module.description.toLowerCase().includes(terme) ||
      module.tags.some((tag) => tag.toLowerCase().includes(terme));

    const matchCategorie =
      filtreCategorie.value === "Toutes" ||
      module.categorie === filtreCategorie.value;
    const matchNiveau =
      filtreNiveau.value === "Tous" || module.niveau === filtreNiveau.value;

    const matchDuree =
      filtreDuree.value === "Toutes" ||
      (filtreDuree.value === "< 30h" && module.duree < 30) ||
      (filtreDuree.value === "30h - 45h" &&
        module.duree >= 30 &&
        module.duree <= 45) ||
      (filtreDuree.value === "> 45h" && module.duree > 45);

    return matchRecherche && matchCategorie && matchNiveau && matchDuree;
  });
});

const modulesPopulaires = computed(
  () => modulesFiltres.value.filter((module) => module.popularite >= 85).length,
);
const noteMoyenneGlobale = computed(() => {
  if (!modulesFiltres.value.length) return "0.0";

  const moyenne =
    modulesFiltres.value.reduce((acc, module) => acc + module.noteMoyenne, 0) /
    modulesFiltres.value.length;

  return moyenne.toFixed(1);
});

const reinitialiserFiltres = () => {
  recherche.value = "";
  filtreCategorie.value = "Toutes";
  filtreNiveau.value = "Tous";
  filtreDuree.value = "Toutes";
};
</script>

<template>
  <div>
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div
              class="d-flex align-center justify-space-between flex-wrap gap-4"
            >
              <div>
                <h4 class="text-h4 mb-2">Bibliothèque de Modules 📚</h4>
                <p class="text-body-1 text-medium-emphasis">
                  Explorez l'ensemble des modules d'apprentissage disponibles et
                  trouvez rapidement les plus pertinents.
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
          placeholder="Ex: Vue.js, SQL, cybersécurité..."
          prepend-inner-icon="bx-search"
          clearable
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="2" lg="2">
        <VSelect
          v-model="filtreCategorie"
          :items="categories"
          label="Catégorie"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="2" lg="2">
        <VSelect
          v-model="filtreNiveau"
          :items="niveaux"
          label="Niveau"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>

      <VCol cols="12" sm="6" md="2" lg="2">
        <VSelect
          v-model="filtreDuree"
          :items="durees"
          label="Durée"
          variant="outlined"
          hide-details="auto"
        />
      </VCol>
    </VRow>

    <VRow>
      <VCol
        v-for="module in modulesFiltres"
        :key="module.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <VCard class="h-100 d-flex flex-column">
          <VCardItem>
            <div class="d-flex align-center justify-space-between gap-3">
              <VAvatar
                :icon="module.icon"
                :color="module.color"
                size="56"
                rounded
                variant="tonal"
              />
              <VChip
                size="small"
                :color="module.popularite >= 85 ? 'primary' : 'secondary'"
              >
                {{ module.popularite }}%
              </VChip>
            </div>
          </VCardItem>

          <VCardText class="d-flex flex-column flex-grow-1">
            <div class="d-flex align-center justify-space-between mb-2 gap-2">
              <h6 class="text-h6 mb-0 text-truncate">
                {{ module.titre }}
              </h6>
              <VChip size="x-small" variant="tonal">
                {{ module.niveau }}
              </VChip>
            </div>

            <p class="text-sm text-medium-emphasis mb-4">
              {{ module.description }}
            </p>

            <div class="d-flex flex-wrap gap-2 mb-4">
              <VChip
                v-for="tag in module.tags"
                :key="tag"
                size="x-small"
                variant="tonal"
              >
                {{ tag }}
              </VChip>
            </div>

            <div class="d-flex align-center justify-space-between text-sm mb-3">
              <span class="d-flex align-center gap-1">
                <VIcon icon="bx-category" size="16" />
                {{ module.categorie }}
              </span>
              <span class="d-flex align-center gap-1">
                <VIcon icon="bx-time" size="16" />
                {{ module.duree }}h
              </span>
            </div>

            <div
              class="d-flex align-center justify-space-between text-sm text-medium-emphasis mb-5"
            >
              <span>{{ module.format }}</span>
              <span>{{ module.langue }}</span>
            </div>

            <div class="mt-auto d-flex gap-2">
              <VBtn block color="primary"> Voir le module </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol v-if="!modulesFiltres.length" cols="12">
        <VCard>
          <VCardText class="py-10 text-center">
            <VAvatar
              icon="bx-search-alt"
              color="primary"
              size="56"
              rounded
              variant="tonal"
              class="mb-4"
            />
            <h6 class="text-h6 mb-2">
              Aucun module ne correspond aux filtres actuels
            </h6>
            <p class="text-medium-emphasis mb-4">
              Essayez d'élargir votre recherche ou de réinitialiser les filtres.
            </p>
            <VBtn
              color="primary"
              variant="tonal"
              prepend-icon="bx-reset"
              @click="reinitialiserFiltres"
            >
              Réinitialiser les filtres
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
