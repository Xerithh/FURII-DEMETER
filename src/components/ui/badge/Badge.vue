<script setup lang="ts">
interface BadgeProps {
  variant?: 'default' | 'muted'
}

withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
    :class="variant === 'default'
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : 'border-slate-200 bg-slate-100 text-slate-600'"
  >
    <slot />
  </span>
</template>
