<template>
  <div class="admin-statistiques">
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <PageHeader
              icon="bx-bar-chart-alt-2"
              title="Statistiques des Sessions"
              subtitle="Suivez l'activité globale et les indicateurs de progression."
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

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
import { useAdminStore } from "@/@admin/stores/admin";
import PageHeader from "@/components/PageHeader.vue";
import { onMounted } from "vue";

const adminStore = useAdminStore();

onMounted(() => {
  // Sera implémenté en Phase 5
  // adminStore.fetchSessionStatistics();
});
</script>
