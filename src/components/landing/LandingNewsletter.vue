<template>
  <section
    id="newsletter"
    class="section-block bg-[var(--isis-blue)] px-6 py-16 lg:px-10"
    data-reveal
  >
    <div class="section-inner mx-auto w-full max-w-5xl">
      <div
        class="newsletter-card rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 shadow-sm sm:p-10"
      >
        <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div class="space-y-4">
            <p
              class="ui-subtitle text-sm uppercase tracking-[0.16em] text-slate-200"
            >
              Newsletter AUXO
            </p>
            <h2 class="section-title text-3xl sm:text-4xl text-white">
              Recevez nos conseils pour progresser plus vite
            </h2>
            <p class="desc-text text-lg text-slate-100">
              Un condensé mensuel sur les bonnes pratiques d’apprentissage, les
              mises à jour de la plateforme et les ressources utiles pour votre
              parcours.
            </p>
          </div>

          <form class="space-y-3" @submit.prevent>
            <label for="newsletter-email" class="sr-only">Email</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="prenom.nom@exemple.com"
              class="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-300 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              class="cta-interactive w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[var(--isis-blue)] shadow-[0_8px_20px_rgba(255,255,255,0.25)] transition hover:bg-slate-100"
            >
              M'inscrire à la newsletter
            </button>
            <p class="text-xs text-slate-200">
              Aucun spam. Des contenus utiles, 1 fois par mois.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-block {
  min-height: 65vh;
  display: flex;
  align-items: center;
}

.section-inner {
  width: 100%;
}

.newsletter-card {
  position: relative;
}
</style>
