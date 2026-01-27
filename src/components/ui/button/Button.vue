<script setup>
import { computed } from 'vue'
import { Primitive } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'sm', 'lg', 'icon'].includes(value),
  },
  as: {
    type: [String, Object],
    default: 'button',
  },
  asChild: {
    type: Boolean,
    default: false,
  },
})

const buttonVariants = {
  variant: {
    default: 'bg-primary text-white hover:bg-primary/90',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
    outline: 'border border-input bg-background text-white hover:bg-accent',
    secondary: 'bg-secondary text-white hover:bg-secondary/80',
    ghost: 'text-white hover:bg-accent',
    link: 'text-white underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
}

const buttonClass = computed(() =>
  cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    buttonVariants.variant[props.variant],
    buttonVariants.size[props.size]
  )
)
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="buttonClass"
  >
    <slot />
  </Primitive>
</template>
