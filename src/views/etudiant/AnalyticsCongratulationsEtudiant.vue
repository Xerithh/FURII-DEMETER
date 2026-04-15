<script setup lang="ts">
import { useDashboardStore } from "@/stores/dashboard";
import illustrationJohnDark from "@images/cards/illustration-john-dark.png";
import illustrationJohnLight from "@images/cards/illustration-john-light.png";
import { useTheme } from "vuetify";

const { global } = useTheme();
const dashboardStore = useDashboardStore();

const illustrationJohn = computed(() =>
  global.name.value === "dark" ? illustrationJohnDark : illustrationJohnLight,
);

const completedModules = computed(
  () =>
    dashboardStore.data?.competences?.filter((c) => c.niveau === "ACQUIS")
      .length ?? 0,
);

const totalModules = computed(
  () => dashboardStore.data?.competences?.length ?? 0,
);

const remainingRecommendations = computed(() =>
  Math.max(totalModules.value - completedModules.value, 0),
);

const userName = computed(() => {
  const u = dashboardStore.data?.utilisateur;
  return u ? u.prenom || u.nom || "" : "";
});

const showEmptyState = computed(
  () => !dashboardStore.isLoading && dashboardStore.isEmpty,
);
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VCardText
      v-if="showEmptyState"
      class="d-flex flex-column align-center text-center py-10"
    >
      <p class="text-body-1 mb-6" style="max-width: 640px">
        Vous n'avez pas encore d'historique. Lancez une première évaluation pour
        commencer à suivre votre progression.
      </p>
      <img
        src="/images/undraw_waiting-for-you.svg"
        alt="Illustration historique vide"
        class="mb-6"
        style="max-width: 320px; width: 100%; height: auto"
      />
      <VBtn
        color="primary"
        size="large"
        prepend-icon="bx-play"
        to="/student/my-modules"
      >
        Accéder à mes modules
      </VBtn>
    </VCardText>

    <VRow v-else no-gutters>
      <VCol cols="12" sm="6" order="2" order-sm="1">
        <VCardItem class="pb-3">
          <VCardTitle class="text-primary">
            <template v-if="dashboardStore.isLoading">Chargement...</template>
            <template v-else>
              Bonjour{{ userName ? `, ${userName}` : "" }} ! Prêt à apprendre
              aujourd'hui ? 📚
            </template>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <template v-if="dashboardStore.isLoading">
            <VSkeletonLoader type="text" class="mb-2" />
            <VSkeletonLoader type="text" class="mb-4" />
          </template>
          <template v-else>
            Vous avez acquis
            <strong>{{ completedModules }}</strong> compétences sur
            <strong>{{ totalModules }}</strong> cette année !
            <br />
            <strong>{{ remainingRecommendations }}</strong> compétences à
            améliorer selon vos résultats.
          </template>

          <br />
          <div class="d-flex flex-wrap gap-3 mt-6">
            <VBtn variant="tonal" size="small" to="/student/my-modules">
              Voir les Modules
            </VBtn>
            <VBtn
              variant="outlined"
              size="small"
              color="primary"
              to="/student/random-quiz"
            >
              <VIcon icon="bx-brain" start />
              Lancer un Quiz Global
            </VBtn>
          </div>
        </VCardText>
      </VCol>

      <VCol cols="12" sm="4" order="1" order-sm="2" class="text-center">
        <img
          :src="illustrationJohn"
          :height="$vuetify.display.xs ? '150' : '182'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        />
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.125rem;
  inset-inline-end: 3.5rem;
}
</style>
