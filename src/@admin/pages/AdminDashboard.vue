<template>
  <div class="admin-dashboard">
    <VProgressLinear
      v-if="adminStore.isDashboardLoading"
      indeterminate
      class="mb-6"
    />

    <!-- Welcome Card Animée -->
    <VCard class="mb-6 overflow-hidden welcome-card" style="position: relative">
      <!-- Particules flottantes -->
      <div class="particles-container">
        <div
          v-for="i in 12"
          :key="i"
          class="particle"
          :class="`particle-${i}`"
        />
      </div>

      <!-- Cercles décoratifs -->
      <div class="deco-circle deco-circle-1" />
      <div class="deco-circle deco-circle-2" />
      <div class="deco-circle deco-circle-3" />

      <VRow no-gutters style="position: relative; z-index: 2">
        <VCol cols="12" sm="8" order="2" order-sm="1">
          <VCardItem class="pb-2 pt-6 px-6">
            <div class="d-flex align-center gap-3 mb-2">
              <VAvatar color="primary" size="48" variant="tonal">
                <VIcon icon="bx-shield" size="26" />
              </VAvatar>
              <div>
                <p
                  class="text-xs text-disabled mb-0 text-uppercase font-weight-bold letter-spacing"
                >
                  Panneau d'administration
                </p>
                <VCardTitle class="text-primary text-h5 pa-0">
                  Bonjour, Administrateur ! 👋
                </VCardTitle>
              </div>
            </div>
          </VCardItem>
          <VCardText class="px-6 pb-6">
            <p class="mb-1 text-body-1">
              <strong class="text-primary counter-value">{{
                displayedUsers
              }}</strong>
              utilisateurs inscrits sur la plateforme ISIS.
            </p>
            <p class="text-disabled mb-5">
              <VIcon icon="bx-play-circle" size="14" class="me-1" />
              {{ adminStore.dashboard?.sessionsEnCours || 0 }} sessions en cours
              ·
              <VIcon icon="bx-trending-up" size="14" class="me-1 ms-1" />
              Taux de réussite :
              {{
                ((adminStore.dashboard?.tauxReussite || 0) * 100).toFixed(1)
              }}%
            </p>
            <div class="d-flex flex-wrap gap-3">
              <VBtn
                color="primary"
                size="small"
                to="/admin/questions"
                class="btn-shine"
              >
                <VIcon icon="bx-help-circle" start />
                Gérer les Questions
              </VBtn>
              <VBtn
                variant="tonal"
                color="primary"
                size="small"
                to="/admin/users"
              >
                <VIcon icon="bx-group" start />
                Voir les Utilisateurs
              </VBtn>
              <VBtn
                variant="outlined"
                size="small"
                :loading="adminStore.isDashboardLoading"
                @click="refresh"
              >
                <VIcon icon="bx-refresh" start />
                Actualiser
              </VBtn>
            </div>
          </VCardText>
        </VCol>

        <VCol
          cols="12"
          sm="4"
          order="1"
          order-sm="2"
          class="d-flex align-end justify-center"
        >
          <img
            :src="illustration"
            style="
              height: 160px;
              width: auto;
              object-fit: contain;
              display: block;
            "
            class="illustration-float"
          />
        </VCol>
      </VRow>
    </VCard>

    <!-- KPI Cards -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Utilisateurs"
          :value="adminStore.dashboard?.totalUtilisateurs || 0"
          icon="bx-group"
          color="primary"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Étudiants FIE3"
          :value="adminStore.dashboard?.totalEtudiantsFIE3 || 0"
          icon="bx-user-check"
          color="success"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Candidats VAE"
          :value="adminStore.dashboard?.totalCandidatsVAE || 0"
          icon="bx-briefcase"
          color="info"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Sessions en Cours"
          :value="adminStore.dashboard?.sessionsEnCours || 0"
          icon="bx-play-circle"
          color="warning"
          format="number"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Taux de Réussite"
          :value="adminStore.dashboard?.tauxReussite || 0"
          icon="bx-trending-up"
          color="success"
          format="percent"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4">
        <KPICard
          label="Score Moyen Global"
          :value="(adminStore.dashboard?.scoreMoyenGlobal || 0) * 100"
          icon="bx-bar-chart"
          color="primary"
          format="percent"
        />
      </VCol>
    </VRow>

    <!-- Charts -->
    <VRow class="mb-6">
      <!-- Activité hebdomadaire -->
      <VCol cols="12" md="8">
        <VCard>
          <VCardItem>
            <VCardTitle>Sessions Récentes</VCardTitle>
            <VCardSubtitle>Activité des 7 derniers jours</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="area"
              height="250"
              :options="{
                chart: { toolbar: { show: false } },
                colors: ['#7367F0'],
                stroke: { curve: 'smooth', width: 2 },
                fill: {
                  type: 'gradient',
                  gradient: { opacityFrom: 0.4, opacityTo: 0.05 },
                },
                xaxis: {
                  categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                },
                dataLabels: { enabled: false },
                grid: { borderColor: 'rgba(0,0,0,0.05)' },
              }"
              :series="[
                {
                  name: 'Sessions',
                  data: [
                    adminStore.dashboard?.sessionsEnCours || 0,
                    adminStore.dashboard?.sessionsEnCours || 0,
                    adminStore.dashboard?.sessionsEnCours || 0,
                    adminStore.dashboard?.sessionsEnCours || 0,
                    adminStore.dashboard?.sessionsEnCours || 0,
                    adminStore.dashboard?.sessionsEnCours || 0,
                    adminStore.dashboard?.sessionsEnCours || 0,
                  ],
                },
              ]"
            />
          </VCardText>
        </VCard>
      </VCol>

      <!-- Taux de réussite -->
      <VCol cols="12" md="4">
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Taux de Réussite</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText
            class="d-flex flex-column align-center justify-center"
            style="min-height: 280px"
          >
            <!-- Cercle de progression -->
            <div
              class="position-relative d-flex align-center justify-center mb-4"
            >
              <apexchart
                type="radialBar"
                height="220"
                width="220"
                :options="{
                  chart: { type: 'radialBar', toolbar: { show: false } },
                  plotOptions: {
                    radialBar: {
                      hollow: { size: '65%' },
                      track: {
                        background: 'rgba(0,0,0,0.08)',
                        strokeWidth: '100%',
                      },
                      dataLabels: {
                        name: {
                          show: true,
                          fontSize: '14px',
                          fontWeight: 500,
                          offsetY: -10,
                          color: '#888',
                        },
                        value: {
                          show: true,
                          fontSize: '28px',
                          fontWeight: 700,
                          offsetY: 10,
                          formatter: (val) => val.toFixed(1) + '%',
                          color: '#28C76F',
                        },
                      },
                    },
                  },
                  fill: { colors: ['#28C76F'] },
                  stroke: { lineCap: 'round' },
                  labels: ['Réussite'],
                }"
                :series="[
                  Math.round((adminStore.dashboard?.tauxReussite || 0) * 10),
                ]"
              />
            </div>

            <!-- Détails -->
            <div class="d-flex gap-6 mt-2">
              <div class="text-center">
                <p class="text-h6 font-weight-bold text-success mb-0">
                  {{
                    Math.round((adminStore.dashboard?.tauxReussite || 0) * 10)
                  }}%
                </p>
                <p class="text-xs text-disabled mb-0">Taux global</p>
              </div>
              <VDivider vertical />
              <div class="text-center">
                <p class="text-h6 font-weight-bold text-primary mb-0">
                  {{ adminStore.dashboard?.sessionsEnCours || 0 }}
                </p>
                <p class="text-xs text-disabled mb-0">Sessions actives</p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Répartition utilisateurs -->
    <VRow>
      <VCol cols="12" md="4">
        <VCard>
          <VCardItem>
            <VCardTitle>Répartition Utilisateurs</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <apexchart
              type="donut"
              height="250"
              :options="{
                labels: ['Étudiants FIE3', 'Candidats VAE'],
                colors: ['#7367F0', '#28C76F'],
                legend: { position: 'bottom' },
                plotOptions: { pie: { donut: { size: '65%' } } },
                dataLabels: { enabled: false },
              }"
              :series="[
                adminStore.dashboard?.totalEtudiantsFIE3 || 0,
                adminStore.dashboard?.totalCandidatsVAE || 0,
              ]"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="8">
        <VCard>
          <VCardItem>
            <VCardTitle>Top Compétences</VCardTitle>
            <VCardSubtitle>Meilleures performances</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <div
              v-if="!adminStore.dashboard?.competencesTopPerformance?.length"
              class="text-center py-8"
            >
              <VIcon
                icon="bx-bar-chart-alt-2"
                size="48"
                color="disabled"
                class="mb-3"
              />
              <p class="text-disabled">Aucune donnée disponible</p>
            </div>
            <apexchart
              v-else
              type="bar"
              height="250"
              :options="{
                chart: { toolbar: { show: false } },
                colors: ['#7367F0', '#FF9F43'],
                plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
                dataLabels: { enabled: false },
                xaxis: {
                  categories: adminStore.dashboard.competencesTopPerformance
                    .slice(0, 5)
                    .map((c) => c.nom.substring(0, 12)),
                },
                grid: { borderColor: 'rgba(0,0,0,0.05)' },
                legend: { position: 'top' },
              }"
              :series="[
                {
                  name: 'Score Moyen',
                  data: adminStore.dashboard.competencesTopPerformance
                    .slice(0, 5)
                    .map((c) => Math.round(c.scoreMoyen * 100) / 100),
                },
                {
                  name: 'Taux Acquisition',
                  data: adminStore.dashboard.competencesTopPerformance
                    .slice(0, 5)
                    .map((c) => Math.round(c.tauxAcquisition * 100)),
                },
              ]"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
