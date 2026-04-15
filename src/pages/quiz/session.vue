<script setup lang="ts">
import QuestionRenderer from "@/components/quiz/QuestionRenderer.vue";
import { useQuizStore } from "@/stores/quizStore";
import { useToastStore } from "@/stores/toast";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const quizStore = useQuizStore();
const toastStore = useToastStore();
const dialogQuit = ref(false);

const showFeedback = ref(false);

onMounted(async () => {
  // Verifier s'il y a une session active. Si non, on redirige vers le tableau de bord ou on en cree une
  await quizStore.checkCurrentSession();
  if (!quizStore.sessionActive) {
    // try to start a new one automatically if navigated here
    try {
      await quizStore.startSession();
    } catch {
      toastStore.addToast({
        message: "Impossible de charger la session",
        type: "error",
      });
      router.push("/student/dashboard");
    }
  }
});

watch(
  () => quizStore.sessionTerminated,
  (isTerminated) => {
    if (isTerminated) {
      router.push("/student/quiz/results");
    }
  },
);

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const handleQuitConfirm = async () => {
  dialogQuit.value = false;
  try {
    await quizStore.terminateSession();
    // Le watcher va redirige vers /results automatiquement
  } catch (err) {
    toastStore.addToast({
      message: "Erreur lors de la fermeture de la session. Veuillez réessayer.",
      type: "error",
    });
  }
};

const onSubmitAnswer = async (payload: any) => {
  try {
    await quizStore.submitAnswer(payload);

    // Show neutral loading state before fetching next question
    showFeedback.value = true;

    setTimeout(async () => {
      showFeedback.value = false;
      await quizStore.fetchNextQuestion();
    }, 1000);
  } catch (err) {
    toastStore.addToast({
      message: "Erreur réseau. Veuillez réessayer.",
      type: "error",
    });
  }
};
</script>

<template>
  <v-container class="fill-height align-start">
    <v-row
      v-if="!quizStore.currentQuestion && quizStore.isLoading"
      justify="center"
      align="center"
      style="height: 60vh"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-row>

    <v-col v-else-if="quizStore.currentQuestion">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <v-btn
            variant="text"
            color="secondary"
            @click="dialogQuit = true"
            prepend-icon="bx-log-out"
            class="font-weight-bold"
          >
            Quitter la session
          </v-btn>
        </div>
        <div class="d-flex align-center gap-2">
          <v-icon
            icon="bx-timer"
            size="28"
            :color="quizStore.tempsRestantSecondes < 60 ? 'error' : 'secondary'"
          ></v-icon>
          <span
            :class="[
              'text-h6 font-weight-bold',
              quizStore.tempsRestantSecondes < 60 ? 'text-error' : '',
            ]"
          >
            {{ formatTime(quizStore.tempsRestantSecondes) }}
          </span>
        </div>
      </div>

      <!-- Progress -->
      <div class="mb-8">
        <div
          class="d-flex justify-space-between text-caption mb-1 text-medium-emphasis"
        >
          <span>Progression</span>
          <span>{{ Math.round(quizStore.pourcentageAvancement) }}%</span>
        </div>
        <v-progress-linear
          :model-value="Math.round(quizStore.pourcentageAvancement)"
          color="primary"
          height="8"
          rounded
          striped
        ></v-progress-linear>
      </div>

      <!-- Error alert -->
      <v-alert v-if="quizStore.error" type="error" variant="tonal" class="mb-6">
        {{ quizStore.error }}
      </v-alert>

      <div class="question-host">
        <!-- Loading layer between two questions -->
        <v-fade-transition>
          <div v-if="showFeedback" class="feedback-overlay">
            <v-progress-circular
              indeterminate
              color="primary"
              size="72"
              width="6"
            />
          </div>
        </v-fade-transition>

        <!-- Question Renderer -->
        <v-slide-y-transition leave-absolute>
          <QuestionRenderer
            v-if="!showFeedback"
            :question="quizStore.currentQuestion"
            :is-loading="quizStore.isLoading"
            @submit="onSubmitAnswer"
          />
        </v-slide-y-transition>
      </div>
    </v-col>

    <!-- Dialog Quitter -->
    <v-dialog v-model="dialogQuit" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Abandonner l'évaluation ?</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir quitter ? Vos progrès actuels seront
          enregistrés mais la session sera considérée comme terminée pour
          l'instant.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="dialogQuit = false"
            >Annuler</v-btn
          >
          <v-btn
            color="error"
            variant="elevated"
            @click="handleQuitConfirm"
            :loading="quizStore.isLoading"
            >Quitter</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}

.question-host {
  position: relative;
  min-height: 320px;
}

.feedback-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface), 0.72);
  backdrop-filter: blur(4px);
}
</style>
