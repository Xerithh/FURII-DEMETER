<script setup lang="ts">
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const currentYear = new Date().getFullYear();

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
            Support et Ressources
          </p>
          <h1 class="section-title text-3xl sm:text-4xl font-bold">
            Contacter le Support
          </h1>
          <div class="space-y-6 text-lg leading-relaxed text-slate-700">
            <div class="space-y-4">
              <p class="desc-text text-lg text-slate-600">
                Notre équipe accompagne vos demandes techniques et pédagogiques
                avec une approche claire, rapide et orientée résolution. Pour
                toute question concernant la plateforme ISISU ou votre parcours
                d'apprentissage personnalisé, n'hésitez pas à nous contacter via
                l'un des moyens suivants. <br /><br />
                Pour accéder à la plateforme principale d'ISIS et consulter vos
                modules, rendez-vous sur le
                <a
                  href="https://isis.univ-jfc.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#1d4ed8] underline hover:opacity-80 transition"
                  >site d'ISIS</a
                >. &nbsp;Si vous avez besoin d'un contact, consultez le site
                d'ISIS. &nbsp;Coordonnées de contact — Email:
                <a
                  href="mailto:isis@univ-jfc.fr"
                  class="text-[#1d4ed8] underline hover:opacity-80 transition"
                  >isis@univ-jfc.fr</a
                >; Numéro de téléphone:
                <a
                  href="tel:+33563512401"
                  class="text-[#1d4ed8] underline hover:opacity-80 transition"
                  >05.63.51.24.01</a
                >; Localisation:
                <a
                  href="https://www.google.com/maps/place/95+Rue+Firmin+Oul%C3%A8s,+81100+Castres"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#1d4ed8] underline hover:opacity-80 transition"
                  >95, Rue Firmin Oulès 81100 Castres</a
                >. Nous trouver ci‑dessous :
              </p>
            </div>
          </div>
        </div>

        <div class="mb-12">
          <div class="rounded-lg overflow-hidden border border-slate-200 mt-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2867.4967449999998!2d2.253!3d43.606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aef0a0eee8c8c5%3A0x1234567890ab!2s95%20Rue%20Firmin%20Oul%C3%A8s%2C%2081100%20Castres!5e0!3m2!1sfr!2sfr!4v1234567890"
              width="100%"
              height="450"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
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
