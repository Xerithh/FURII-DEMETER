<template>
  <div class="admin-dashboard">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Dashboard Admin</h1>
      <VBtn
        color="primary"
        variant="tonal"
        prepend-icon="bx:refresh"
        @click="refresh"
        :loading="adminStore.isDashboardLoading"
      >
        Actualiser
      </VBtn>
    </div>

    <!-- Loading state -->
    <VProgressLinear
      v-if="adminStore.isDashboardLoading"
      indeterminate
      class="mb-6"
    />

    <!-- KPI Cards Row -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Utilisateurs"
          :value="adminStore.dashboard?.totalUtilisateurs || 0"
          icon="bx:users"
          color="primary"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Étudiants FIE3"
          :value="adminStore.dashboard?.totalEtudiantsFIE3 || 0"
          icon="bx:user-check"
          color="success"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Candidats VAE"
          :value="adminStore.dashboard?.totalCandidatsVAE || 0"
          icon="bx:briefcase"
          color="info"
          format="number"
        />
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <KPICard
          label="Sessions en Cours"
          :value="adminStore.dashboard?.sessionsEnCours || 0"
          icon="bx:play-circle"
          color="warning"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <KPICard
          label="Taux de Réussite"
          :value="adminStore.dashboard?.tauxReussite || 0"
          icon="bx:trending-up"
          color="success"
          format="percent"
        />
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <KPICard
          label="Score Moyen Global"
          :value="(adminStore.dashboard?.scoreMoyenGlobal || 0) * 100"
          icon="bx:bar-chart"
          color="primary"
          format="percent"
        />
      </VCol>
    </VRow>

    <!-- Charts Row -->
    <VRow>
      <VCol cols="12" lg="8">
        <CompetenceChart
          title="Top 5 Compétences (Meilleures Performances)"
          :data="adminStore.dashboard?.competencesTopPerformance || []"
        />
      </VCol>
      <VCol cols="12" lg="4">
        <ReussiteChart
          :taux-reussite="adminStore.dashboard?.tauxReussite || 0"
        />
      </VCol>
    </VRow>

    <!-- Bottom Competence Chart -->
    <VRow class="mt-6">
      <VCol cols="12">
        <CompetenceChart
          title="Compétences avec Lacunes Détectées"
          :data="adminStore.dashboard?.competencesLacunes || []"
        />
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from "@/@admin/stores/admin";
import { onMounted } from "vue";
import KPICard from "@/@admin/components/cards/KPICard.vue";
import CompetenceChart from "@/@admin/components/charts/CompetenceChart.vue";
import ReussiteChart from "@/@admin/components/charts/ReussiteChart.vue";

const adminStore = useAdminStore();

const breadcrumbs = [
  {
    title: "Admin",
    href: "/admin",
    disabled: false,
  },
  {
    title: "Dashboard",
    disabled: true,
  },
];

onMounted(() => {
  adminStore.fetchDashboard();
});

const refresh = () => {
  adminStore.fetchDashboard();
};
</script>

<style scoped lang="scss">
.admin-dashboard {
  padding: 0;
}
</style>

