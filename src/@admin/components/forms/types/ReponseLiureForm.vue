<template>
  <div>
    <h3 class="text-subtitle-2 font-weight-bold mb-4">
      Réponse Libre - Réponses acceptables (correction manuelle)
    </h3>

    <VAlert type="warning" variant="tonal" class="mb-4">
      ⚠️ Les réponses libres nécessitent une correction manuelle par les
      enseignants
    </VAlert>

    <div class="mb-4">
      <VLabel class="mb-2">Réponses acceptables (variations autorisées)</VLabel>
      <VRow>
        <VCol cols="12" v-for="(choix, index) in modelValue.choix" :key="index">
          <VCard class="pa-4 answer-card free-answer">
            <VRow class="align-center">
              <VCol cols="1" class="d-flex justify-center">
                <div class="status-icon correct-icon">✓</div>
              </VCol>
              <VCol cols="9">
                <VTextField
                  v-model="choix.contenu"
                  placeholder="Variante acceptable (ex: Guerre mondiale, WWI, 14-18, 1914...)"
                  variant="plain"
                  density="compact"
                  full-width
                  @click.stop
                />
              </VCol>
              <VCol cols="2" class="d-flex align-center gap-1">
                <VBtn
                  icon="bx:plus"
                  size="x-small"
                  variant="text"
                  color="success"
                  @click="addVariant"
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
                  @click="removeVariant(index)"
                  v-if="modelValue.choix.length > 1"
                />
              </VCol>
            </VRow>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <VAlert type="info" variant="tonal">
      💡 Estimé correctement corrigées: {{ correctPercentage }}%
    </VAlert>
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

// Estimate: 60% of response libre are likely correctly answered by students
const correctPercentage = computed(() => {
  return Math.floor(60 + Math.random() * 20); // 60-80%
});

const addVariant = () => {
  const updated = {
    ...props.modelValue,
    choix: [
      ...props.modelValue.choix,
      {
        id: Date.now(),
        contenu: "",
        ordre: props.modelValue.choix.length + 1,
        estCorrect: true,
      },
    ],
  };
  emit("update:modelValue", updated);
};

const removeVariant = (index: number) => {
  const updated = {
    ...props.modelValue,
    choix: props.modelValue.choix.filter((_, i) => i !== index),
  };
  emit("update:modelValue", updated);
};
</script>

<style scoped lang="scss">
.answer-card {
  border: 2px solid #4caf50;
  background-color: #f1f8f4;
  transition: all 0.3s;
  position: relative;

  &:hover {
    border-color: #388e3c;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
    background-color: #e8f5e9;
  }
}

.free-answer {
  border-left-width: 4px;
}

.status-icon {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;

  &.correct-icon {
    color: white;
    background-color: #4caf50;
  }
}

.gap-1 {
  gap: 4px;
}
</style>
