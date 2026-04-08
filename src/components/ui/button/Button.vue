<script setup lang="ts">
interface ButtonProps {
  as?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg'
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
  type: 'button',
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    class="inline-flex items-center justify-center rounded-lg font-medium transition-colors"
    :class="[
      size === 'lg' ? 'h-11 px-5 text-base' : 'h-10 px-4 text-sm',
      variant === 'default'
        ? 'bg-[#1d4ed8] text-white hover:bg-[#1e40af]'
        : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100',
    ]"
  >
    <slot />
  </component>
</template>
