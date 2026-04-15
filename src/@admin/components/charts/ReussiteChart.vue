<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Taux de Réussite Global</VCardTitle>
    </VCardItem>
    <VDivider />
    <VCardText class="pa-6">
      <div id="success-rate-chart">
        <apexchart
          type="radialBar"
          :options="chartOptions"
          :series="[tauxReussite]"
          height="280"
        />
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
  tauxReussite: number; // 0-100
}

const props = defineProps<Props>();

const chartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: '#e7e7e7',
        strokeWidth: '97%',
        margin: 5,
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '16px',
          fontWeight: 600,
          offsetY: -10,
        },
        value: {
          show: true,
          fontSize: '24px',
          fontWeight: 700,
          offsetY: 16,
          formatter: (val) => `${val.toFixed(1)}%`,
        },
      },
    },
  },
  fill: {
    colors: ['#10b981'],
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Réussite'],
}));
</script>
