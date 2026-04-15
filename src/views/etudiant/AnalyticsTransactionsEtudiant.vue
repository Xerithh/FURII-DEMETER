<script setup lang="ts">
import type { ActiviteRecenteDTO } from "@/services/dashboardService";
import { useDashboardStore } from "@/stores/dashboard";
import { computed } from "vue";
import { useRouter } from "vue-router";

const dashboardStore = useDashboardStore();
const router = useRouter();

// Mapping type API → icône + couleur visuelle
const getActivityVisuals = (type: string): { icon: string; color: string } => {
  const t = (type || "").toLowerCase();
  if (t.includes("quiz") || t.includes("evaluation"))
    return { icon: "bx-brain", color: "primary" };
  if (t.includes("module") || t.includes("cours"))
    return { icon: "bx-book-open", color: "info" };
  if (t.includes("complet"))
    return { icon: "bx-check-circle", color: "success" };
  if (t.includes("recommand")) return { icon: "bx-bulb", color: "warning" };
  return { icon: "bx-history", color: "secondary" };
};

const activities = computed(() => {
  const list = dashboardStore.data?.activiteRecente ?? [];
  // Limiter à 6 pour l'affichage
  return list.slice(0, 6).map((item: ActiviteRecenteDTO) => ({
    ...item,
    ...getActivityVisuals(item.type),
  }));
});

const navigateToHistoryDetail = (item: ActiviteRecenteDTO) => {
  const query: Record<string, string> = {
    search: item.titre,
    type: item.type,
  };
  router.push({ path: "/historique", query });
};
</script>

<template>
  <VCard
    title="Activités d'Apprentissage"
    class="h-100 flex-grow-1 d-flex flex-column"
  >
    <VCardText>
      <!-- LOADING -->
      <div v-if="dashboardStore.isLoading" class="py-4">
        <VSkeletonLoader
          v-for="i in 4"
          :key="i"
          type="list-item-avatar"
          class="mb-2"
        />
      </div>

      <!-- VIDE -->
      <div
        v-else-if="!activities.length"
        class="text-center py-6 text-medium-emphasis"
      >
        <VIcon icon="bx-history" size="32" class="mb-2" />
        <p class="text-body-2">Aucune activité récente</p>
      </div>

      <!-- LISTE RÉELLE -->
      <VList v-else class="card-list">
        <VListItem
          v-for="item in activities"
          :key="item.titre + item.date"
          class="cursor-pointer"
          @click="navigateToHistoryDetail(item)"
        >
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :color="item.color"
              :icon="item.icon"
              size="40"
            />
          </template>

          <VListItemTitle>{{ item.titre }}</VListItemTitle>
          <VListItemSubtitle>{{ item.type }}</VListItemSubtitle>

          <template #append>
            <VListItemAction>
              <VChip :color="item.color" size="small" variant="tonal">
                {{ item.resultat }}
              </VChip>
            </VListItemAction>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}

.cursor-pointer {
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(var(--v-theme-primary-rgb), 0.05);
  }
}
</style>
