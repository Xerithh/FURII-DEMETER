<script setup>
import { ref } from "vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Ce quiz vous aidera a evaluer votre niveau avant de commencer.",
  },
  buttonLabel: {
    type: String,
    default: "Commencer",
  },
});

const emit = defineEmits(["start"]);

const isModalOpen = ref(false);

const startQuiz = () => {
  isModalOpen.value = false;
  emit("start");
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <h4 class="text-h4 mb-2">{{ title }}</h4>
          <p class="text-body-1 text-medium-emphasis">{{ subtitle }}</p>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex flex-column align-center text-center py-10">
          <p class="text-body-1 mb-6" style="max-width: 640px">
            {{ description }}
          </p>

          <img
            src="/images/undraw_waiting-for-you.svg"
            alt="Pre-quiz illustration"
            class="mb-6"
            style="max-width: 320px; width: 100%; height: auto"
          />

          <VBtn
            color="primary"
            size="large"
            prepend-icon="bx-play"
            @click="isModalOpen = true"
          >
            {{ buttonLabel }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VDialog v-model="isModalOpen" max-width="420" persistent>
      <VCard>
        <VCardItem class="pb-2">
          <VCardTitle class="text-h5 font-weight-bold d-flex align-center">
            <VIcon icon="bx-play-circle" color="primary" class="me-2" />
            Lancer le quiz
          </VCardTitle>
        </VCardItem>

        <VCardText class="text-body-1 pt-2 pb-6">
          Êtes-vous sûr de vouloir commencer maintenant ? Le chronomètre se
          lancera dès que vous aurez confirmé.
        </VCardText>

        <VCardActions class="justify-end px-4 pb-4">
          <VBtn
            variant="tonal"
            color="secondary"
            class="me-2"
            @click="isModalOpen = false"
          >
            Annuler
          </VBtn>
          <VBtn color="primary" variant="elevated" @click="startQuiz">
            Confirmer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
