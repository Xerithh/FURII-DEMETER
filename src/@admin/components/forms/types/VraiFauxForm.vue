<template>
  <div>
    <h3 class="text-subtitle-2 font-weight-bold mb-4">
      Vrai/Faux - 2 choix fixes
    </h3>

    <VAlert type="info" variant="tonal" class="mb-4">
      Sélectionnez si la déclaration est VRAI ou FAUX
    </VAlert>

    <VRow>
      <VCol cols="12" v-for="(choix, index) in modelValue.choix" :key="index">
        <VCard class="pa-3 answer-card">
          <VRow class="align-center">
            <VCol cols="1" class="d-flex justify-center">
              <VRadio
                :model-value="choix.estCorrect"
                @update:model-value="selectCorrect(index)"
                name="correct"
              />
            </VCol>
            <VCol cols="11">
              <div
                class="choice-label"
                :class="choix.contenu === 'VRAI' ? 'vrai' : 'faux'"
              >
                <strong>{{ choix.contenu }}</strong>
              </div>
              <div class="choice-hint">
                {{
                  choix.contenu === "VRAI"
                    ? "La déclaration est correcte"
                    : "La déclaration est incorrecte"
                }}
              </div>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: any;
}

interface Emits {
  (e: "update:modelValue", data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectCorrect = (index: number) => {
  const updated = {
    ...props.modelValue,
    choix: props.modelValue.choix.map((c, i) => ({
      ...c,
      estCorrect: i === index,
    })),
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

.choice-label {
  font-size: 16px;
  padding: 8px;
  border-radius: 4px;
  text-align: center;

  &.vrai {
    background-color: #c8e6c9;
    color: #2e7d32;
  }

  &.faux {
    background-color: #ffcdd2;
    color: #c62828;
  }
}

.choice-hint {
  font-size: 12px;
  margin-top: 4px;
  color: #666;
  font-style: italic;
}
</style>
