<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const supportChannels = [
  "Assistance compte et authentification",
  "Problèmes d'évaluation et de progression",
  "Questions pédagogiques et orientation",
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
            Contacter le Support
          </h1>
          <p class="text-body-1 text-medium-emphasis mx-auto legal-intro">
            Une question technique ou pédagogique ? Notre équipe vous
            accompagne.
          </p>
        </header>

        <section class="legal-block text-center">
          <VIcon icon="bx-envelope" size="72" color="primary" class="mb-4" />

          <h2 class="text-h6 font-weight-bold isis-title mb-3">
            Canaux d'assistance
          </h2>

          <p class="text-body-1 text-medium-emphasis mb-4">
            Nous répondons sous 48h ouvrées.
          </p>

          <ul class="support-list">
            <li v-for="channel in supportChannels" :key="channel">
              {{ channel }}
            </li>
          </ul>

          <VBtn
            size="large"
            color="primary"
            variant="elevated"
            class="font-weight-bold px-8 mt-3"
            href="mailto:support@isisu.test"
          >
            Envoyer un message
          </VBtn>
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

.legal-block {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 2rem 1.25rem;
  background: #fff;
}

.support-list {
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
  color: #475569;
}

.back-btn {
  border-color: #1d4ed8;
  color: #1d4ed8;
  text-transform: none;
  font-weight: 600;
}
</style>
