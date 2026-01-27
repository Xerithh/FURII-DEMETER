<script setup>
import { ref, onMounted } from 'vue'
import HeroPage from './components/HeroPage.vue'
import logo from './assets/Logo-Seul-Couleur-AUXO.png'

const heroPageRef = ref(null)

// Définit le logo dans le HeroPage breadcrumb au montage
onMounted(() => {
  if (heroPageRef.value && typeof heroPageRef.value.setLogo === 'function') {
    heroPageRef.value.setLogo(logo)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <HeroPage ref="heroPageRef" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
