<template>
  <div>
    <h3 class="text-subtitle-2 font-weight-bold mb-4">
      QCM Multiple - ≥2 bonnes réponses
    </h3>

    <VAlert type="warning" variant="tonal" class="mb-4">
      <strong>{{ correctCount }}/{{ modelValue.choix.length }}</strong>
      réponse(s) correcte(s) (Minimum 2 requis) - Cochez les bonnes réponses
    </VAlert>

    <VRow>
      <VCol cols="12" v-for="(choix, index) in modelValue.choix" :key="index">
        <VCard
          class="pa-4 answer-card"
          :class="{
            'correct-answer': choix.estCorrect,
            'wrong-answer': !choix.estCorrect,
          }"
          @click="toggleCorrect(index, !choix.estCorrect)"
          style="cursor: pointer; transition: all 0.2s"
        >
          <VRow class="align-center">
            <VCol cols="1" class="d-flex justify-center">
              <div class="checkbox-visual">
                <VCheckbox
                  :model-value="choix.estCorrect"
                  @click.stop
                  @update:model-value="toggleCorrect(index, $event)"
                />
              </div>
            </VCol>
            <VCol cols="7">
              <VTextField
                v-model="choix.contenu"
                placeholder="Texte de la réponse..."
                variant="plain"
                density="compact"
                full-width
                @click.stop
              />
            </VCol>
            <VCol cols="2" class="d-flex justify-center">
              <VBadge
                :content="choix.estCorrect ? '✓ OK' : '✗ NON'"
                :color="choix.estCorrect ? 'success' : 'secondary'"
                class="badge-label"
              >
                <span></span>
              </VBadge>
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
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
  position: relative;

  &:hover {
    border-color: #2196f3;
    box-shadow: 0 2px 6px rgba(33, 150, 243, 0.2);
  }

  &.correct-answer {
    border-color: #4caf50;
    background-color: #f1f8f4;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);

    &:hover {
      border-color: #388e3c;
      background-color: #e8f5e9;
    }
  }

  &.wrong-answer {
    border-color: #e0e0e0;
    background-color: #fafafa;
  }
}

.checkbox-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-label {
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.gap-1 {
  gap: 4px;
}
</style>
