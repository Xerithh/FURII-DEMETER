<script setup lang="ts">
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentYear = new Date().getFullYear();
const paragraphs = [
  "ISISU collecte uniquement les donnees utiles au fonctionnement de la plateforme, notamment les informations d'identification academique, les resultats d'evaluation et les traces de progression pedagogique.",
  "Ces informations sont utilisees pour personnaliser les recommandations de modules, adapter le parcours d'apprentissage et assurer un suivi coherent de la montee en competences.",
  "Conformement au RGPD, chaque utilisateur peut exercer ses droits d'acces, de rectification et de suppression des donnees qui le concernent, selon les modalites de contact prevues par la plateforme.",
  "ISISU met en oeuvre des mesures de securite techniques et organisationnelles proportionnees afin de limiter les risques d'acces non autorise, de perte et d'alteration des informations traitees.",
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
            Politique de Confidentialite
          </h1>
          <p
            v-for="(paragraph, index) in paragraphs"
            :key="`privacy-${index}`"
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
