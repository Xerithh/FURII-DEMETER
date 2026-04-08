<script setup lang="ts">
import { Cpu, Database, Heart, Zap } from "lucide-vue-next";

const modules = [
  { name: "Ingénierie numérique", icon: Cpu },
  { name: "Ingénierie de données", icon: Database },
  { name: "Ingénierie et Santé", icon: Heart },
  { name: "Devenir Ingénieur", icon: Zap },
];

const moduleCards = [
  modules[0],
  modules[1],
  modules[2],
  modules[3],
  modules[0],
  modules[1],
  modules[2],
  modules[3],
  modules[0],
  modules[1],
];
</script>

<template>
  <section
    id="competences"
    class="section-block section-white px-6 py-16 lg:px-10"
    data-reveal
  >
    <div
      class="section-inner mx-auto flex w-full max-w-7xl flex-col items-center space-y-12 text-center"
    >
      <div class="max-w-3xl space-y-4">
        <p
          class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[var(--isis-blue)]"
        >
          Compétences ciblées
        </p>
        <h2 class="section-title text-3xl sm:text-4xl">
          Les compétences que nous allons développer pendant la formation
        </h2>
        <p class="desc-text text-lg text-slate-600 mb-10">
          Cette section présentera les différentes compétences ciblées et leur
          progression au fil du parcours.
        </p>
      </div>

      <!-- From Uiverse.io by musashi-13 -->
      <div class="card-3d">
        <div
          v-for="(module, index) in moduleCards"
          :key="`${module.name}-${index}`"
        >
          <component :is="module.icon" class="card-icon" :size="32" />
          <span class="card-text">{{ module.name }}</span>
        </div>
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
  background: #ffffff;
}

/* From Uiverse.io by musashi-13 */
@keyframes autoRun3d {
  from {
    transform: perspective(800px) rotateY(-360deg);
  }
  to {
    transform: perspective(800px) rotateY(0deg);
  }
}

@keyframes animateBrightness {
  10% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.1);
  }
  90% {
    filter: brightness(1);
  }
}

.card-3d {
  position: relative;
  width: 600px;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
  transform-style: preserve-3d;
  transform: perspective(400px);
  animation: autoRun3d 20s linear infinite;
  will-change: transform;
}

.card-3d div {
  position: absolute;
  width: 105px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  text-align: center;
  font-family: "Fira Sans", "Segoe UI", sans-serif;
  border-radius: 0.75rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.08),
    0 1px 2px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(2px);
  top: 50%;
  left: 50%;
  transform-origin: center center;
  animation: animateBrightness 20s linear infinite;
  transition:
    filter 200ms ease,
    box-shadow 200ms ease;
  will-change: transform, filter;
}

.card-icon {
  color: #1d4ed8;
  flex-shrink: 0;
}

.card-text {
  font-size: 0.68rem;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #0f172a;
}

.card-3d:hover {
  animation-play-state: paused !important;
}

.card-3d:hover div {
  animation-play-state: paused !important;
}

.card-3d div:nth-child(1) {
  transform: translate(-50%, -50%) rotateY(0deg) translateZ(225px);
  animation-delay: -0s;
}

.card-3d div:nth-child(2) {
  transform: translate(-50%, -50%) rotateY(36deg) translateZ(225px);
  animation-delay: -2s;
}

.card-3d div:nth-child(3) {
  transform: translate(-50%, -50%) rotateY(72deg) translateZ(225px);
  animation-delay: -4s;
}

.card-3d div:nth-child(4) {
  transform: translate(-50%, -50%) rotateY(108deg) translateZ(225px);
  animation-delay: -6s;
}

.card-3d div:nth-child(5) {
  transform: translate(-50%, -50%) rotateY(144deg) translateZ(225px);
  animation-delay: -8s;
}

.card-3d div:nth-child(6) {
  transform: translate(-50%, -50%) rotateY(180deg) translateZ(225px);
  animation-delay: -10s;
}

.card-3d div:nth-child(7) {
  transform: translate(-50%, -50%) rotateY(216deg) translateZ(225px);
  animation-delay: -12s;
}

.card-3d div:nth-child(8) {
  transform: translate(-50%, -50%) rotateY(252deg) translateZ(225px);
  animation-delay: -14s;
}

.card-3d div:nth-child(9) {
  transform: translate(-50%, -50%) rotateY(288deg) translateZ(225px);
  animation-delay: -16s;
}

.card-3d div:nth-child(10) {
  transform: translate(-50%, -50%) rotateY(324deg) translateZ(225px);
  animation-delay: -18s;
}
</style>