// 1. D'abord les imports
import KPICard from "@/@admin/components/cards/KPICard.vue";
import { useAdminStore } from "@/@admin/stores/admin";
import illustrationDark from "@/assets/images/cards/illustration-john-dark.png";
import illustrationLight from "@/assets/images/cards/illustration-john-light.png";
import { computed, onMounted, ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";

// 2. Store et composables
const adminStore = useAdminStore();
const { global } = useTheme();
const apexchart = VueApexCharts;

// 3. Refs
const displayedUsers = ref(0);
const illustration = computed(() =>
  global.name.value === "dark" ? illustrationDark : illustrationLight,
);

// 4. Fonctions
const animateCounter = (target: number) => {
  const duration = 1500;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      displayedUsers.value = target;
      clearInterval(timer);
    } else {
      displayedUsers.value = Math.round(current);
    }
  }, duration / steps);
};

// 5. Watch APRÈS adminStore
watch(
  () => adminStore.dashboard?.totalUtilisateurs,
  (val) => {
    if (val !== undefined && val !== null) animateCounter(val as number);
  },
  { immediate: true },
);

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

.welcome-card {
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.05) 0%,
    rgba(40, 199, 111, 0.05) 100%
  ) !important;
  border: 1px solid rgba(115, 103, 240, 0.15) !important;
}

