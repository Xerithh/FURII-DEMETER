<template>
  <div class="admin-questions">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Gestion des Questions</h1>
      <VBtn
        color="primary"
        prepend-icon="bx:plus"
        @click="showCreateDialog = true"
      >
        Ajouter Question
      </VBtn>
    </div>

    <!-- Loading state -->
    <VProgressLinear v-if="adminStore.isQuestionsLoading" indeterminate />

    <!-- Skeleton - Phase 4 -->
    <VRow>
      <VCol cols="12">
        <VCard class="pa-6">
          <p class="text-center text-grey">
            Gestion des questions en développement - Phase 4
          </p>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/@admin/stores/admin';

const adminStore = useAdminStore();
const showCreateDialog = ref(false);

const breadcrumbs = [
  {
    title: 'Admin',
    href: '/admin',
    disabled: false,
  },
  {
    title: 'Questions',
    disabled: true,
  },
];

onMounted(() => {
  // Sera implémenté en Phase 4
  // adminStore.fetchQuestions();
});
</script>
