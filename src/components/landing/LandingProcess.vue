<script setup lang="ts">
import Card from "@/components/ui/card/Card.vue";

interface ProcessStep {
  title: string;
  description: string;
  icon: unknown;
}

defineProps<{
  processSteps: ProcessStep[];
  bgWords: string[];
}>();
</script>

<template>
  <section
    id="processus"
    class="section-block section-white px-6 py-16 lg:px-10"
    data-reveal
  >
    <div class="section-inner mx-auto w-full max-w-7xl">
      <div class="mb-14 max-w-3xl space-y-5">
        <p
          class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[var(--isis-blue)]"
        >
          Comment ça marche ?
        </p>
        <h2 class="section-title text-3xl sm:text-4xl">
          Un processus en 3 etapes, sans friction
        </h2>
        <p class="desc-text text-lg text-slate-600">
          Une approche clinique qui transforme vos reponses en plan de
          progression actionnable.
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-3" data-stagger>
        <Card
          v-for="(step, idx) in processSteps"
          :key="step.title"
          class="isis-lift-card border border-slate-200 p-6"
          data-stagger-item
        >
          <div class="relative overflow-hidden">
            <span class="bg-word" aria-hidden="true">{{ bgWords[idx] }}</span>

            <div class="relative z-10">
              <div
                class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700"
              >
                <component :is="step.icon" class="h-4 w-4" />
              </div>
              <h3 class="card-title text-xl text-slate-900">
                {{ step.title }}
              </h3>
              <p class="desc-text mt-3 text-sm leading-7 text-slate-600">
                {{ step.description }}
              </p>
            </div>
          </div>
        </Card>
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

.section-white {
  background: #fff;
}

.bg-word {
  position: absolute;
  top: 6%;
  left: -6%;
  z-index: 0;
  color: transparent;
  font-size: clamp(72px, 10vw, 140px);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 0.85;
  pointer-events: none;
  text-transform: uppercase;
  user-select: none;
  -webkit-text-stroke: 1px rgba(15, 23, 42, 0.03);
}

@media (min-width: 1024px) {
  .bg-word {
    left: -8%;
    font-size: 140px;
  }
}
</style>
