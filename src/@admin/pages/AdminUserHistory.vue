<template>
  <div class="pa-6">
    <!-- Header avec infos utilisateur -->
    <VCard class="mb-6 bg-gradient">
      <VCardText>
        <VRow align="center">
          <VCol>
            <h1 class="text-h4 font-weight-bold">
              {{ user.prenom }} {{ user.nom }}
            </h1>
            <p class="text-body2 text-disabled">{{ user.email }}</p>
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <VRow class="text-center">
              <VCol cols="4">
                <div class="text-h6 font-weight-bold text-primary">
                  {{ user.totalSessions }}
                </div>
                <p class="text-caption">Sessions</p>
              </VCol>
              <VCol cols="4">
                <div class="text-h6 font-weight-bold text-success">
                  {{ user.sessionsTerminees }}
                </div>
                <p class="text-caption">Terminées</p>
              </VCol>
              <VCol cols="4">
                <div class="text-h6 font-weight-bold text-warning">
                  {{ Math.round(user.scoreGlobalMoyen * 100) }}%
                </div>
                <p class="text-caption">Score Moyen</p>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Retour -->
    <VBtn
      variant="text"
      prepend-icon="bx:chevron-left"
      @click="goBack"
      class="mb-4"
    >
      Retour
    </VBtn>

    <!-- Historique des sessions -->
    <h2 class="text-h5 font-weight-bold mb-4">📋 Historique des Sessions</h2>

    <div v-if="loading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <VRow v-else>
      <VCol
        v-for="session in user.sessions || []"
        :key="session.sessionId"
        cols="12"
      >
        <VCard :class="getSessionCardClass(session)" class="mb-4">
          <VCardText>
            <!-- En-tête session -->
            <VRow align="center" class="mb-4">
              <VCol>
                <div class="d-flex align-center gap-3">
                  <VIcon :size="32" :color="getStatutColor(session.statut)">
                    {{ getStatutIcon(session.statut) }}
                  </VIcon>
                  <div>
                    <h3 class="text-h6 font-weight-bold">
                      Session {{ session.numeroSession }}
                    </h3>
                    <p class="text-caption text-disabled mb-0">
                      {{ formatDate(session.dateDebut) }}
                    </p>
                  </div>
                </div>
              </VCol>
              <VCol cols="auto" class="text-right">
                <div
                  class="text-h5 font-weight-bold"
                  :class="getScoreClass(session.scoreGlobal)"
                >
                  {{ Math.round(session.scoreGlobal * 100) }}%
                </div>
                <p class="text-caption text-disabled">
                  {{ session.dureeMinutes }}min
                </p>
              </VCol>
            </VRow>

            <!-- Infos détaillées -->
            <VRow class="mb-4">
              <VCol cols="12" sm="6" md="3">
                <div class="stat-box">
                  <p class="text-caption text-disabled">Statut</p>
                  <v-chip
                    :color="getStatutColor(session.statut)"
                    text-color="white"
                    size="small"
                    class="mt-1"
                  >
                    {{ session.statut }}
                  </v-chip>
                </div>
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <div class="stat-box">
                  <p class="text-caption text-disabled">Questions</p>
                  <p class="text-h6 font-weight-bold mt-1">
                    {{ session.questionsRepondues }}/{{
                      session.totalQuestions
                    }}
                  </p>
                </div>
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <div class="stat-box">
                  <p class="text-caption text-disabled">Durée</p>
                  <p class="text-h6 font-weight-bold mt-1">
                    {{ session.dureeMinutes }}min
                  </p>
                </div>
              </VCol>
              <VCol cols="12" sm="6" md="3" v-if="session.raison">
                <div class="stat-box">
                  <p class="text-caption text-disabled">Raison</p>
                  <p class="text-caption mt-1">{{ session.raison }}</p>
                </div>
              </VCol>
            </VRow>

            <!-- Compétences dans cette session -->
            <div
              v-if="session.scoresCompetences.length > 0"
              class="mt-4 pt-4 border-t"
            >
              <p class="text-caption font-weight-bold text-uppercase mb-3">
                Compétences évaluées
              </p>
              <VRow>
                <VCol
                  v-for="comp in session.scoresCompetences"
                  :key="comp.competenceId"
                  cols="12"
                  md="6"
                >
                  <div class="competence-item">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-caption font-weight-bold">{{
                        comp.nom
                      }}</span>
                      <span
                        class="text-caption"
                        :class="getCompetenceClass(comp.statut)"
                      >
                        {{ comp.statut }}
                      </span>
                    </div>
                    <VProgressLinear
                      :value="Math.round(comp.scoreObtenu * 100)"
                      :color="getProgressColor(comp.scoreObtenu)"
                      class="mb-2"
                    />
                    <p class="text-caption text-disabled">
                      {{ comp.nbBonnesReponses }}/{{ comp.nbQuestions }} •
                      Niveau {{ comp.niveauAtteint }}
                    </p>
                  </div>
                </VCol>
              </VRow>
            </div>

            <div v-else class="text-center py-4">
              <p class="text-caption text-disabled">
                Aucune donnée de compétences
              </p>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <div
      v-if="!loading && (!user.sessions || user.sessions.length === 0)"
      class="text-center py-8"
    >
      <VIcon size="64" color="disabled">bx:history</VIcon>
      <p class="text-body2 text-disabled mt-4">Aucune session trouvée</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import usersService, { UserHistoryDTO } from "@/@admin/services/usersService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const user = ref<UserHistoryDTO>({
  utilisateurId: 0,
  email: "",
  nom: "",
  prenom: "",
  totalSessions: 0,
  sessionsTerminees: 0,
  scoreGlobalMoyen: 0,
  sessions: [],
});

