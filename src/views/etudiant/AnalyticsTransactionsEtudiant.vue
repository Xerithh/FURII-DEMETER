<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard';
import type { ActiviteRecenteDTO } from '@/services/dashboardService';

const dashboardStore = useDashboardStore();

// Mapping type API → icône + couleur visuelle
const getActivityVisuals = (type: string): { icon: string; color: string } => {
  const t = (type || '').toLowerCase();
  if (t.includes('quiz') || t.includes('evaluation')) return { icon: 'bx-brain', color: 'primary' };
  if (t.includes('module') || t.includes('cours')) return { icon: 'bx-book-open', color: 'info' };
  if (t.includes('complet')) return { icon: 'bx-check-circle', color: 'success' };
  if (t.includes('recommand')) return { icon: 'bx-bulb', color: 'warning' };
  return { icon: 'bx-history', color: 'secondary' };
};

const activities = computed(() => {
  const list = dashboardStore.data?.activiteRecente ?? [];
  // Limiter à 6 pour l'affichage
  return list.slice(0, 6).map((item: ActiviteRecenteDTO) => ({
    ...item,
    ...getActivityVisuals(item.type),
  }));
});

const moreList = [
  { title: 'Voir Tout', value: 'ViewAll' },
  { title: 'Actualiser', value: 'Refresh' },
  { title: 'Filtrer', value: 'Filter' },
];
</script>

<template>
  <VCard title="Activités d'Apprentissage">
    <template #append>
      <MoreBtn :menu-list="moreList" />
    </template>

    <VCardText>
      <!-- LOADING -->
      <div v-if="dashboardStore.isLoading" class="py-4">
        <VSkeletonLoader v-for="i in 4" :key="i" type="list-item-avatar" class="mb-2" />
      </div>

      <!-- VIDE -->
      <div v-else-if="!activities.length" class="text-center py-6 text-medium-emphasis">
        <VIcon icon="bx-history" size="32" class="mb-2" />
        <p class="text-body-2">Aucune activité récente</p>
      </div>

      <!-- LISTE RÉELLE -->
      <VList v-else class="card-list">
        <VListItem v-for="item in activities" :key="item.titre + item.date">
          <template #prepend>
            <VAvatar rounded variant="tonal" :color="item.color" :icon="item.icon" size="40" />
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
</style>
