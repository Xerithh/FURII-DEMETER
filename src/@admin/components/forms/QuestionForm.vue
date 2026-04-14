<template>
  <VDialog v-model="isOpen" max-width="800" persistent scrollable>
    <VCard>
      <!-- Header -->
      <VCardItem>
        <VCardTitle>
          {{ isEditMode ? "Éditer la Question" : "Créer une Question" }}
        </VCardTitle>
        <VCardSubtitle v-if="isEditMode && question">
          Question #{{ question.id }}
        </VCardSubtitle>
      </VCardItem>
      <VDivider />

      <!-- Form Content -->
      <VCardText class="pa-6">
        <VForm ref="form" @submit.prevent="submitForm">
          <!-- Énoncé -->
          <VTextField
            v-model="formData.enonce"
            label="Énoncé *"
            placeholder="Entrez la question..."
            variant="outlined"
            counter="500"
            maxlength="500"
            :rules="[required('Énoncé')]"
            rows="4"
            class="mb-4"
          />

          <!-- Type -->
          <VSelect
            v-model="formData.type"
            label="Type de Question *"
            :items="typeOptions"
            :rules="[required('Type')]"
            class="mb-4"
          />

          <!-- Difficulté & Pondération -->
          <VRow class="mb-4">
            <VCol cols="12" sm="6">
              <VSelect
                v-model="formData.difficulte"
                label="Difficulté *"
                :items="difficultOptions"
                :rules="[required('Difficulté')]"
                @update:model-value="updatePonderation"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model.number="formData.ponderation"
                label="Pondération"
                variant="outlined"
                disabled
                suffix="pts"
              />
            </VCol>
          </VRow>

          <!-- Durée -->
          <VTextField
            v-model.number="formData.dureeSecondes"
            label="Durée (secondes) *"
            type="number"
            variant="outlined"
            suffix="s"
            :rules="[required('Durée')]"
            class="mb-4"
            min="10"
            max="600"
          />

          <!-- Compétences (TODO: Multiselect with real data) -->
          <VTextField
            v-model="formData.competenceIds"
            label="Compétences (TODO)"
            variant="outlined"
            disabled
            class="mb-4"
            hint="À implémenter: sélection des compétences"
          />

          <!-- Choix Section -->
          <div class="mb-4">
            <h3 class="mb-3">Choix</h3>
            <VRow
              v-for="(choix, index) in formData.choix"
              :key="index"
              class="mb-2 pa-2 bg-surface-light rounded"
            >
              <VCol cols="10">
                <VTextField
                  v-model="choix.contenu"
                  label="Choix"
                  variant="outlined"
                  dense
                  :rules="[required('Choix')]"
                />
              </VCol>
              <VCol cols="2" class="d-flex align-center">
                <VBtn
                  icon="bx:trash"
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeChoix(index)"
                />
              </VCol>
            </VRow>

            <VBtn
              color="primary"
              variant="tonal"
              size="small"
              prepend-icon="bx:plus"
              @click="addChoix"
              class="mt-2"
            >
              Ajouter un Choix
            </VBtn>
          </div>
        </VForm>
      </VCardText>

      <VDivider />

      <!-- Actions -->
      <VCardActions>
        <VSpacer />
        <VBtn text @click="close">Annuler</VBtn>
        <VBtn
          color="primary"
          @click="submitForm"
          :loading="isSubmitting"
        >
          {{ isEditMode ? "Mettre à jour" : "Créer" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type {
  Choix,
  NiveauDifficulte,
  QuestionDTO,
  TypeQuestion,
} from "@/@admin/types/admin";
import { computed, ref, watch } from "vue";

interface Props {
  question?: QuestionDTO | null;
  open?: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "submit", data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const form = ref(null);
const isSubmitting = ref(false);

const typeOptions = [
  { title: "QCM Simple", value: "QCM_SIMPLE" },
  { title: "QCM Multiple", value: "QCM_MULTIPLE" },
  { title: "Vrai/Faux", value: "VRAI_FAUX" },
  { title: "Réponse Libre", value: "REPONSE_LIBRE" },
];

const difficultOptions = [
  { title: "Facile (1.0x)", value: "FACILE" },
  { title: "Moyen (1.5x)", value: "MOYEN" },
  { title: "Difficile (2.0x)", value: "DIFFICILE" },
];

const ponderationMap: Record<NiveauDifficulte, number> = {
  FACILE: 1.0,
  MOYEN: 1.5,
  DIFFICILE: 2.0,
};

const formData = ref({
  enonce: "",
  type: "QCM_SIMPLE" as TypeQuestion,
  difficulte: "MOYEN" as NiveauDifficulte,
  ponderation: 1.5,
  dureeSecondes: 60,
  competenceIds: [] as number[],
  choix: [{ id: 1, contenu: "", ordre: 1, estCorrect: false }] as Choix[],
});

const isEditMode = computed(() => !!props.question);

const required = (field: string) => (v: any) =>
  v ? true : `${field} est requis`;

const updatePonderation = () => {
  formData.value.ponderation =
    ponderationMap[formData.value.difficulte] || 1.5;
};

const addChoix = () => {
  formData.value.choix.push({
    id: Date.now(),
    contenu: "",
    ordre: formData.value.choix.length + 1,
    estCorrect: false,
  });
};

const removeChoix = (index: number) => {
  formData.value.choix.splice(index, 1);
};

const submitForm = async () => {
  if (!form.value) return;
  const isValid = await form.value.validate();
  if (!isValid) return;

  isSubmitting.value = true;
  try {
    emit("submit", {
      ...formData.value,
      id: props.question?.id,
    });
    close();
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  resetForm();
  emit("close");
};

const resetForm = () => {
  if (props.question) {
    // Populate from existing question
    formData.value = {
      enonce: props.question.enonce,
      type: props.question.type,
      difficulte: props.question.difficulte,
      ponderation: props.question.ponderation,
      dureeSecondes: props.question.dureeSecondes,
      competenceIds: props.question.competenceIds,
      choix: [...props.question.choix],
    };
  } else {
    // Reset to defaults
    formData.value = {
      enonce: "",
      type: "QCM_SIMPLE",
      difficulte: "MOYEN",
      ponderation: 1.5,
      dureeSecondes: 60,
      competenceIds: [],
      choix: [{ id: 1, contenu: "", ordre: 1, estCorrect: false }],
    };
  }
};

watch(
  () => props.open,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      resetForm();
    }
  }
);

watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      close();
    }
  }
);
</script>

<style scoped lang="scss">
.bg-surface-light {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
