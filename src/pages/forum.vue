<script setup>
const faqCategories = [
  { label: "Comprendre AUXO", color: "primary" },
  { label: "Recommandations", color: "success" },
  { label: "Quiz & Évaluations", color: "info" },
  { label: "Parcours & Modules", color: "warning" },
  { label: "VAE", color: "secondary" },
];

const faqItems = [
  {
    question: "Qu'est-ce que le projet AUXO ?",
    category: "Comprendre AUXO",
    answer:
      "AUXO est une plateforme d'apprentissage personnalisé qui aide à choisir, suivre et valider les bons modules en fonction de votre profil. L'objectif est de structurer votre progression et de rendre vos acquis visibles tout au long du parcours.",
  },
  {
    question: "À qui s'adresse AUXO ?",
    category: "Comprendre AUXO",
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
    question: "Où voir ma progression globale dans le parcours ?",
    category: "Parcours & Modules",
    answer:
      "La page “Mon Parcours” centralise l'avancement global, les objectifs, les modules validés et les compétences acquises. Elle vous permet de vérifier ce qui est déjà atteint et ce qu'il reste à consolider.",
  },
  {
    question: "Où retrouver mes évaluations et résultats de quiz ?",
    category: "Quiz & Évaluations",
    answer:
      "La page “Mes Évaluations” regroupe vos quiz, examens et projets, avec les statuts associés. Vous pouvez y suivre vos résultats, vos prochaines échéances et vos priorités de révision.",
  },
  {
    question: "Qu'est-ce que la plateforme permet concrètement ?",
    category: "Comprendre AUXO",
    answer:
      "AUXO permet de mieux cibler vos efforts, de suivre votre progression, d'organiser un parcours plus cohérent et de valoriser vos acquis. Elle offre un cadre pratique pour transformer des résultats de quiz en actions d'apprentissage utiles.",
  },
  {
    question: "En quoi AUXO peut aider pour une démarche VAE ?",
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
    category: "Comprendre AUXO",
    answer:
      "Vous pouvez utiliser cette page comme centre de réponses rapides, puis contacter un tuteur depuis la navigation “Aide & Support” si votre besoin nécessite un accompagnement personnalisé.",
  },
];

const quickLinks = [
  {
    title: "Faire un quiz",
    icon: "bx-brain",
    to: "/mes-evaluations",
    color: "primary",
  },
  {
    title: "Voir les modules suggérés",
    icon: "bx-bulb",
    to: "/modules-suggeres",
    color: "success",
  },
  {
    title: "Consulter mon parcours",
    icon: "bx-trending-up",
    to: "/mon-parcours",
    color: "info",
  },
  {
    title: "Contacter un tuteur",
    icon: "bx-message-dots",
    to: "/etudiant",
    color: "warning",
  },
];

const openQuestion = ref("");
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText
          class="d-flex flex-wrap align-center justify-space-between gap-4"
        >
          <div>
            <h4 class="text-h4 mb-2">Forum AUXO • Questions Fréquentes</h4>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Réponses rapides pour comprendre le projet, activer les
              recommandations et avancer sur votre parcours.
            </p>
          </div>
          <VChip color="primary" variant="tonal" prepend-icon="bx-info-circle">
            Version FAQ V1
          </VChip>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" lg="8">
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
                  <VChip
                    v-if="item.needsValidation"
                    size="x-small"
                    color="warning"
                    variant="tonal"
                  >
                    À valider
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

    <VCol cols="12" lg="4">
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardItem>
              <VCardTitle>Accès rapides</VCardTitle>
            </VCardItem>
            <VCardText class="d-flex flex-column gap-3">
              <VBtn
                v-for="link in quickLinks"
                :key="link.title"
                :to="link.to"
                :color="link.color"
                :prepend-icon="link.icon"
                variant="tonal"
                block
              >
                {{ link.title }}
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12">
          <VCard>
            <VCardItem>
              <VCardTitle>Poser une question</VCardTitle>
            </VCardItem>
            <VCardText>
              <VTextarea
                v-model="openQuestion"
                rows="4"
                placeholder="Décrivez votre question (ex: comment obtenir des recommandations plus précises ?)"
                variant="outlined"
                class="mb-3"
              />
              <VBtn
                block
                color="primary"
                prepend-icon="bx-send"
                :disabled="!openQuestion.trim()"
              >
                Publier
              </VBtn>
              <p class="text-caption text-medium-emphasis mt-3 mb-0">
                Cette V1 simule la publication. La persistance des messages sera
                ajoutée dans une itération backend.
              </p>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
