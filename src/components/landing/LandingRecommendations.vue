<script setup lang="ts">
interface RecommendedModule {
  name: string;
  badge: string;
  rationale: string;
}

defineProps<{
  recommendedModules: RecommendedModule[];
}>();
</script>

<template>
  <section
    id="recommandations"
    class="section-block bg-[var(--isis-blue)] px-6 py-20 lg:px-10"
    data-reveal
  >
    <div class="section-inner mx-auto w-full max-w-7xl">
      <div class="mb-8 text-left">
        <p
          class="ui-subtitle text-sm font-semibold uppercase tracking-[0.16em] text-slate-200"
        >
          Recommandations intelligentes
        </p>
        <h2 class="section-title text-3xl sm:text-4xl text-white">
          Modules suggérés selon votre niveau réel
        </h2>
        <p
          class="desc-text mt-4 max-w-3xl text-lg leading-relaxed text-slate-100"
        >
          Après estimation de compétence, ISISU propose un parcours de
          rattrapage ou d'accélération module par module, avec priorisation
          pédagogique explicite.
        </p>
      </div>

      <div
        class="relative space-y-8 border-l border-white/30 pl-6 text-left lg:pl-12"
        data-stagger
      >
        <article
          v-for="module in recommendedModules"
          :key="module.name"
          class="group relative py-4"
          data-stagger-item
        >
          <div
            class="absolute -left-[22px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-white/50 bg-white transition-colors duration-300 group-hover:border-white lg:-left-[30px]"
          />

          <div class="space-y-2">
            <div
              class="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline"
            >
              <h3
                class="text-lg font-normal text-white transition-colors duration-300 group-hover:text-slate-100 sm:text-xl"
              >
                {{ module.name }}
              </h3>
              <span
                class="text-xs font-normal uppercase tracking-widest text-slate-200"
              >
                {{ module.badge }}
              </span>
            </div>
            <p class="max-w-3xl text-sm leading-relaxed text-slate-100">
              {{ module.rationale }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
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
</style>
