<script setup>
const faqCategories = [
  { label: "Comprendre ISISU", color: "primary" },
  { label: "Recommandations", color: "success" },
  { label: "Quiz", color: "info" },
  { label: "Parcours & Modules", color: "warning" },
  { label: "VAE", color: "secondary" },
];

const faqItems = [
  {
    question: "Qu'est-ce que le projet ISISU ?",
    category: "Comprendre ISISU",
    answer:
      "ISISU est une plateforme d'apprentissage personnalisé qui aide à choisir, suivre et valider les bons modules en fonction de votre profil. L'objectif est de structurer votre progression et de rendre vos acquis visibles tout au long du parcours.",
  },
  {
    question: "À qui s'adresse ISISU ?",
    category: "Comprendre ISISU",
    answer:
      "La plateforme cible les apprenants qui souhaitent avancer avec un accompagnement plus individualisé. Elle est utile si vous voulez identifier vos priorités, renforcer certaines compétences et garder une vue claire de votre progression.",
  },
  {
    question: "Comment avoir accès aux modules recommandés ?",
    category: "Recommandations",
    answer:
      "Le point de départ est de réaliser les quiz disponibles (UE, matière ou aléatoire). Vos résultats alimentent la recommandation, puis vous pouvez consulter la page “Modules suggérés” pour démarrer les contenus les plus adaptés à votre situation.",
  },
  {
    question: "Pourquoi faut-il faire les quiz avant les recommandations ?",
    category: "Quiz & Évaluations",
    answer:
      "Les quiz servent à estimer votre niveau sur des thèmes précis. Plus vos réponses reflètent votre niveau réel, plus les recommandations de modules et de parcours sont pertinentes pour éviter de revoir des notions déjà maîtrisées ou de sauter des bases.",
  },
  {
    question:
      "Quelle différence entre “Modules suggérés” et “Parcours personnalisés” ?",
    category: "Recommandations",
    answer:
      "Les modules suggérés sont des recommandations unitaires (un module à la fois). Les parcours personnalisés organisent ces modules en chemin cohérent avec des étapes et des objectifs progressifs.",
  },
  {
    question: "Où suivre mes modules en cours ?",
    category: "Parcours & Modules",
    answer:
      "Dans “Mes Modules”, vous retrouvez vos modules actifs, leur progression, les échéances et les indicateurs de statut. C'est l'espace principal pour piloter votre apprentissage semaine après semaine.",
  },
  {
    question: "Où retrouver mes évaluations et résultats de quiz ?",
    category: "Quiz",
    answer:
      "Les quiz sont accessibles depuis la section dédiée dans le menu. Vous pouvez y suivre vos résultats et priorités de révision.",
  },
  {
    question: "Qu'est-ce que la plateforme permet concrètement ?",
    category: "Comprendre ISISU",
    answer:
      "ISISU permet de mieux cibler vos efforts, de suivre votre progression, d'organiser un parcours plus cohérent et de valoriser vos acquis. Elle offre un cadre pratique pour transformer des résultats de quiz en actions d'apprentissage utiles.",
  },
  {
    question: "En quoi ISISU peut aider pour une démarche VAE ?",
    category: "VAE",
    answer:
      "La plateforme peut soutenir une logique de VAE en aidant à expliciter les compétences acquises, à documenter la progression et à identifier les écarts à combler. Cette réponse est une base V1 à confirmer avec les éléments métiers finaux du cadrage.",
    needsValidation: true,
  },
  {
    question: "Que faire si mes recommandations ne semblent pas adaptées ?",
    category: "Recommandations",
    answer:
      "Refaites des quiz ciblés, vérifiez votre progression récente, puis actualisez les recommandations. Si le décalage persiste, utilisez le support/tutorat pour signaler les modules mal alignés et obtenir une orientation plus fine.",
  },
  {
    question: "Comment poser une question ou demander de l'aide ?",
    category: "Comprendre ISISU",
    answer:
      "Cette page centralise les réponses existantes pour les besoins les plus fréquents. Pour un besoin spécifique, consultez les ressources proposées dans votre parcours.",
  },
];
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText
          class="d-flex flex-wrap align-center justify-space-between gap-4"
        >
          <div>
            <h4 class="text-h4 mb-2">
              Centre d'aide ISISU • Questions fréquentes
            </h4>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Consultez les réponses existantes pour comprendre le projet,
              activer les recommandations et avancer sur votre parcours.
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" lg="12">
      <VCard>
        <VCardItem>
          <VCardTitle>Questions & réponses</VCardTitle>
          <template #append>
            <VChip size="small" color="secondary" variant="tonal">
              {{ faqItems.length }} sujets
            </VChip>
          </template>
        </VCardItem>

        <VCardText>
          <VExpansionPanels class="customized-panels" variant="accordion">
            <VExpansionPanel v-for="item in faqItems" :key="item.question">
              <VExpansionPanelTitle>
                <div class="d-flex flex-wrap align-center gap-2 pe-3">
                  <span class="text-body-1 font-weight-medium">{{
                    item.question
                  }}</span>
                  <VChip size="x-small" variant="tonal">
                    {{ item.category }}
                  </VChip>
                </div>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-0 text-body-2 text-medium-emphasis">
                  {{ item.answer }}
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
