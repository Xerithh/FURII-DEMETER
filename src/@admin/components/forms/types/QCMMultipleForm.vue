<template>
  <div>
    <h3 class="text-subtitle-2 font-weight-bold mb-4">
      QCM Multiple - ≥2 bonnes réponses (checkboxes)
    </h3>

    <VAlert type="info" variant="tonal" class="mb-4">
      {{ correctCount }} réponse(s) correcte(s) - Minimum 2 requis
    </VAlert>

    <VRow>
      <VCol cols="12" v-for="(choix, index) in modelValue.choix" :key="index">
        <VCard class="pa-3 answer-card">
          <VRow class="align-center">
            <VCol cols="1" class="d-flex justify-center">
              <VCheckbox
                :model-value="choix.estCorrect"
                @update:model-value="toggleCorrect(index, $event)"
              />
            </VCol>
            <VCol cols="9">
              <VTextField
                v-model="choix.contenu"
                placeholder="Réponse..."
                variant="outlined"
                dense
                full-width
              />
            </VCol>
            <VCol cols="2" class="d-flex align-center gap-1">
              <VBtn
                icon="bx:plus"
                size="x-small"
                variant="text"
                color="success"
                @click="addChoice"
                v-if="
                  index === modelValue.choix.length - 1 &&
                  modelValue.choix.length < 10
                "
              />
              <VBtn
                icon="bx:trash"
                size="x-small"
                variant="text"
                color="error"
                @click="removeChoice(index)"
                v-if="modelValue.choix.length > 2"
              />
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: any;
}

interface Emits {
  (e: "update:modelValue", data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const correctCount = computed(
  () => props.modelValue.choix.filter((c) => c.estCorrect).length,
);

const toggleCorrect = (index: number, value: boolean) => {
  const updated = {
    ...props.modelValue,
    choix: props.modelValue.choix.map((c, i) => ({
      ...c,
      estCorrect: i === index ? value : c.estCorrect,
    })),
  };
  emit("update:modelValue", updated);
};

const addChoice = () => {
  const updated = {
    ...props.modelValue,
    choix: [
      ...props.modelValue.choix,
      {
        id: Date.now(),
        contenu: "",
        ordre: props.modelValue.choix.length + 1,
        estCorrect: false,
      },
    ],
  };
  emit("update:modelValue", updated);
};

const removeChoice = (index: number) => {
  const updated = {
    ...props.modelValue,
    choix: props.modelValue.choix.filter((_, i) => i !== index),
  };
  emit("update:modelValue", updated);
};
</script>

<style scoped lang="scss">
.answer-card {
  border-left: 3px solid #e0e0e0;
  transition: all 0.2s;

  &:hover {
    border-left-color: #2196f3;
  }
}

.gap-1 {
  gap: 4px;
}
</style>
