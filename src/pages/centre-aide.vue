<script setup>
import { computed, ref } from "vue";

const recherche = ref("");
const filtreCategorie = ref("");

const faqCategories = [
  { label: "Comprendre ISISU", color: "primary" },
  { label: "Recommandations", color: "success" },
  { label: "Quiz", color: "info" },
  { label: "Parcours & Modules", color: "warning" },
  { label: "VAE", color: "secondary" },
];

const categories = [
  { title: "Toutes les catégories", value: "" },
  { title: "Comprendre ISISU", value: "Comprendre ISISU" },
  { title: "Recommandations", value: "Recommandations" },
  { title: "Quiz", value: "Quiz" },
  { title: "Quiz & Évaluations", value: "Quiz & Évaluations" },
  { title: "Parcours & Modules", value: "Parcours & Modules" },
  { title: "VAE", value: "VAE" },
];

// `niveaux` and `durees` removed as per UI change

const faqItems = [
  {
    question: "Qu'est-ce que le projet ISISU ?",
    category: "Comprendre ISISU",
    level: "beginner",
    duration: "short",
    answer:
      "ISISU est une plateforme d'apprentissage personnalisé qui aide à choisir, suivre et valider les bons modules en fonction de votre profil. L'objectif est de structurer votre progression et de rendre vos acquis visibles tout au long du parcours.",
  },
  {
    question: "À qui s'adresse ISISU ?",
    category: "Comprendre ISISU",
    level: "beginner",
    duration: "short",
    answer:
      "La plateforme cible les apprenants qui souhaitent avancer avec un accompagnement plus individualisé. Elle est utile si vous voulez identifier vos priorités, renforcer certaines compétences et garder une vue claire de votre progression.",
  },
  {
    question: "Comment avoir accès aux modules recommandés ?",
    category: "Recommandations",
    level: "intermediate",
    duration: "short",
    answer:
      "Le point de départ est de réaliser les quiz disponibles (UE, matière ou aléatoire). Vos résultats alimentent la recommandation, puis vous pouvez consulter la page “Modules suggérés” pour démarrer les contenus les plus adaptés à votre situation.",
  },
  {
    question: "Pourquoi faut-il faire les quiz avant les recommandations ?",
    category: "Quiz & Évaluations",
    level: "intermediate",
    duration: "medium",
    answer:
      "Les quiz servent à estimer votre niveau sur des thèmes précis. Plus vos réponses reflètent votre niveau réel, plus les recommandations de modules et de parcours sont pertinentes pour éviter de revoir des notions déjà maîtrisées ou de sauter des bases.",
  },
  {
    question:
      "Quelle différence entre “Modules suggérés” et “Parcours personnalisés” ?",
    category: "Recommandations",
    level: "intermediate",
    duration: "medium",
    answer:
      "Les modules suggérés sont des recommandations unitaires (un module à la fois). Les parcours personnalisés organisent ces modules en chemin cohérent avec des étapes et des objectifs progressifs.",
  },
  {
    question: "Où suivre mes modules en cours ?",
    category: "Parcours & Modules",
    level: "beginner",
    duration: "short",
    answer:
      "Dans “Mes Modules”, vous retrouvez vos modules actifs, leur progression, les échéances et les indicateurs de statut. C'est l'espace principal pour piloter votre apprentissage semaine après semaine.",
  },
  {
    question: "Où retrouver mes évaluations et résultats de quiz ?",
    category: "Quiz",
    level: "intermediate",
    duration: "short",
    answer:
      "Les quiz sont accessibles depuis la section dédiée dans le menu. Vous pouvez y suivre vos résultats et priorités de révision.",
  },
  {
    question: "Qu'est-ce que la plateforme permet concrètement ?",
    category: "Comprendre ISISU",
    level: "intermediate",
    duration: "medium",
    answer:
      "ISISU permet de mieux cibler vos efforts, de suivre votre progression, d'organiser un parcours plus cohérent et de valoriser vos acquis. Elle offre un cadre pratique pour transformer des résultats de quiz en actions d'apprentissage utiles.",
  },
  {
    question: "En quoi ISISU peut aider pour une démarche VAE ?",
    category: "VAE",
    level: "advanced",
    duration: "long",
    answer:
      "La plateforme peut soutenir une logique de VAE en aidant à expliciter les compétences acquises, à documenter la progression et à identifier les écarts à combler. Cette réponse est une base V1 à confirmer avec les éléments métiers finaux du cadrage.",
    needsValidation: true,
  },
  {
    question: "Que faire si mes recommandations ne semblent pas adaptées ?",
    category: "Recommandations",
    level: "advanced",
    duration: "long",
    answer:
      "Refaites des quiz ciblés, vérifiez votre progression récente, puis actualisez les recommandations. Si le décalage persiste, utilisez le support/tutorat pour signaler les modules mal alignés et obtenir une orientation plus fine.",
  },
  {
    question: "Comment poser une question ou demander de l'aide ?",
    category: "Comprendre ISISU",
    level: "beginner",
    duration: "short",
    answer:
      "Cette page centralise les réponses existantes pour les besoins les plus fréquents. Pour un besoin spécifique, consultez les ressources proposées dans votre parcours.",
  },
];

