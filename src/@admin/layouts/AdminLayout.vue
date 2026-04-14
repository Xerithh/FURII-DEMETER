<template>
  <VApp>
    <AdminHeader />
    <VContainer class="admin-container mt-16">
      <VRow>
        <VCol cols="12" md="3" class="hidden-sm-and-down">
          <AdminSidebar />
        </VCol>
        <VCol cols="12" md="9">
          <RouterView />
        </VCol>
      </VRow>
    </VContainer>
  </VApp>
</template>

<script setup lang="ts">
import AdminHeader from '@/@admin/components/AdminHeader.vue';
import AdminSidebar from '@/@admin/components/AdminSidebar.vue';
</script>

<style scoped lang="scss">
.admin-container {
  min-height: calc(100vh - 100px);
}
</style>
