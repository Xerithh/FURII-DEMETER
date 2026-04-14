<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const sections = [
  {
    title: "Acceptation des CGU",
    text: "L'utilisation d'ISISU implique l'acceptation des présentes conditions d'utilisation.",
  },
  {
    title: "Usage du service",
    text: "Les services sont destinés à un usage pédagogique personnel. Toute tentative de fraude est interdite.",
  },
  {
    title: "Propriété des contenus",
    text: "Les contenus, quiz et supports restent la propriété d'ISISU et de leurs auteurs.",
  },
  {
    title: "Suspension de compte",
    text: "En cas de non-respect des règles, ISISU peut suspendre l'accès au compte utilisateur.",
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
            Conditions d'Utilisation
          </h1>
          <p class="text-body-1 text-medium-emphasis mx-auto legal-intro">
            Règles de fonctionnement de la plateforme et engagements mutuels.
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
