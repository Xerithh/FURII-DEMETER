<template>
  <VNavigationDrawer
    permanent
    class="bg-surface"
    :rail="rail"
    @mouseenter="rail = false"
    @mouseleave="rail = true"
  >
    <VList density="compact">
      <VListItem
        to="/admin"
        :title="rail ? undefined : 'Dashboard'"
        prepend-icon="bx:chart"
        @click="handleNavClick"
      />
      <VListItem
        to="/admin/users"
        :title="rail ? undefined : 'Utilisateurs'"
        prepend-icon="bx:user"
        @click="handleNavClick"
      />
      <VListItem
        to="/admin/questions"
        :title="rail ? undefined : 'Questions'"
        prepend-icon="bx:help-circle"
        @click="handleNavClick"
      />
      <VListItem
        to="/admin/statistiques"
        :title="rail ? undefined : 'Statistiques'"
        prepend-icon="bx:line-chart"
        @click="handleNavClick"
      />
    </VList>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const rail = ref(true);

const handleNavClick = () => {
  // Fermer le drawer sur mobile après un click
  if (window.innerWidth < 960) {
    rail.value = true;
  }
};
</script>