/* Cercles décoratifs */
.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
  background: #7367f0;
}
.deco-circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -80px;
  animation: rotate 20s linear infinite;
}
.deco-circle-2 {
  width: 200px;
  height: 200px;
  bottom: -80px;
  right: 200px;
  background: #28c76f;
  animation: rotate 15s linear infinite reverse;
}
.deco-circle-3 {
  width: 150px;
  height: 150px;
  top: -50px;
  left: 300px;
  background: #ff9f43;
  animation: rotate 25s linear infinite;
}

/* Particules */
.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7367f0;
  opacity: 0.3;
  animation: float-particle 6s ease-in-out infinite;
}

.particle-1 {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
  width: 6px;
  height: 6px;
  background: #7367f0;
}
.particle-2 {
  left: 25%;
  top: 60%;
  animation-delay: 0.5s;
  width: 8px;
  height: 8px;
  background: #28c76f;
}
.particle-3 {
  left: 40%;
  top: 15%;
  animation-delay: 1s;
  width: 5px;
  height: 5px;
  background: #ff9f43;
}
.particle-4 {
  left: 55%;
  top: 75%;
  animation-delay: 1.5s;
  width: 7px;
  height: 7px;
  background: #7367f0;
}
.particle-5 {
  left: 70%;
  top: 30%;
  animation-delay: 2s;
  width: 6px;
  height: 6px;
  background: #28c76f;
}
.particle-6 {
  left: 85%;
  top: 55%;
  animation-delay: 2.5s;
  width: 8px;
  height: 8px;
  background: #ff9f43;
}
.particle-7 {
  left: 15%;
  top: 80%;
  animation-delay: 3s;
  width: 5px;
  height: 5px;
  background: #7367f0;
}
.particle-8 {
  left: 35%;
  top: 45%;
  animation-delay: 3.5s;
  width: 7px;
  height: 7px;
  background: #28c76f;
}
.particle-9 {
  left: 60%;
  top: 10%;
  animation-delay: 4s;
  width: 6px;
  height: 6px;
  background: #ff9f43;
}
.particle-10 {
  left: 75%;
  top: 65%;
  animation-delay: 4.5s;
  width: 8px;
  height: 8px;
  background: #7367f0;
}
.particle-11 {
  left: 90%;
  top: 25%;
  animation-delay: 5s;
  width: 5px;
  height: 5px;
  background: #28c76f;
}
.particle-12 {
  left: 50%;
  top: 90%;
  animation-delay: 5.5s;
  width: 7px;
  height: 7px;
  background: #ff9f43;
}

/* Illustration flottante */
.illustration-float {
  animation: float 3s ease-in-out infinite;
}

/* Bouton avec effet shine */
.btn-shine {
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -60%;
    width: 40%;
    height: 200%;
    background: rgba(255, 255, 255, 0.3);
    transform: skewX(-20deg);
    animation: shine 3s ease-in-out infinite;
  }
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-particle {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.6;
  }
  75% {
    transform: translateY(10px) translateX(-10px);
    opacity: 0.2;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shine {
  0% {
    left: -60%;
  }
  100% {
    left: 120%;
  }
}

.letter-spacing {
  letter-spacing: 0.1em;
}
</style>
