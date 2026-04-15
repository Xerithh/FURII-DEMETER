<script setup lang="ts">
import PreQuizIntro from "@/components/PreQuizIntro.vue";
import { useQuizStore } from "@/stores/quizStore";
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";
import { useRouter } from "vue-router";

const toastStore = useToastStore();
const quizStore = useQuizStore();
const router = useRouter();
const isStartingGlobalEvaluation = ref(false);

const handleStartGlobalEvaluation = async () => {
  if (isStartingGlobalEvaluation.value) return;

  try {
    isStartingGlobalEvaluation.value = true;
    // Starts the session and initializes the quiz store
    await quizStore.startSession();
    toastStore.addToast({
      message: "Évaluation globale lancée.",
      type: "success",
    });
    // Redirect to the dynamic quiz session
    router.push("/student/quiz/session");
  } catch (error: any) {
    // Store handles error states, we can just optionally notify
    toastStore.addToast({
      message:
        error?.response?.status === 401
          ? "Session non autorisée. Veuillez vous reconnecter."
          : "Impossible de lancer l'évaluation globale pour le moment. Veuillez réessayer.",
      type: "error",
    });
  } finally {
    isStartingGlobalEvaluation.value = false;
  }
};
</script>

<template>
  <PreQuizIntro
    title="Évaluation Globale"
    icon="bx-brain"
    subtitle="Mesurez votre niveau sur l'ensemble du référentiel FIE3"
    description="Testez vos connaissances sur l'ensemble des compétences du référentiel FIE3 via notre algorithme adaptatif."
    button-label="Commencer l'évaluation globale"
    image="/images/svg/undraw_online-test.svg"
    :loading="isStartingGlobalEvaluation"
    @start="handleStartGlobalEvaluation"
  />
</template>
