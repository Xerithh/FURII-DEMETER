<script setup lang="ts">
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentYear = new Date().getFullYear();
const paragraphs = [
  "L'utilisation d'ISISU implique l'acceptation des conditions generales de la plateforme et des regles de bon usage applicables aux fonctionnalites pedagogiques proposees.",
  "Le service est destine a un usage personnel d'apprentissage. Toute tentative de contournement des evaluations, de fraude ou de detournement technique est strictement interdite.",
  "Les contenus pedagogiques, quiz, modules et supports d'accompagnement restent proteges par les droits de propriete intellectuelle de leurs auteurs et des entites contributrices.",
  "En cas de non-respect des conditions d'utilisation, ISISU peut suspendre temporairement ou definitivement l'acces au compte, dans le respect des procedures internes en vigueur.",
];

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push({ path: "/" });
};
</script>

<template>
  <div class="landing-premium min-h-screen bg-white text-slate-900">
    <LandingHeader :is-past-hero="true" />

    <main class="pt-28 pb-16">
      <section class="mx-auto w-full max-w-5xl px-6 lg:px-10">
        <article
          class="content-card rounded-2xl border border-slate-200 bg-white p-6 md:p-10"
        >
          <h1 class="text-3xl md:text-4xl font-bold mb-5 isis-title">
            Conditions d'Utilisation
          </h1>
          <p
            v-for="(paragraph, index) in paragraphs"
            :key="`terms-${index}`"
            class="text-base md:text-lg text-slate-600 leading-8 mb-4"
          >
            {{ paragraph }}
          </p>

          <div class="mt-8">
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
        </article>
      </section>
    </main>

    <LandingFooter :current-year="currentYear" />
  </div>
</template>

<style scoped>
.isis-title {
  color: #1d4ed8;
}

.content-card {
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.06);
}

.back-btn {
  border-color: #1d4ed8;
  color: #1d4ed8;
  text-transform: none;
  font-weight: 600;
}
</style>
