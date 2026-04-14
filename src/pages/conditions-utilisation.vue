<script setup lang="ts">
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

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

onMounted(() => {
  window.scrollTo({ top: 0 });
});
</script>

<template>
  <div class="landing-premium min-h-screen bg-white text-slate-900">
    <LandingHeader :is-past-hero="true" />

    <section
      class="section-block section-white px-6 py-16 lg:px-10"
      data-reveal
    >
      <div class="section-inner mx-auto w-full max-w-4xl">
        <div class="mb-6">
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
        <div class="mb-12 space-y-6 text-left">
          <p
            class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[#1d4ed8]"
          >
            Cadre d'Utilisation
          </p>
          <h1 class="section-title text-3xl sm:text-4xl font-bold">
            Conditions d'Utilisation
          </h1>
          <div class="space-y-6 text-lg leading-relaxed text-slate-700">
            <div class="space-y-4">
              <p
                v-for="(paragraph, index) in paragraphs"
                :key="`terms-${index}`"
                class="desc-text text-lg text-slate-600"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <LandingFooter :current-year="currentYear" />
  </div>
</template>

<style scoped>
.section-block {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.section-inner {
  width: 100%;
}

.section-white {
  background: #fff;
}

.ui-subtitle {
  color: #1d4ed8;
}

/* section-title color removed to inherit default color */

.back-btn {
  border-color: #1d4ed8;
  color: #1d4ed8;
  text-transform: none;
  font-weight: 600;
}
</style>
