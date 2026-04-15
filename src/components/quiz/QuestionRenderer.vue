<script setup lang="ts">
import type { ChoiceDTO, QuestionDisplayDTO } from "@/types/quiz";
import { QuestionType } from "@/types/quiz";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  question: QuestionDisplayDTO;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: any): void;
}>();

// Form state
const selectedChoice = ref<number | null>(null);
const selectedChoices = ref<number[]>([]);
const textInput = ref<string>("");
const matchingSelections = ref<Record<number, number | null>>({});
const orderedChoices = ref<ChoiceDTO[]>([]);
const draggedChoiceId = ref<number | null>(null);
const selectedVraiFaux = ref<boolean | null>(null);

const normalizeSide = (raw: unknown): string => {
  const side = String(raw || "").toUpperCase();
  if (["LEFT", "GAUCHE", "CONCEPT", "TERM", "TERME"].includes(side))
    return "LEFT";
  if (["RIGHT", "DROITE", "DEFINITION", "DEFINITIONS", "DESC"].includes(side))
    return "RIGHT";
  return "";
};

const matchingModel = computed(() => {
  if (props.question.type !== QuestionType.APPARIEMENT) {
    return { left: [], right: [] as { id: number; label: string }[] };
  }

  const all = props.question.choices || [];
  if (!all.length) {
    return { left: [], right: [] as { id: number; label: string }[] };
  }

  const explicitLeft = all.filter((c) => normalizeSide(c.cote) === "LEFT");
  const explicitRight = all.filter((c) => normalizeSide(c.cote) === "RIGHT");

  if (explicitLeft.length && explicitRight.length) {
    return {
      left: explicitLeft.map((c) => ({ id: c.id, label: c.text })),
      right: explicitRight.map((c) => ({ id: c.id, label: c.text })),
    };
  }

  const half = Math.ceil(all.length / 2);
  return {
    left: all.slice(0, half).map((c) => ({ id: c.id, label: c.text })),
    right: all.slice(half).map((c) => ({ id: c.id, label: c.text })),
  };
});

const matchingOptions = computed(() =>
  matchingModel.value.right.map((item) => ({
    title: item.label,
    value: item.id,
  })),
);

const isMatchingComplete = computed(() => {
  if (props.question.type !== QuestionType.APPARIEMENT) return true;
  if (!matchingModel.value.left.length || !matchingModel.value.right.length)
    return false;

  const selected = matchingModel.value.left
    .map((left) => matchingSelections.value[left.id])
    .filter((id): id is number => typeof id === "number");

  if (selected.length !== matchingModel.value.left.length) return false;
  return new Set(selected).size === selected.length;
});

// Reset state when question changes
watch(
  () => props.question,
  () => {
    selectedChoice.value = null;
    selectedChoices.value = [];
    textInput.value = "";
    matchingSelections.value = {};
    orderedChoices.value = (props.question.choices || []).map((choice) => ({
      ...choice,
    }));
    draggedChoiceId.value = null;
    selectedVraiFaux.value = null;
  },
  { immediate: true },
);

const isSubmitDisabled = computed(() => {
  if (props.isLoading) return true;
  switch (props.question.type) {
    case QuestionType.QCM_SIMPLE:
      return selectedChoice.value === null;
    case QuestionType.QCM_MULTIPLE:
      return selectedChoices.value.length === 0;
    case QuestionType.TEXTE_TROU:
      return textInput.value.trim() === "";
    case QuestionType.APPARIEMENT:
      return !isMatchingComplete.value;
    case QuestionType.ORDRE:
      return orderedChoices.value.length === 0;
    default:
      return props.question.choices && props.question.choices.length > 0
        ? selectedChoices.value.length === 0
        : false;
  }
});

const handleSubmit = (overridePayload?: any) => {
  let payload: any = {};

  if (overridePayload) {
    payload = overridePayload;
  } else {
    switch (props.question.type) {
      case QuestionType.QCM_SIMPLE:
        payload = {
          choixIds: selectedChoice.value !== null ? [selectedChoice.value] : [],
        };
        break;
      case QuestionType.QCM_MULTIPLE:
        payload = { choixIds: selectedChoices.value };
        break;
      case QuestionType.TEXTE_TROU:
        payload = { reponseTexte: textInput.value };
        break;
      case QuestionType.APPARIEMENT: {
        const appariements = matchingModel.value.left
          .map((left) => ({
            gaucheChoixId: left.id,
            droiteChoixId: matchingSelections.value[left.id],
          }))
          .filter((pair) => typeof pair.droiteChoixId === "number")
          .map((pair) => ({
            gaucheChoixId: pair.gaucheChoixId,
            droiteChoixId: pair.droiteChoixId as number,
          }));

        payload = {
          appariements,
          associations: appariements,
          reponseTexte: JSON.stringify(appariements),
        };
        break;
      }
      case QuestionType.ORDRE: {
        const orderedIds = orderedChoices.value.map((choice) => choice.id);
        payload = {
          choixIds: orderedIds,
          ordreIds: orderedIds,
          reponseTexte: JSON.stringify(orderedIds),
        };
        break;
      }
      default:
        // Try passing generic choices if any were selected in fallback UI
        payload = { choixIds: selectedChoices.value };
        break;
    }
  }

  // Common properties
  payload.questionSessionId = props.question.questionSessionId || 0;
  emit("submit", payload);
};

