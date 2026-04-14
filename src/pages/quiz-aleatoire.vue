<script setup lang="ts">
import { useRouter } from "vue-router";
import { useToastStore } from "@/stores/toast";
import { useQuizStore } from "@/stores/quizStore";
import PreQuizIntro from "@/components/PreQuizIntro.vue";

const toastStore = useToastStore();
const quizStore = useQuizStore();
const router = useRouter();

const handleStartGlobalEvaluation = async () => {
  try {
    // Starts the session and initializes the quiz store
    await quizStore.startSession();
    toastStore.addToast({
      message: "Évaluation globale lancée.",
      type: "success",
    });
    // Redirect to the dynamic quiz session
    router.push('/student/quiz/session');
  } catch (error: any) {
    // Store handles error states, we can just optionally notify
    toastStore.addToast({
      message: error?.response?.status === 401 
        ? "Session non autorisée. Veuillez vous reconnecter."
        : "Impossible de lancer l'évaluation globale pour le moment. Veuillez réessayer.",
      type: "error",
    });
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
    @start="handleStartGlobalEvaluation"
  />
</template>
