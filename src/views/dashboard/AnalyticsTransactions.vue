<script setup>

const transactions = [
  {
    amount: 'Complété',
    paymentMethod: 'Algorithmes',
    description: 'Module sur les structures de données',
    icon: 'bx-check-circle',
    color: 'success',
  },
  {
    paymentMethod: 'Web Dev',
    amount: 'En cours',
    description: 'Framework Vue.js - 75% complété',
    icon: 'bx-code-alt',
    color: 'primary',
  },
  {
    amount: 'Recommandé',
    paymentMethod: 'Base de Données',
    description: 'SQL Avancé et optimisation',
    icon: 'bx-data',
    color: 'info',
  },
  {
    paymentMethod: 'DevOps',
    amount: 'Recommandé',
    description: 'CI/CD et déploiement cloud',
    icon: 'bx-cloud',
    color: 'warning',
  },
  {
    paymentMethod: 'Machine Learning',
    amount: 'En cours',
    description: 'Introduction au Deep Learning',
    icon: 'bx-brain',
    color: 'primary',
  },
  {
    paymentMethod: 'Sécurité',
    amount: 'Recommandé',
    description: 'Cybersécurité et bonnes pratiques',
    icon: 'bx-shield',
    color: 'warning',
  },
]

const moreList = [
  {
    title: 'Voir Tout',
    value: 'ViewAll',
  },
  {
    title: 'Actualiser',
    value: 'Refresh',
  },
  {
    title: 'Filtrer',
    value: 'Filter',
  },
]
</script>

<template>
  <VCard title="Activités d'Apprentissage">
    <template #append>
      <MoreBtn :menu-list="moreList" />
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="item in transactions"
          :key="item.paymentMethod"
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

          <VListItemSubtitle>
            {{ item.paymentMethod }}
          </VListItemSubtitle>
          <VListItemTitle>
            {{ item.description }}
          </VListItemTitle>

          <template #append>
            <VListItemAction>
              <VChip
                :color="item.color"
                size="small"
                variant="tonal"
              >
                {{ item.amount }}
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
