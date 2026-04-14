<script setup lang="ts">
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

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
            Donnees et Vie Privee
          </p>
          <h1 class="section-title text-3xl sm:text-4xl font-bold">
            Politique de Confidentialite
          </h1>
          <div class="space-y-6 text-lg leading-relaxed text-slate-700">
            <div class="space-y-4">
              <p
                v-for="(paragraph, index) in paragraphs"
                :key="`privacy-${index}`"
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
