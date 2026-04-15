<template>
  <div class="admin-statistiques">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <h1 class="text-h4 font-weight-bold mb-6">Statistiques des Sessions</h1>

    <!-- Loading state -->
    <VProgressLinear v-if="adminStore.isStatsLoading" indeterminate />

    <!-- Skeleton - Phase 5 -->
    <VRow>
      <VCol cols="12">
        <VCard class="pa-6">
          <p class="text-center text-grey">
            Statistiques en développement - Phase 5
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
    title: 'Statistiques',
    disabled: true,
  },
];

onMounted(() => {
  // Sera implémenté en Phase 5
  // adminStore.fetchSessionStatistics();
});
</script>
