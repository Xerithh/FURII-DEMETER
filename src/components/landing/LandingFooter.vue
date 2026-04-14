<template>
  <footer class="footer-shell border-t border-slate-200 text-slate-200">
    <div class="footer-pattern" aria-hidden="true"></div>
    <div class="relative mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
      <div class="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div class="space-y-5">
          <div
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-900 font-semibold"
          >
            I
          </div>
          <p class="desc-text max-w-md text-base leading-7 text-slate-300">
            Plateforme d evaluation adaptive pour accompagner les parcours
            academiques avec mesure fiable et recommandations ciblées.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a
              href="/login"
              class="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 hover:border-slate-300 hover:text-white"
            >
              Se connecter
            </a>
            <a
              href="/student/dashboard"
              class="inline-flex items-center justify-center rounded-md bg-[var(--isis-blue)] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(29,78,216,0.35)] transition hover:bg-[#1e40af]"
            >
              Demarrer mon analyse
            </a>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </h4>
          <a
            href="#processus"
            class="block text-base text-slate-200 transition hover:text-white"
            >Processus</a
          >
          <a
            href="#apercu-etudiant"
            class="block text-base text-slate-200 transition hover:text-white"
            >Etudiant</a
          >
          <a
            href="#recommandations"
            class="block text-base text-slate-200 transition hover:text-white"
            >Recommandation</a
          >
          <a
            href="#faq"
            class="block text-base text-slate-200 transition hover:text-white"
            >FAQ</a
          >
        </div>

        <div class="space-y-3">
          <h4 class="text-sm uppercase tracking-[0.16em] text-slate-400">
            Contact
          </h4>
          <a
            href="mailto:contact@isisu.fr"
            class="block text-base text-slate-200 transition hover:text-white"
            >contact@isisu.fr</a
          >
          <RouterLink
            :to="{ name: 'terms' }"
            class="block text-base text-slate-200 transition hover:text-white"
            >Mentions legales</RouterLink
          >
          <RouterLink
            :to="{ name: 'privacy' }"
            class="block text-base text-slate-200 transition hover:text-white"
            >Politique de confidentialite</RouterLink
          >
        </div>
      </div>

      <div class="mt-14 border-t border-slate-700 pt-6 text-sm text-slate-400">
        © {{ currentYear }} ISISU. Tous droits reserves.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  currentYear: number;
}>();
</script>

<style scoped>
.footer-shell {
  position: relative;
  overflow: hidden;
  background: #0f172a;
  --isis-blue: #1d4ed8;
}

.footer-pattern {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    135deg,
    rgba(148, 163, 184, 0.03) 0,
    rgba(148, 163, 184, 0.03) 6px,
    transparent 6px,
    transparent 30px
  );
  pointer-events: none;
}
</style>