const handleVraiFaux = (val: boolean) => {
  selectedVraiFaux.value = val;
  // Usually for Vrai/Faux, if we don't have choices, we send explicit text or boolean
  // If we have specific choices mapping to Vrai and Faux we could use their IDs.
  // For generic case, let's send text "true" / "false" or "vrai" / "faux"
  handleSubmit({ reponseTexte: val ? "vrai" : "faux" });
};

const onOrderDragStart = (choiceId: number) => {
  draggedChoiceId.value = choiceId;
};

const onOrderDrop = (targetChoiceId: number) => {
  if (
    draggedChoiceId.value == null ||
    draggedChoiceId.value === targetChoiceId
  ) {
    return;
  }

  const fromIndex = orderedChoices.value.findIndex(
    (item) => item.id === draggedChoiceId.value,
  );
  const toIndex = orderedChoices.value.findIndex(
    (item) => item.id === targetChoiceId,
  );

  if (fromIndex === -1 || toIndex === -1) return;

  const [moved] = orderedChoices.value.splice(fromIndex, 1);
  orderedChoices.value.splice(toIndex, 0, moved);
  draggedChoiceId.value = null;
};

const onOrderDragEnd = () => {
  draggedChoiceId.value = null;
};
</script>

<template>
  <div class="question-container mt-6">
    <h3 class="text-h5 font-weight-medium mb-6 text-center">
      {{ question.questionText }}
    </h3>

    <!-- QCM SIMPLE -->
    <div
      v-if="question.type === QuestionType.QCM_SIMPLE"
      class="qcm-simple-wrapper"
    >
      <v-radio-group v-model="selectedChoice" hide-details class="mt-4">
        <template v-for="choice in question.choices || []" :key="choice.id">
          <v-card
            variant="outlined"
            :class="[
              'mb-4 cursor-pointer hover-card',
              selectedChoice === choice.id ? 'selected-card' : '',
            ]"
            @click="selectedChoice = choice.id"
          >
            <v-card-text class="d-flex align-center gap-3">
              <v-radio :value="choice.id" color="primary" />
              <div
                class="choice-content text-body-1"
                v-html="choice.text"
              ></div>
            </v-card-text>
          </v-card>
        </template>
      </v-radio-group>
    </div>

    <!-- QCM MULTIPLE -->
    <div
      v-else-if="question.type === QuestionType.QCM_MULTIPLE"
      class="qcm-multiple-wrapper"
    >
      <template v-for="choice in question.choices || []" :key="choice.id">
        <v-card
          variant="outlined"
          :class="[
            'mb-4 cursor-pointer hover-card',
            selectedChoices.includes(choice.id) ? 'selected-card' : '',
          ]"
          @click="
            (() => {
              const idx = selectedChoices.indexOf(choice.id);
              if (idx === -1) selectedChoices.push(choice.id);
              else selectedChoices.splice(idx, 1);
            })()
          "
        >
          <v-card-text class="d-flex align-center gap-3">
            <v-checkbox
              v-model="selectedChoices"
              :value="choice.id"
              color="primary"
              hide-details
            />
            <div class="choice-content text-body-1" v-html="choice.text"></div>
          </v-card-text>
        </v-card>
      </template>
    </div>

    <!-- VRAI / FAUX -->
    <div
      v-else-if="question.type === QuestionType.VRAI_FAUX"
      class="vrai-faux-wrapper d-flex gap-4 justify-center mt-8"
    >
      <v-btn
        size="x-large"
        variant="outlined"
        :class="[
          'vrai-btn flex-grow-1 vf-btn',
          selectedVraiFaux === true ? 'vf-btn-selected' : '',
        ]"
        prepend-icon="bx-check-circle"
        :loading="isLoading"
        @click="handleVraiFaux(true)"
      >
        VRAI
      </v-btn>
      <v-btn
        size="x-large"
        variant="outlined"
        :class="[
          'faux-btn flex-grow-1 vf-btn',
          selectedVraiFaux === false ? 'vf-btn-selected' : '',
        ]"
        prepend-icon="bx-x-circle"
        :loading="isLoading"
        @click="handleVraiFaux(false)"
      >
        FAUX
      </v-btn>
    </div>

    <!-- TEXTE A TROU -->
    <div
      v-else-if="question.type === QuestionType.TEXTE_TROU"
      class="texte-trou-wrapper mt-8"
    >
      <v-text-field
        v-model="textInput"
        label="Votre réponse"
        variant="outlined"
        color="primary"
        hide-details
        clearable
        @keyup.enter="!isSubmitDisabled && handleSubmit()"
      ></v-text-field>
    </div>

    <!-- APPARIEMENT -->
    <div
      v-else-if="question.type === QuestionType.APPARIEMENT"
      class="appariement-wrapper mt-8"
    >
      <v-row
        v-for="leftItem in matchingModel.left"
        :key="leftItem.id"
        class="mb-3"
      >
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="pa-3 h-100">
            <div
              class="text-body-1 font-weight-medium"
              v-html="leftItem.label"
            ></div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="matchingSelections[leftItem.id]"
            :items="matchingOptions"
            label="Associer à la définition"
            variant="outlined"
            hide-details="auto"
            clearable
          />
        </v-col>
      </v-row>
    </div>

    <!-- ORDRE -->
    <div
      v-else-if="question.type === QuestionType.ORDRE"
      class="ordre-wrapper mt-8"
    >
      <v-alert type="info" variant="tonal" class="mb-4">
        Glissez-déposez les éléments pour les remettre dans le bon ordre.
      </v-alert>

      <v-card
        v-for="(choice, index) in orderedChoices"
        :key="choice.id"
        class="mb-3 order-item"
        variant="outlined"
        draggable="true"
        :class="{ 'is-dragged': draggedChoiceId === choice.id }"
        @dragstart="onOrderDragStart(choice.id)"
        @dragover.prevent
        @drop.prevent="onOrderDrop(choice.id)"
        @dragend="onOrderDragEnd"
      >
        <v-card-text class="d-flex align-center gap-3 py-3">
          <v-chip color="primary" size="small" variant="outlined">
            {{ index + 1 }}
          </v-chip>
          <v-icon icon="bx-move" class="drag-handle" />
          <div class="choice-content text-body-1" v-html="choice.text"></div>
        </v-card-text>
      </v-card>
    </div>

    <!-- UI GENÉRIQUE DE FALLBACK POUR TYPES INCONNUS (ex: ASSOCIATION) -->
    <div v-else class="fallback-wrapper mt-8">
      <v-alert type="info" variant="tonal" class="mb-4">
        Le type de question <strong>{{ question.type }}</strong> utilise un
        affichage générique de secours.
      </v-alert>
      <template v-for="choice in question.choices || []" :key="choice.id">
        <v-card
          variant="outlined"
          :class="[
            'mb-4 cursor-pointer hover-card',
            selectedChoices.includes(choice.id) ? 'selected-card' : '',
          ]"
          @click="
            (() => {
              const idx = selectedChoices.indexOf(choice.id);
              if (idx === -1) selectedChoices.push(choice.id);
              else selectedChoices.splice(idx, 1);
            })()
          "
        >
          <v-card-text class="d-flex align-center gap-3">
            <v-checkbox
              v-model="selectedChoices"
              :value="choice.id"
              color="primary"
              hide-details
            />
            <div class="choice-content text-body-1" v-html="choice.text"></div>
          </v-card-text>
        </v-card>
      </template>
    </div>

    <!-- Submit Button (except for Vrai/Faux which is immediate) -->
    <div
      v-if="question.type !== QuestionType.VRAI_FAUX"
      class="submit-wrapper mt-8 d-flex justify-center"
    >
      <v-btn
        color="primary"
        size="large"
        class="px-8"
        :disabled="isSubmitDisabled"
        :loading="isLoading"
        @click="handleSubmit()"
      >
        Valider la réponse
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.question-container {
  max-width: 800px;
  margin: 0 auto;
}

