<script setup>
import { hexToRgb } from '@core/utils/colorConverter'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const series = [
  {
    name: 'Votre niveau',
    data: [85, 72, 68, 90, 78, 82],
  },
  {
    name: 'Minimum requis',
    data: [60, 60, 60, 60, 60, 60],
  },
]

const categories = [
  'Managment de projet',
  'Ingénieurie numérique',
  'Ingénieurie des données',
  'Santé numérique',
  'Devenir ingénieur',
  'Innovaiton et recherche',
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const disabledTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['disabled-opacity'] })`
  const primaryTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['high-emphasis-opacity'] })`
  const secondaryTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['medium-emphasis-opacity'] })`
  const drawColor = 'rgba(34,48,62,0.7)'
  
  return {
    radar: {
      chart: {
        height: 400,
        type: 'radar',
        toolbar: { show: false },
        dropShadow: {
          enabled: false,
        },
      },
      colors: [
        `rgba(${ hexToRgb(String(currentTheme.primary)) }, 1)`,
        `rgba(${ hexToRgb(String(currentTheme.warning)) }, 1)`,
      ],
      stroke: {
        width: 2,
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: Array(categories.length).fill(drawColor),
            fontSize: '13px',
            fontFamily: 'Public Sans',
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          style: {
            colors: drawColor,
            fontSize: '12px',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '13px',
        fontFamily: 'Public Sans',
        labels: { colors: drawColor },
        markers: {
          width: 11,
          height: 11,
          radius: 10,
        },
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`,
            connectorColors: `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`,
          },
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            xaxis: {
              labels: {
                show: false,
              },
            },
          },
        },
      ],
    },
    radial: {
      chart: { sparkline: { enabled: true } },
      labels: ['Progression'],
      stroke: { dashArray: 5 },
      colors: [`rgba(${ hexToRgb(String(currentTheme.primary)) }, 1)`],
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          opacityTo: 0.5,
          opacityFrom: 1,
          shadeIntensity: 0.5,
          stops: [30, 70, 100],
          inverseColors: false,
          gradientToColors: [currentTheme.primary],
        },
      },
      plotOptions: {
        radialBar: {
          endAngle: 150,
          startAngle: -140,
          hollow: { size: '55%' },
          track: { background: 'transparent' },
          dataLabels: {
            name: {
              offsetY: 25,
              fontWeight: 500,
              fontSize: '14px',
              color: secondaryTextColor,
              fontFamily: 'Public Sans',
            },
            value: {
              offsetY: -15,
              fontWeight: 600,
              fontSize: '26px',
              color: primaryTextColor,
              fontFamily: 'Public Sans',
              formatter: function(val) {
                return val + '%'
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 900,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 735,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 660,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 600,
          options: { chart: { height: 200 } },
        },
      ],
    },
  }
})

const balanceData = [
  {
    icon: 'bx-book-open',
    amount: '12 modules',
    year: '2026',
    color: 'primary',
  },
  {
    icon: 'bx-trophy',
    amount: '8 badges',
    year: '2026',
    color: 'success',
  },
]

const moreList = [
  {
    title: 'Exporter',
    value: 'Export',
  },
  {
    title: 'Actualiser',
    value: 'Refresh',
  },
  {
    title: 'Rapport Détaillé',
    value: 'Details',
  },
]
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <!-- Graphique Radar à gauche -->
      <VCol
        cols="12"
        sm="7"
        xl="8"
        :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
      >
        <VCardItem class="pb-0">
          <VCardTitle>Compétences ISIS</VCardTitle>

          <template #append>
            <MoreBtn :menu-list="moreList" />
          </template>
        </VCardItem>

        <VCardText class="pb-0">
          <VueApexCharts
            type="radar"
            :height="400"
            :options="chartOptions.radar"
            :series="series"
          />
        </VCardText>
      </VCol>

      <!-- Graphique Radial 67% à droite -->
      <VCol
        cols="12"
        sm="5"
        xl="4"
      >
        <VCardText class="text-center pt-10">
          <VBtn
            variant="tonal"
            class="mb-2"
            append-icon="bx-chevron-down"
          >
            2026
            <VMenu activator="parent">
              <VList>
                <VListItem
                  v-for="(item, index) in ['2026', '2025', '2024']"
                  :key="index"
                  :value="item"
                >
                  <VListItemTitle>{{ item }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>

          <!-- radial chart -->
          <VueApexCharts
            type="radialBar"
            :height="200"
            :options="chartOptions.radial"
            :series="[67]"
          />

          <h6 class="text-h6 text-medium-emphasis mb-8 mt-1">
            67% Parcours Complété
          </h6>

          <div class="d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3">
            <div
              v-for="data in balanceData"
              :key="data.year"
              class="d-flex align-center gap-2"
            >
              <VAvatar
                :icon="data.icon"
                :color="data.color"
                size="38"
                rounded
                variant="tonal"
              />

              <div class="text-start">
                <span class="text-sm"> {{ data.year }}</span>
                <h6 class="text-h6">
                  {{ data.amount }}
                </h6>
              </div>
            </div>
          </div>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss"
</style>

