<template>
  <VAppBar app fixed :color="isDark ? 'grey-900' : 'primary'">
    <VAppBarTitle class="font-weight-bold">
      <Icon icon="bx:dashboard" class="mr-2" width="24" />
      ISISU Admin
    </VAppBarTitle>

    <VSpacer />

    <!-- User Profile Menu -->
    <VMenu v-if="authStore.user">
      <template #activator="{ props }">
        <VBtn icon v-bind="props">
          <Icon icon="bx:user-circle" width="28" />
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
import { useAuthStore } from '@/stores/auth';
import { useTheme } from 'vuetify';
import Icon from '@iconify/vue';

const authStore = useAuthStore();
const theme = useTheme();

const isDark = () => theme.global.current.value.dark;

const logout = () => {
  authStore.logout();
  window.location.href = '/login';
};
</script>
