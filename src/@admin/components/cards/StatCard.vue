<template>
  <div class="stat-card-wrapper">
    <VCard class="stat-card h-100" variant="elevated">
      <!-- Icône de fond très grande -->
      <div class="stat-bg-icon">
        <VIcon :icon="icon" size="120" />
      </div>

      <!-- Contenu -->
      <VCardText class="stat-card-content">
        <div class="d-flex align-center gap-3">
          <VAvatar class="stat-avatar" :color="color" variant="tonal" size="48">
            <VIcon :icon="icon" size="24" />
          </VAvatar>
          <div class="flex-grow-1">
            <p class="text-h5 font-weight-bold mb-0" :class="`text-${color}`">
              {{ formattedValue }}
            </p>
            <p class="text-xs text-disabled mb-0">{{ label }}</p>
          </div>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  format?: "number" | "percent" | "none";
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  format: "none",
});

const formattedValue = computed(() => {
  if (props.format === "percent") {
    return `${Number(props.value).toFixed(1)}%`;
  }
  if (props.format === "number") {
    return Number(props.value).toLocaleString("fr-FR");
  }
  return props.value;
});
</script>

<style scoped lang="scss">
.stat-card-wrapper {
  position: relative;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);

    .stat-bg-icon {
      opacity: 0.35;
    }
  }
}

.stat-bg-icon {
  position: absolute;
  top: -20px;
  right: -20px;
  opacity: 0.08;
  transition: opacity 0.3s ease;
  color: currentColor;
  pointer-events: none;
  z-index: 0;
}

.stat-card-content {
  position: relative;
  z-index: 1;
  padding: 1rem;
}

.stat-avatar {
  min-width: 48px;
  box-shadow: none;
}
</style>
