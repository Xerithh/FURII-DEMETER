<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const sections = [
  {
    title: "Collecte des données",
    text: "Nous collectons uniquement les informations nécessaires au bon fonctionnement d'ISISU: identité académique, progression et résultats d'évaluation.",
  },
  {
    title: "Utilisation",
    text: "Ces données servent exclusivement à personnaliser votre parcours d'apprentissage et améliorer la pertinence des recommandations.",
  },
  {
    title: "Vos droits",
    text: "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données, conformément au RGPD.",
  },
  {
    title: "Sécurité",
    text: "ISISU applique des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.",
  },
];

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push({ name: "help" });
};
</script>

<template>
  <VContainer class="legal-page py-12 px-6">
    <VRow justify="center">
      <VCol cols="12" md="10" lg="8">
        <header class="text-center mb-10">
          <h1 class="text-h3 font-weight-bold isis-title mb-3">
            Politique de Confidentialité
          </h1>
          <p class="text-body-1 text-medium-emphasis mx-auto legal-intro">
            Transparence sur la gestion de vos données au sein de la plateforme
            ISISU.
          </p>
        </header>

        <section class="legal-sections">
          <article
            v-for="section in sections"
            :key="section.title"
            class="legal-block"
          >
            <h2 class="text-h6 font-weight-bold isis-title mb-2">
              {{ section.title }}
            </h2>
            <p class="text-body-1 text-medium-emphasis mb-0">
              {{ section.text }}
            </p>
          </article>
        </section>

        <div class="d-flex justify-center mt-10">
          <VBtn
            variant="outlined"
            color="primary"
            prepend-icon="bx-arrow-back"
            class="back-btn"
            @click="goBack"
          >
            Retour
          </VBtn>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.legal-page {
  background: #fff;
  min-height: 100vh;
}

.isis-title {
  color: #1d4ed8;
}

.legal-intro {
  max-width: 760px;
  line-height: 1.8;
}

.legal-sections {
  display: grid;
  gap: 1rem;
}

.legal-block {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem;
  background: #fff;
}

.back-btn {
  border-color: #1d4ed8;
  color: #1d4ed8;
  text-transform: none;
  font-weight: 600;
}
</style>
