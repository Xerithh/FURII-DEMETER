<script setup lang="ts">
interface CardProps {
  as?: string
}

withDefaults(defineProps<CardProps>(), {
  as: 'div',
})
</script>

<template>
  <component
    :is="as"
    class="rounded-2xl border border-slate-200 bg-white shadow-sm"
  >
    <slot />
  </component>
</template>
