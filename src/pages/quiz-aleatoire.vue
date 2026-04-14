<script setup lang="ts">
import api from "@/services/api";
import { useToastStore } from "@/stores/toast";
import PreQuizIntro from "@/components/PreQuizIntro.vue";

const toastStore = useToastStore();

const handleStartGlobalEvaluation = async () => {
  try {
    // Source de vérité SwaggerUI: GET /api/v1/eval/recommendations/cross-session
    await api.get("/api/v1/eval/recommendations/cross-session");
    toastStore.addToast({
      message: "Évaluation globale lancée.",
      type: "success",
    });
  } catch (error) {
    toastStore.addToast({
      message:
        "Impossible de lancer l'évaluation globale pour le moment. Veuillez réessayer.",
      type: "error",
    });
  }
};
</script>

<template>
  <PreQuizIntro
    title="Évaluation Globale"
    subtitle="Mesurez votre niveau sur l'ensemble du référentiel FIE3"
    description="Testez vos connaissances sur l'ensemble des compétences du référentiel FIE3 via notre algorithme adaptatif."
    button-label="Commencer l'évaluation globale"
    @start="handleStartGlobalEvaluation"
  />
</template>
