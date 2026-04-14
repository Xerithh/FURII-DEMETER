<script setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import { useQuizStore } from "@/stores/quizStore";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const quizStore = useQuizStore();

const isQuizEvaluationScreen = computed(() =>
  route.path.startsWith("/student/quiz/session"),
);

const isQuizLocked = computed(
  () => isQuizEvaluationScreen.value || quizStore.sessionActive,
);

const handleLogout = () => {
  // trigger global event to open logout confirmation handled by UserProfile
  try {
    window.dispatchEvent(new CustomEvent("open-logout-dialog"));
  } catch (e) {}
};
</script>

<template>
  <template v-if="isQuizLocked">
    <VerticalNavSectionTitle
      :item="{
        heading: 'Quizz',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Évaluation Globale',
        icon: 'bx-brain',
        to: '/student/quiz/session',
        className: 'quiz-lock-link',
      }"
    />
  </template>

  <template v-else>
    <!-- 👉 Tableau de Bord -->
    <VerticalNavSectionTitle
      :item="{
        heading: 'Vue d\'ensemble',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Mon Tableau de Bord',
        icon: 'bx-home-smile',
        to: '/student/dashboard',
      }"
    />

    <!-- 👉 Quiz -->
    <VerticalNavSectionTitle
      :item="{
        heading: 'Quizz',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Évaluation Globale',
        icon: 'bx-brain',
        to: '/student/random-quiz',
      }"
    />

    <!-- 👉 Mon Apprentissage -->
    <VerticalNavSectionTitle
      :item="{
        heading: 'Mon Apprentissage',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Mes Modules',
        icon: 'bx-book-open',
        to: '/student/my-modules',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Historique',
        icon: 'bx-history',
        to: '/student/history',
      }"
    />

    <!-- 👉 Ressources -->
    <VerticalNavSectionTitle
      :item="{
        heading: 'Ressources',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Bibliothèque',
        icon: 'bx-library',
        to: '/student/cards',
      }"
    />

    <!-- 👉 Compte -->
    <VerticalNavSectionTitle
      :item="{
        heading: 'Compte',
      }"
    />

    <VerticalNavLink
      :item="{
        title: 'Mon Profil',
        icon: 'bx-user',
        to: '/student/account-settings',
      }"
    />

    <VerticalNavLink
      :item="{
        title: 'Déconnexion',
        icon: 'bx-log-out',
      }"
      class="mb-logout"
      @click="handleLogout"
    />
  </template>
</template>

<style scoped lang="scss">
::v-deep .mb-logout {
  margin-bottom: 3rem;
}

::v-deep .quiz-lock-link .nav-item-icon {
  animation: brainPulseBlue 1.6s ease-in-out infinite;
}

::v-deep .quiz-lock-link .nav-item-title {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

@keyframes brainPulseBlue {
  0% {
    color: rgba(var(--v-theme-primary), 0.28);
  }
  50% {
    color: rgba(var(--v-theme-primary), 1);
  }
  100% {
    color: rgba(var(--v-theme-primary), 0.28);
  }
}
</style>
