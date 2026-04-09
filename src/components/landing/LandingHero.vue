<script setup lang="ts">
defineEmits<{
  (e: "discover"): void;
}>();
</script>

<template>
  <section
    class="hero-section relative overflow-hidden px-6 pb-20 pt-28 lg:px-10 lg:pb-28 lg:pt-44"
    data-reveal
  >
    <div class="hero-image absolute inset-0" data-parallax />
    <div class="hero-overlay absolute inset-0" />

    <div class="relative mx-auto w-full max-w-7xl">
      <div class="hero-content max-w-4xl text-left">
        <p
          class="ui-subtitle inline-flex items-center rounded-full border border-white/60 bg-white/80 px-4 py-1.5 text-sm text-slate-800"
        >
          Plateforme academique ISIS / INU Champollion
        </p>

        <h1
          class="mt-6 text-balance text-3xl leading-[1.05] text-white sm:text-5xl lg:text-[72px]"
        >
          Mesurez votre niveau reel avec
          <span class="hero-subtitle text-[var(--isis-blue-light)]"
            >une analyse intelligente</span
          >
          et obtenez les bons modules au bon moment.
        </h1>

        <p
          class="desc-text mt-8 max-w-2xl text-lg leading-relaxed text-slate-100"
        >
          ISISU analyse votre niveau reel, puis propulse des recommandations de
          modules personnalisees selon vos besoins. Votre progression est
          boostee par l intelligence artificielle, de l evaluation a la decision
          pedagogique.
        </p>

        <div
          class="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <a
            href="/login"
            class="cta-interactive inline-flex h-11 items-center justify-start sm:justify-center rounded-md bg-[var(--isis-blue)] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1e40af] sm:text-base"
          >
            Demarrer mon evaluation
          </a>

          <button
            type="button"
            class="cta-interactive inline-flex h-11 items-center justify-start sm:justify-center rounded-md border border-white/90 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-slate-600 sm:text-base"
            @click="$emit('discover')"
          >
            Nous découvrir
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-image {
  background-image: url("/images/auth-placeholder.jpg");
  background-position: center;
  background-size: cover;
}

.hero-section {
  height: 100vh;
  min-height: 640px;
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.75);
  z-index: 0;
  pointer-events: none;
}

.hero-content {
  margin-top: 12px;
  transform: translateY(8px);
}

.hero-section .relative {
  position: relative;
  z-index: 1;
}

.hero-section h1 {
  font-weight: 500;
}

.hero-section h1 .hero-subtitle {
  font-size: 1.25em;
}

@media (max-width: 639px) {
  .hero-section {
    min-height: 560px;
  }
}
</style>