.qcm-simple-wrapper .choice-content {
  width: 100%;
  text-align: left;
}

.qcm-simple-wrapper :deep(.v-selection-control__wrapper) {
  margin-inline-end: 0.5rem;
}

.hover-card {
  transition: all 0.3s ease;
  border-color: rgba(var(--v-theme-on-surface), 0.12);

  &:hover {
    border-color: var(--v-theme-primary);
    background-color: rgba(var(--v-theme-primary), 0.04);
  }
}

.selected-card {
  border-color: var(--v-theme-primary) !important;
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.vrai-btn,
.faux-btn {
  max-width: 300px;
  min-height: 80px;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  color: rgba(var(--v-theme-on-surface), 0.86);
  border-color: rgba(var(--v-theme-on-surface), 0.2);
  background-color: rgba(var(--v-theme-on-surface), 0.03);

  &:hover {
    transform: translateY(-2px);
    color: rgb(var(--v-theme-primary));
    border-color: rgba(var(--v-theme-primary), 0.65);
    background-color: rgba(var(--v-theme-primary), 0.07);
  }
}

.vf-btn-selected {
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: rgb(var(--v-theme-primary)) !important;
}

.gap-4 {
  gap: 1rem;
}

.order-item {
  cursor: grab;
  user-select: none;
}

.order-item.is-dragged {
  opacity: 0.6;
  border-color: var(--v-theme-primary) !important;
}

.drag-handle {
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
