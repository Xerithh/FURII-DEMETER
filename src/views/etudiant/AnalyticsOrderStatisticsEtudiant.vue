<script setup>
import { hexToRgb } from '@core/utils/colorConverter'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const series = [
  12,
  4,
  2,
  0,
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const secondaryTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['medium-emphasis-opacity'] })`
  const primaryTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['high-emphasis-opacity'] })`
  
  return {
    chart: {
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      width: 6,
      colors: [currentTheme.surface],
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: [
      'Complétés',
      'En Cours',
      'Recommandés',
      'Bloqués',
    ],
    colors: [
      currentTheme.success,
      currentTheme.primary,
      currentTheme.warning,
      currentTheme.error,
    ],
    grid: {
      padding: {
        top: -7,
        bottom: 5,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: '13px',
              color: secondaryTextColor,
              fontFamily: 'Public Sans',
            },
            value: {
              offsetY: -17,
              fontSize: '18px',
              color: primaryTextColor,
              fontFamily: 'Public Sans',
              fontWeight: 500,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '13px',
              lineHeight: '18px',
              formatter: () => '18',
              color: secondaryTextColor,
              fontFamily: 'Public Sans',
            },
          },
        },
      },
    },
  }
})

const orders = [
  {
    amount: '12',
    title: 'Modules Complétés',
    avatarColor: 'success',
    subtitle: 'Validés avec succès',
    avatarIcon: 'bx-check-circle',
  },
  {
    amount: '4',
    title: 'Modules En Cours',
    avatarColor: 'primary',
    subtitle: 'Apprentissage actif',
    avatarIcon: 'bx-book-open',
  },
  {
    amount: '2',
    title: 'Recommandés',
    avatarColor: 'warning',
    subtitle: 'Suggestions personnalisées',
    avatarIcon: 'bx-bulb',
  },
  {
    amount: '0',
    title: 'Modules Bloqués',
    avatarColor: 'error',
    subtitle: 'Prérequis manquants',
    avatarIcon: 'bx-lock-alt',
  },
]

const moreList = [
  {
    title: 'Voir Détails',
    value: 'Details',
  },
  {
    title: 'Actualiser',
    value: 'Refresh',
  },
  {
    title: 'Télécharger',
    value: 'Download',
  },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>
        Répartition des Modules
      </VCardTitle>
      <VCardSubtitle>18 Modules Total</VCardSubtitle>

      <template #append>
        <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="">
          <h3 class="text-h3 mb-1">
            18
          </h3>
          <div class="text-caption text-medium-emphasis">
            Total Modules
          </div>
        </div>

        <div>
          <VueApexCharts
            type="donut"
            :height="120"
            width="100"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>

      <VList class="card-list">
        <VListItem
          v-for="order in orders"
          :key="order.title"
        >
          <template #prepend>
            <VAvatar
              size="40"
              rounded
              variant="tonal"
              :color="order.avatarColor"
            >
              <VIcon :icon="order.avatarIcon" />
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ order.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-body-2">
            {{ order.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <span>{{ order.amount }}</span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
