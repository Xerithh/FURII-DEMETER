<template>
  <VAppBar app fixed :color="isDark ? 'grey-900' : 'primary'">
    <VAppBarTitle class="font-weight-bold">
      <VIcon icon="bx:dashboard" class="mr-2" />
      ISISU Admin
    </VAppBarTitle>

    <VSpacer />

    <!-- User Profile Menu -->
    <VMenu v-if="authStore.user">
      <template #activator="{ props }">
        <VBtn icon v-bind="props">
          <VIcon icon="bx:user-circle" />
        </VBtn>
      </template>
      <VList min-width="200">
        <VListItem subtitle="Connecté" :title="authStore.user.email" />
        <VDivider />
        <VListItem
          title="Déconnexion"
          prepend-icon="bx:log-out"
          @click="logout"
        />
      </VList>
    </VMenu>
  </VAppBar>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useTheme } from "vuetify";

const authStore = useAuthStore();
const theme = useTheme();

const isDark = () => theme.global.current.value.dark;

const logout = () => {
  authStore.logout();
  window.location.href = "/login";
};
</script>
