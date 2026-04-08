<template>
  <section
    id="middle-cta"
    class="flex min-h-[50vh] flex-col items-center justify-center bg-[var(--isis-blue)] px-6 py-16 text-center lg:px-10"
    data-reveal
  >
    <div class="mx-auto max-w-3xl space-y-8 text-center">
      <h2 class="section-title text-3xl sm:text-4xl text-white">
        Prêt à mesurer votre potentiel ?
      </h2>
      <p class="text-lg text-slate-100">
        Affinons ensemble vos compétences grâce à un parcours sur-mesure.
      </p>
      <div
        class="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
      >
        <a
          href="/login"
          class="cta-interactive inline-flex h-11 w-full items-center justify-center rounded-md bg-white px-8 text-base font-medium text-[var(--isis-blue)] shadow-sm transition hover:bg-slate-100 sm:w-auto"
        >
          Lancer son analyse
        </a>
        <a
          href="/login"
          class="cta-interactive inline-flex h-11 w-full items-center justify-center rounded-md border border-white bg-transparent px-8 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
        >
          Se connecter
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.serif-potentiel {
  font-family: "Cormorant", Georgia, serif;
}
</style>
