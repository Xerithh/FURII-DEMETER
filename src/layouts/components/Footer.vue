<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      AUXO - Plateforme d'Apprentissage Personnalisé
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a href="#">Confidentialité</a>
      <a href="#">Conditions d'utilisation</a>
      <a href="#">Centre d'aide</a>
      <a href="#">Contacter le Support</a>
    </span>
  </div>
</template>
