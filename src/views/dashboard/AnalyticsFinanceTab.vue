<script setup>
// Using Boxicons names for avatars instead of image assets
import { hexToRgb } from '@layouts/utils'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const series = {
  comprehension: [{
    data: [
      14,
      15,
      13,
      16,
      15,
      17,
      16,
      15,
    ],
  }],
  pratique: [{
    data: [
      13,
      14,
      15,
      14,
      16,
      15,
      17,
      16,
    ],
  }],
  engagement: [{
    data: [
      16,
      15,
      16,
      17,
      15,
      16,
      14,
      15,
    ],
  }],
}

const currentTab = ref('comprehension')

const tabData = computed(() => {
  const data = {
    comprehension: {
      avatar: 'bx-book-open',
      title: 'Compréhension',
      stats: '15.1/20',
      profitLoss: 12,
      profitLossAmount: '15.1',
      compareToLastWeek: '+8%',
    },
    pratique: {
      avatar: 'bx-wrench',
      title: 'Pratique',
      stats: '14.9/20',
      profitLoss: 15,
      profitLossAmount: '14.9',
      compareToLastWeek: '+12%',
    },
    engagement: {
      avatar: 'bx-group',
      title: 'Engagement',
      stats: '15.6/20',
      profitLoss: 8,
      profitLossAmount: '15.6',
      compareToLastWeek: '+5%',
    },
  }
  
  return data[currentTab.value]
})

const chartConfig = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const disabledTextColor = `rgba(${ hexToRgb(String(currentTheme['on-surface'])) },${ variableTheme['disabled-opacity'] })`
  const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
  
  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    grid: {
      strokeDashArray: 4.5,
      borderColor,
      padding: {
        left: 0,
        top: -20,
        right: 11,
        bottom: 7,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0.25,
        opacityFrom: 0.5,
        stops: [
          0,
          95,
          100,
        ],
        shadeIntensity: 0.6,
        colorStops: [[
          {
            offset: 0,
            opacity: 0.4,
            color: currentTheme.primary,
          },
          {
            offset: 100,
            opacity: 0.2,
            color: currentTheme.surface,
          },
        ]],
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: currentTheme.primary,
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [
        '',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
      ],
      offsetY: 20,
      offsetX: -24,
      labels: {
        style: {
          fontSize: '14px',
          colors: disabledTextColor,
          fontFamily: 'Public Sans',
        },
      },
    },
    yaxis: {
      min: 10,
      max: 50,
      show: false,
      tickAmount: 4,
    },
    markers: {
      size: 8,
      strokeWidth: 6,
      strokeOpacity: 1,
      offsetX: -10,
      hover: { size: 8 },
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [{
        size: 8,
        seriesIndex: 0,
        fillColor: '#fff',
        strokeColor: currentTheme.primary,
        dataPointIndex: series[currentTab.value][0].data.length - 1,
      }],
    },
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <VTabs
        v-model="currentTab"
        class="v-tabs-pill"
      >
        <VTab value="comprehension">
          Ingénierie numérique
        </VTab>
        <VTab value="pratique">
          Ingénierie de données
        </VTab>
        <VTab value="engagement">
          Ingénierie et Santé
        </VTab>
        <VTab value="engagement">
          Ingénierie et Santé
        </VTab>
      </VTabs>
    </VCardText>

    <VCardText class="d-flex align-center gap-3">
      <VAvatar
        size="48"
        rounded
        :icon="tabData.avatar"
      />

      <div>
        <p class="mb-0">
          {{ tabData.title }}
        </p>
        <div class="d-flex align-center gap-2">
          <h6 class="text-h6">
            {{ tabData.stats }}
          </h6>
          <span
            class="text-sm"
            :class="tabData.profitLoss > 0 ? 'text-success' : 'text-error'"
          >
            <VIcon
              size="24"
              icon="bx-chevron-up"
            />
            {{ tabData.profitLoss }}%
          </span>
        </div>
      </div>
    </VCardText>

    <VCardText>
      <VueApexCharts
        type="area"
        :height="230"
        :options="chartConfig"
        :series="series[currentTab]"
      />
    </VCardText>

    <VCardText class="d-flex align-center justify-center pt-2 gap-4">
      <VProgressCircular
        size="45"
        color="primary"
        :model-value="tabData.profitLoss"
      >
        <span class="text-overline text-medium-emphasis">${{ tabData.profitLossAmount }}</span>
      </VProgressCircular>

      <div>
        <h6 class="text-base font-weight-regular">
          <span class="text-capitalize d-inline-block">Cette semaine — {{ tabData.title }}</span>
        </h6>
        <span class="text-sm d-inline-block">{{ tabData.compareToLastWeek }} par rapport à la semaine dernière</span>
      </div>
    </VCardText>
  </VCard>
</template>
