<script setup lang="ts">
import { ref } from "vue";

interface FaqItem {
  question: string;
  answer: string;
}

const props = defineProps<{
  faqItems: FaqItem[];
}>();

const openFaq = ref<number | null>(0);

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index;
};

const onEnter = (el: Element) => {
  const panel = el as HTMLElement;
  panel.style.height = "0px";
  panel.style.opacity = "0";
  panel.style.transition =
    "height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease";

  window.requestAnimationFrame(() => {
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = "1";
  });
};

const onAfterEnter = (el: Element) => {
  const panel = el as HTMLElement;
  panel.style.height = "auto";
};

const onLeave = (el: Element) => {
  const panel = el as HTMLElement;
  panel.style.height = `${panel.scrollHeight}px`;
  panel.style.opacity = "1";
  panel.style.transition =
    "height 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease";

  window.requestAnimationFrame(() => {
    panel.style.height = "0px";
    panel.style.opacity = "0";
  });
};
</script>

<template>
  <section
    id="faq"
    class="section-block section-white px-6 py-16 lg:px-10"
    data-reveal
  >
    <div class="section-inner mx-auto w-full max-w-7xl">
      <div class="mb-8 text-center">
        <p
          class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[var(--isis-blue)]"
        >
          FAQ
        </p>
        <h2 class="section-title text-3xl sm:text-4xl">
          Confidentialite et precision de mesure
        </h2>
      </div>
      <div class="mx-auto w-full max-w-5xl space-y-3" data-stagger>
        <article
          v-for="(item, index) in props.faqItems"
          :key="item.question"
          class="overflow-hidden rounded-md border border-slate-200 bg-white"
          data-stagger-item
        >
          <button
            type="button"
            class="accordion-title flex w-full items-center justify-between px-6 py-4 text-left text-base text-slate-900"
            :aria-expanded="openFaq === index"
            @click="toggleFaq(index)"
          >
            <span class="pr-4 leading-relaxed">{{ item.question }}</span>
            <span
              class="text-xs text-slate-500 transition-transform duration-300"
              :class="{ 'rotate-180': openFaq === index }"
              >⌄</span
            >
          </button>

          <Transition
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
          >
            <div
              v-if="openFaq === index"
              class="faq-panel desc-text overflow-hidden px-6 pb-5 text-base leading-7 text-slate-600"
            >
              {{ item.answer }}
            </div>
          </Transition>
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

.section-white {
  background: #ffffff;
}

.faq-panel {
  height: auto;
}
</style>
