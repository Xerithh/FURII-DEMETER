<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quizStore";
import QuizResultsPanel from "@/components/quiz/QuizResultsPanel.vue";

const router = useRouter();
const quizStore = useQuizStore();

// Si la session vient d'être terminée (isLoading = true) mais no results yet, on affiche un loader
const isLoadingResults = computed(
  () =>
    quizStore.isLoading && quizStore.sessionTerminated && !quizStore.results,
);

onMounted(() => {
  // S'il n'y a pas de résultat et qu'on n'est pas en train de charger, rediriger
  if (
    !quizStore.results &&
    !isLoadingResults.value &&
    quizStore.sessionTerminated
  ) {
    // Redirection vers random-quiz pour recommencer
    router.push("/student/random-quiz");
  }
});

const restartEvaluation = () => {
  quizStore.resetQuizState();
  router.push("/student/random-quiz");
};

const goToModules = () => {
  quizStore.resetQuizState();
  router.push("/student/my-modules");
};
</script>

<template>
  <!-- Loading state while fetching results -->
  <v-container
    v-if="isLoadingResults"
    class="fill-height align-center justify-center"
  >
    <div class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        class="mb-4"
      ></v-progress-circular>
      <p class="text-body1 mt-4">Récupération de vos résultats...</p>
    </div>
  </v-container>

  <!-- Results display -->
  <QuizResultsPanel
    v-else-if="quizStore.results"
    :results="quizStore.results"
    @restart="restartEvaluation"
    @go-modules="goToModules"
  />
</template>
