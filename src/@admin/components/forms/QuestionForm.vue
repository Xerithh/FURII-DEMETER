<template>
  <VDialog v-model="isOpen" max-width="900" persistent scrollable>
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
        <!-- Type Selector (only on create) -->
        <div v-if="!isEditMode" class="mb-6">
          <h3 class="text-subtitle-2 font-weight-bold mb-3">
            Étape 1: Sélectionner le type
          </h3>
          <VRow>
            <VCol
              v-for="type in typeOptions"
              :key="type.value"
              cols="12"
              sm="6"
              md="3"
            >
              <VCard
                class="type-card"
                :class="{ active: formData.type === type.value }"
                @click="selectType(type.value)"
                hover
              >
                <div class="type-icon">{{ type.icon }}</div>
                <div class="type-name">{{ type.title }}</div>
                <div class="type-description">{{ type.description }}</div>
              </VCard>
            </VCol>
          </VRow>
          <VDivider class="my-6" />
        </div>

        <!-- Énoncé (common) -->
        <VTextField
          v-model="formData.enonce"
          label="Énoncé *"
          placeholder="Entrez la question..."
          variant="outlined"
          counter="500"
          maxlength="500"
          rows="3"
          class="mb-4"
        />

        <!-- Type-specific forms -->
        <div v-if="formData.type === 'QCM_SIMPLE'" class="mb-6">
          <QCMSimpleForm v-model="formData" />
        </div>

        <div v-if="formData.type === 'QCM_MULTIPLE'" class="mb-6">
          <QCMMultipleForm v-model="formData" />
        </div>

        <div v-if="formData.type === 'VRAI_FAUX'" class="mb-6">
          <VraiFauxForm v-model="formData" />
        </div>

        <div v-if="formData.type === 'REPONSE_LIBRE'" class="mb-6">
          <ReponseLiureForm v-model="formData" />
        </div>

        <!-- Metadata (common) -->
        <VDivider class="my-6" />
        <h3 class="text-subtitle-2 font-weight-bold mb-4">Métadonnées</h3>

        <VRow>
          <VCol cols="12" sm="6" md="4">
            <VSelect
              v-model="formData.difficulte"
              label="Difficulté *"
              :items="difficultOptions"
              @update:model-value="updatePonderation"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <VTextField
              v-model.number="formData.dureeSecondes"
              label="Durée (secondes) *"
              type="number"
              variant="outlined"
              :rules="[required('Durée'), minMax('Durée', 5, 600)]"
              min="5"
              max="600"
              suffix="s"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField
              v-model.number="formData.ponderation"
              label="Pondération"
              variant="outlined"
              disabled
              suffix="pts"
            />
          </VCol>
        </VRow>

        <!-- Validation errors -->
        <div v-if="validationErrors.length > 0" class="mt-4">
          <VAlert type="error" variant="tonal" class="mb-4">
            <VAlertTitle>Erreurs de validation</VAlertTitle>
            <ul class="mt-2">
              <li v-for="(error, idx) in validationErrors" :key="idx">
                {{ error }}
              </li>
            </ul>
          </VAlert>
        </div>
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
          :disabled="validationErrors.length > 0"
        >
          {{ isEditMode ? "Mettre à jour" : "Créer" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type {
  NiveauDifficulte,
  QuestionDTO,
  TypeQuestion,
} from "@/@admin/types/admin";
import { computed, ref, watch } from "vue";
import QCMMultipleForm from "./types/QCMMultipleForm.vue";
import QCMSimpleForm from "./types/QCMSimpleForm.vue";
import ReponseLiureForm from "./types/ReponseLiureForm.vue";
import VraiFauxForm from "./types/VraiFauxForm.vue";

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
const isSubmitting = ref(false);

const typeOptions = [
  {
    value: "QCM_SIMPLE" as const,
    title: "QCM Simple",
    description: "1 bonne réponse",
    icon: "◯",
  },
  {
    value: "QCM_MULTIPLE" as const,
    title: "QCM Multiple",
    description: "≥2 bonnes réponses",
    icon: "☑",
  },
  {
    value: "VRAI_FAUX" as const,
    title: "Vrai/Faux",
    description: "2 choix seulement",
    icon: "✓✗",
  },
  {
    value: "REPONSE_LIBRE" as const,
    title: "Réponse libre",
    description: "Texte libre",
    icon: "✎",
  },
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
  choix: [{ id: 1, contenu: "", ordre: 1, estCorrect: false }],
});

const isEditMode = computed(() => !!props.question);

// Validation
const validationErrors = computed(() => {
  const errors: string[] = [];

  // Énoncé
  if (!formData.value.enonce || formData.value.enonce.trim().length < 10) {
    errors.push("✗ Énoncé trop court (min 10 caractères)");
  }

  // Choix
  if (formData.value.choix.length === 0) {
    errors.push("✗ Aucune réponse");
  }

  if (formData.value.choix.some((c) => !c.contenu || c.contenu.trim() === "")) {
    errors.push("✗ Réponses vides");
  }

  // Bonnes réponses
  const correctCount = formData.value.choix.filter((c) => c.estCorrect).length;

  if (formData.value.type === "QCM_SIMPLE" && correctCount !== 1) {
    errors.push("✗ QCM Simple: Exactement 1 bonne réponse");
  }

  if (formData.value.type === "QCM_MULTIPLE" && correctCount < 2) {
    errors.push("✗ QCM Multiple: Au minimum 2 bonnes réponses");
  }

  if (formData.value.type === "VRAI_FAUX" && correctCount !== 1) {
    errors.push("✗ Vrai/Faux: Exactement 1 réponse correcte");
  }

  // Mauvaises réponses (pas pour RÉPONSE_LIBRE)
  if (formData.value.type !== "REPONSE_LIBRE") {
    const wrongCount = formData.value.choix.filter((c) => !c.estCorrect).length;
    if (wrongCount === 0) {
      errors.push("✗ Au minimum 1 mauvaise réponse");
    }
  }

  // Difficulté
  if (!["FACILE", "MOYEN", "DIFFICILE"].includes(formData.value.difficulte)) {
    errors.push("✗ Difficulté invalide");
  }

  // Durée
  if (formData.value.dureeSecondes < 5 || formData.value.dureeSecondes > 600) {
    errors.push("✗ Durée doit être entre 5 et 600 secondes");
  }

  return errors;
});

const required = (field: string) => (v: any) =>
  v ? true : `${field} est requis`;

const minMax = (field: string, min: number, max: number) => (v: any) =>
  v >= min && v <= max ? true : `${field} doit être entre ${min} et ${max}`;

const selectType = (type: TypeQuestion) => {
  formData.value.type = type;
  // Réinitialiser les choix selon le type
  switch (type) {
    case "QCM_SIMPLE":
      formData.value.choix = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        contenu: "",
        ordre: i + 1,
        estCorrect: i === 0,
      }));
      break;
    case "QCM_MULTIPLE":
      formData.value.choix = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        contenu: "",
        ordre: i + 1,
        estCorrect: i < 2,
      }));
      break;
    case "VRAI_FAUX":
      formData.value.choix = [
        { id: 1, contenu: "VRAI", ordre: 1, estCorrect: true },
        { id: 2, contenu: "FAUX", ordre: 2, estCorrect: false },
      ];
      break;
    case "REPONSE_LIBRE":
      formData.value.choix = [
        { id: 1, contenu: "", ordre: 1, estCorrect: true },
      ];
      break;
  }
};

const updatePonderation = () => {
  formData.value.ponderation = ponderationMap[formData.value.difficulte] || 1.5;
};

const submitForm = async () => {
  if (validationErrors.value.length > 0) return;

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
  },
);

watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      close();
    }
  },
);
</script>

<style scoped lang="scss">
.type-card {
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    border-color: #2196f3;
    background-color: #f0f7ff;
  }

  &.active {
    border-color: #2196f3;
    background-color: #e3f2fd;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  }
}

.type-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.type-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.type-description {
  font-size: 12px;
  color: #666;
}

ul {
  margin: 0;
  padding-left: 20px;

  li {
    margin: 4px 0;
  }
}
</style>