const goBack = () => {
  router.push("/admin/users");
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSessionCardClass = (session) => {
  if (session.statut === "TERMINEE") return "border-l-success";
  if (session.statut === "EN_COURS") return "border-l-warning";
  return "border-l-error";
};

const getStatutIcon = (statut) => {
  if (statut === "TERMINEE") return "bx:check-circle";
  if (statut === "EN_COURS") return "bx:hourglass";
  return "bx:x-circle";
};

const getStatutColor = (statut) => {
  if (statut === "TERMINEE") return "success";
  if (statut === "EN_COURS") return "warning";
  return "error";
};

const getScoreClass = (score) => {
  if (score >= 0.8) return "text-success";
  if (score >= 0.6) return "text-warning";
  return "text-error";
};

const getProgressColor = (score) => {
  if (score >= 0.8) return "success";
  if (score >= 0.6) return "warning";
  return "error";
};

const getCompetenceClass = (statut) => {
  const classes = {
    LACUNE: "text-error",
    A_RENFORCER: "text-warning",
    ACQUIS: "text-success",
    MAITRISE: "text-primary font-weight-bold",
  };
  return classes[statut] || "text-disabled";
};

const loadHistorique = async () => {
  try {
    loading.value = true;
    const idEtudiant = route.params.id;
    console.log("Loading history for user:", idEtudiant);
    const data = await usersService.getHistorique(idEtudiant);
    console.log("API Response:", data);

    // Ensure sessions is an array
    if (data && typeof data === "object") {
      user.value = {
        utilisateurId: data.utilisateurId || 0,
        email: data.email || "",
        nom: data.nom || "",
        prenom: data.prenom || "",
        totalSessions: data.totalSessions || 0,
        sessionsTerminees: data.sessionsTerminees || 0,
        scoreGlobalMoyen: data.scoreGlobalMoyen || 0,
        sessions: Array.isArray(data.sessions) ? data.sessions : [],
      };
    }
  } catch (err) {
    console.error("Erreur au chargement de l'historique:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHistorique();
});
</script>

<style scoped lang="scss">
.bg-gradient {
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.1) 0%,
    rgba(255, 107, 107, 0.1) 100%
  );
}

.border-l-success {
  border-left: 4px solid #4caf50;
}

.border-l-warning {
  border-left: 4px solid #ff9800;
}

.border-l-error {
  border-left: 4px solid #f44336;
}

.stat-box {
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.competence-item {
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.gap-3 {
  gap: 12px;
}
</style>
