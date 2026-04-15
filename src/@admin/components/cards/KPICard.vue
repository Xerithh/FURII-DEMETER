<template>
  <VCard class="kpi-card h-100" variant="elevated">
    <VCardItem>
      <template #prepend>
        <div class="kpi-icon" :style="{ backgroundColor: `${color}20` }">
          <VIcon :icon="icon" :color="color" size="28" />
        </div>
      </template>
      <div class="kpi-content">
        <p class="kpi-label text-body-2 text-medium-emphasis">{{ label }}</p>
        <p class="kpi-value text-h5 font-weight-bold">{{ formattedValue }}</p>
        <p v-if="subtitle" class="kpi-subtitle text-caption text-medium-emphasis">
          {{ subtitle }}
        </p>
      </div>
    </VCardItem>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  subtitle?: string;
  format?: 'number' | 'percent' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  format: 'none',
});

const formattedValue = computed(() => {
  if (props.format === 'percent') {
    return `${Number(props.value).toFixed(1)}%`;
  }
  if (props.format === 'number') {
    return Number(props.value).toLocaleString('fr-FR');
  }
  return props.value;
});
</script>

<style scoped lang="scss">
.kpi-card {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
}

.kpi-content {
  flex: 1;
  padding-left: 12px;
}

.kpi-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.kpi-value {
  margin: 4px 0;
  line-height: 1.2;
}

.kpi-subtitle {
  margin: 4px 0 0;
}
</style>
