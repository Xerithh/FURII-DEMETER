<template>
  <div
    class="h-100 d-flex align-center justify-md-space-between justify-center"
  >
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      AUXO - Plateforme d'Apprentissage Personnalisé
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <RouterLink :to="{ name: 'privacy' }">Confidentialité</RouterLink>
      <RouterLink :to="{ name: 'terms' }">Conditions d'utilisation</RouterLink>
      <RouterLink :to="{ name: 'help' }">Centre d'aide</RouterLink>
      <RouterLink :to="{ name: 'support' }">Contacter le Support</RouterLink>
    </span>
  </div>
</template>
