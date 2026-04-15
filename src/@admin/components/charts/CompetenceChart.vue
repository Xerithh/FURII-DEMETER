<template>
  <VCard>
    <VCardItem>
      <VCardTitle>{{ title }}</VCardTitle>
    </VCardItem>
    <VDivider />
    <VCardText class="pa-6">
      <!-- Empty state -->
      <div v-if="!data || data.length === 0" class="text-center py-8">
        <p class="text-medium-emphasis">Aucune donnée disponible</p>
      </div>

      <!-- Chart -->
      <div v-else id="chart-container">
        <apexchart
          type="bar"
          :options="chartOptions"
          :series="chartSeries"
          height="300"
        />
      </div>

      <!-- Legend -->
      <VRow class="mt-6">
        <VCol cols="12" sm="6">
          <div class="d-flex align-center gap-2">
            <VIcon icon="bx:circle" color="success" size="16" />
            <span class="text-body-2">Score Moyen</span>
          </div>
        </VCol>
        <VCol cols="12" sm="6">
          <div class="d-flex align-center gap-2">
            <VIcon icon="bx:circle" color="warning" size="16" />
            <span class="text-body-2">Taux d'Acquisition</span>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { CompetenceStats } from '@/@admin/types/admin';

interface Props {
  title: string;
  data: CompetenceStats[];
}

const props = defineProps<Props>();

const chartSeries = computed(() => [
  {
    name: 'Score Moyen',
    data: props.data.map((c) => Math.round(c.scoreMoyen * 100) / 100),
  },
  {
    name: 'Taux d\'Acquisition',
    data: props.data.map((c) => Math.round(c.tauxAcquisition * 100)),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 0,
    colors: ['transparent'],
  },
  tooltip: {
    y: {
      formatter: (val) => `${val}`,
    },
  },
  fill: {
    opacity: 1,
  },
  xaxis: {
    categories: props.data.map((c) => c.nom.substring(0, 12)),
  },
  colors: ['#10b981', '#f59e0b'],
}));
</script>
