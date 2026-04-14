<template>
  <div class="admin-users">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <h1 class="text-h4 font-weight-bold mb-6">Gestion des Utilisateurs</h1>

    <!-- Loading state -->
    <VProgressLinear v-if="adminStore.isUsersLoading" indeterminate />

    <!-- Skeleton - Phase 3 -->
    <VRow>
      <VCol cols="12">
        <VCard class="pa-6">
          <p class="text-center text-grey">
            Gestion utilisateurs en développement - Phase 3
          </p>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/@admin/stores/admin';

const adminStore = useAdminStore();

const breadcrumbs = [
  {
    title: 'Admin',
    href: '/admin',
    disabled: false,
  },
  {
    title: 'Utilisateurs',
    disabled: true,
  },
];

onMounted(() => {
  // Sera implémenté en Phase 3
  // adminStore.fetchUsers();
});
</script>
