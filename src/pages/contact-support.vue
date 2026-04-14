<script setup lang="ts">
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentYear = new Date().getFullYear();

const supportCards = [
  {
    icon: "bx-envelope",
    title: "Email Support",
    description:
      "Ecrivez-nous pour toute question technique ou pedagogique. Nous accusons reception rapidement et revenons vers vous sous 48h ouvrees.",
    actionLabel: "support@isisu.test",
    actionHref: "mailto:support@isisu.test",
  },
  {
    icon: "bx-message-square-dots",
    title: "Demande Detaillee",
    description:
      "Pour accelerer le traitement, precisez votre contexte, la fonctionnalite concernee et les etapes qui ont mene au blocage.",
    actionLabel: "Decrire ma demande",
    actionHref: "mailto:support@isisu.test?subject=Demande%20Support%20ISISU",
  },
  {
    icon: "bx-bulb",
    title: "Orientation Pedagogique",
    description:
      "Si votre besoin concerne les recommandations de modules ou l'interpretation des resultats, l'equipe vous guide vers les prochaines etapes utiles.",
    actionLabel: "Contacter l'equipe",
    actionHref: "mailto:support@isisu.test?subject=Orientation%20pedagogique",
  },
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
      <section class="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <article
          class="content-card rounded-2xl border border-slate-200 bg-white p-6 md:p-10"
        >
          <h1 class="text-3xl md:text-4xl font-bold mb-5 isis-title">
            Contacter le Support
          </h1>
          <p class="text-base md:text-lg text-slate-600 leading-8 mb-6">
            Notre equipe accompagne vos demandes techniques et pedagogiques avec
            une approche claire, rapide et orientee resolution.
          </p>

          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="card in supportCards"
              :key="card.title"
              class="support-card rounded-xl border border-slate-200 bg-slate-50/70 p-5"
            >
              <div
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--isis-blue)]/10 text-[var(--isis-blue)]"
              >
                <VIcon :icon="card.icon" size="22" />
              </div>
              <p class="mt-4 text-xl font-semibold text-slate-900">
                {{ card.title }}
              </p>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                {{ card.description }}
              </p>
              <a
                :href="card.actionHref"
                class="mt-4 inline-flex items-center rounded-md border border-[var(--isis-blue)]/25 bg-white px-3 py-2 text-sm font-semibold text-[var(--isis-blue)] transition hover:border-[var(--isis-blue)] hover:bg-[var(--isis-blue)]/5"
              >
                {{ card.actionLabel }}
              </a>
            </article>
          </div>

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
  --isis-blue: #1d4ed8;
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.06);
}

.support-card {
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.support-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.back-btn {
  border-color: #1d4ed8;
  color: #1d4ed8;
  text-transform: none;
  font-weight: 600;
}
</style>