const filteredFaqItems = computed(() => {
  return faqItems.filter((item) => {
    const matchesSearch =
      recherche.value === "" ||
      item.question.toLowerCase().includes(recherche.value.toLowerCase()) ||
      item.answer.toLowerCase().includes(recherche.value.toLowerCase());

    const matchesCategory =
      filtreCategorie.value === "" || item.category === filtreCategorie.value;

    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <VRow class="mb-6">
    <VCol cols="12">
      <VCard>
        <VCardText>
          <div
            class="d-flex align-center justify-space-between flex-wrap gap-4"
          >
            <div>
              <h4 class="text-h4 mb-2">Comment pouvons-nous vous aider ?</h4>
              <p class="text-body-1 text-medium-emphasis">
                Consultez notre base de connaissances pour comprendre le projet,
                activer les recommandations et avancer sur votre parcours.
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
        label="Rechercher votre question"
        placeholder="Ex : quiz, module, recommandation..."
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

    <!-- Niveau and Durée filters removed per request -->
  </VRow>
  <VRow>
    <VCol cols="12" class="mt-4">
      <VCard class="pa-4 shadow-md rounded-lg">
        <VCardItem class="pb-6">
          <VCardTitle class="text-h5 font-weight-bold"
            >Questions fréquentes</VCardTitle
          >
          <template #append>
            <VChip
              size="small"
              color="primary"
              variant="tonal"
              class="font-weight-medium"
            >
              {{ filteredFaqItems.length }}/{{ faqItems.length }} sujets
            </VChip>
          </template>
        </VCardItem>

        <VCardText>
          <div v-if="filteredFaqItems.length === 0" class="text-center py-12">
            <VIcon
              icon="bx-search"
              size="64"
              color="medium-emphasis"
              class="mb-4"
            />
            <p class="text-h6 text-medium-emphasis mt-4">
              Aucun résultat trouvé
            </p>
            <p class="text-body-2 text-medium-emphasis">
              Essayez d'ajuster vos filtres ou votre recherche
            </p>
          </div>

          <VExpansionPanels v-else variant="popout" class="faq-panels">
            <VExpansionPanel
              v-for="item in filteredFaqItems"
              :key="item.question"
              class="mb-4 rounded-lg border-opacity-50"
              elevation="1"
            >
              <VExpansionPanelTitle class="py-4">
                <div class="d-flex flex-column align-start gap-1 w-100 pe-4">
                  <div class="d-flex gap-2 flex-wrap">
                    <VChip
                      size="x-small"
                      variant="flat"
                      color="primary"
                      class="mb-1 text-uppercase font-weight-bold"
                      style="opacity: 0.85"
                    >
                      {{ item.category }}
                    </VChip>
                    <!-- Duration and level badges removed -->
                  </div>
                  <span
                    class="text-h6 font-weight-medium"
                    style="line-height: 1.4"
                    >{{ item.question }}</span
                  >
                </div>
              </VExpansionPanelTitle>
              <VExpansionPanelText
                class="pt-2 pb-4 text-body-1 text-medium-emphasis"
                style="line-height: 1.6"
              >
                {{ item.answer }}
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.faq-panels .v-expansion-panel {
  border: 1px solid rgba(var(--v-border-color), 0.2) !important;
  transition: all 0.3s ease;
}
.faq-panels .v-expansion-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}
.faq-panels .v-expansion-panel-title {
  padding: 16px 20px;
}
.faq-panels .v-expansion-panel-text {
  padding: 0 20px 20px;
}
</style>
