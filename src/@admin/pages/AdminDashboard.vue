<template>
  <div class="admin-dashboard">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <h1 class="text-h4 font-weight-bold mb-6">Dashboard Admin</h1>

    <!-- Loading state -->
    <VProgressLinear v-if="adminStore.isDashboardLoading" indeterminate />

    <!-- Skeleton - Phase 2 -->
    <VRow>
      <VCol cols="12">
        <VCard class="pa-6">
          <p class="text-center text-grey">
            Dashboard en développement - Phase 2
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
    title: 'Dashboard',
    disabled: true,
  },
];

onMounted(() => {
  // Sera implémenté en Phase 2
  // adminStore.fetchDashboard();
});
</script>
