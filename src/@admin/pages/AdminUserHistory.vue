<template>
  <div>

    <!-- Header utilisateur -->
    <VCard class="mb-6" color="primary" variant="tonal">
      <VCardText>
        <VRow align="center">
          <VCol cols="12" md="7">
            <div class="d-flex align-center gap-4">
              <VAvatar color="primary" size="64" variant="tonal">
                <span class="text-h5 font-weight-bold">
                  {{ (user.prenom?.charAt(0) || '?').toUpperCase() }}
                </span>
              </VAvatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">
                  {{ user.prenom }} {{ user.nom }}
                </h1>
                <p class="text-disabled mb-0">
                  <VIcon icon="bx-envelope" size="14" class="me-1" />
                  {{ user.email }}
                </p>
              </div>
            </div>
          </VCol>

          <VCol cols="12" md="5">
            <VRow class="text-center">
              <VCol cols="4">
                <VCard variant="tonal" color="primary" rounded="lg">
                  <VCardText class="pa-3">
                    <p class="text-h5 font-weight-bold mb-0 text-primary">
                      {{ user.totalSessions }}
                    </p>
                    <p class="text-xs text-disabled mb-0">Sessions</p>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="4">
                <VCard variant="tonal" color="success" rounded="lg">
                  <VCardText class="pa-3">
                    <p class="text-h5 font-weight-bold mb-0 text-success">
                      {{ user.sessionsTerminees }}
                    </p>
                    <p class="text-xs text-disabled mb-0">Terminées</p>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="4">
                <VCard variant="tonal" color="warning" rounded="lg">
                  <VCardText class="pa-3">
                    <p class="text-h5 font-weight-bold mb-0 text-warning">
                      {{ Math.round(user.scoreGlobalMoyen * 100) }}%
                    </p>
                    <p class="text-xs text-disabled mb-0">Score</p>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Bouton retour -->
    <VBtn
      variant="text"
      prepend-icon="bx-chevron-left"
      @click="goBack"
      class="mb-4"
    >
      Retour aux utilisateurs
    </VBtn>

    <!-- Titre -->
    <div class="d-flex align-center gap-2 mb-4">
      <VIcon icon="bx-history" color="primary" size="24" />
      <h2 class="text-h5 font-weight-bold">Historique des Sessions</h2>
      <VChip color="primary" variant="tonal" size="small">
        {{ user.sessions?.length || 0 }} sessions
      </VChip>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <VProgressCircular indeterminate color="primary" size="48" />
      <p class="text-disabled mt-4">Chargement de l'historique...</p>
    </div>

    <!-- Sessions -->
    <div v-else>
      <VCard
        v-for="session in user.sessions || []"
        :key="session.sessionId"
        class="mb-4"
        :style="`border-left: 4px solid ${getStatutColorHex(session.statut)}`"
      >
        <VCardText>

          <!-- Header session -->
          <div class="d-flex justify-space-between align-start mb-4">
            <div class="d-flex align-center gap-3">
              <VAvatar
                :color="getStatutColor(session.statut)"
                variant="tonal"
                size="44"
                rounded
              >
                <VIcon :icon="getStatutIcon(session.statut)" size="22" />
              </VAvatar>
              <div>
                <h3 class="text-h6 font-weight-bold mb-0">
                  Session {{ session.numeroSession }}
                </h3>
                <p class="text-xs text-disabled mb-0">
                  <VIcon icon="bx-calendar" size="12" class="me-1" />
                  {{ formatDate(session.dateDebut) }}
                </p>
              </div>
            </div>

            <div class="text-end">
              <p
                class="text-h4 font-weight-bold mb-0"
                :class="getScoreClass(session.scoreGlobal)"
              >
                {{ Math.round(session.scoreGlobal * 100) }}%
              </p>
              <p class="text-xs text-disabled mb-0">
                <VIcon icon="bx-time" size="12" class="me-1" />
                {{ session.dureeMinutes }} min
              </p>
            </div>
          </div>

          <!-- Stats session -->
          <VRow class="mb-4">
            <VCol cols="6" sm="3">
              <VCard variant="tonal" :color="getStatutColor(session.statut)" rounded="lg">
                <VCardText class="pa-3 text-center">
                  <p class="text-xs text-disabled mb-1">Statut</p>
                  <VChip
                    :color="getStatutColor(session.statut)"
                    size="x-small"
                    variant="flat"
                  >
                    {{ session.statut }}
                  </VChip>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="6" sm="3">
              <VCard variant="outlined" rounded="lg">
                <VCardText class="pa-3 text-center">
                  <p class="text-xs text-disabled mb-1">Questions</p>
                  <p class="text-h6 font-weight-bold mb-0">
                    {{ session.questionsRepondues }}/{{ session.totalQuestions }}
                  </p>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="6" sm="3">
              <VCard variant="outlined" rounded="lg">
                <VCardText class="pa-3 text-center">
                  <p class="text-xs text-disabled mb-1">Durée</p>
                  <p class="text-h6 font-weight-bold mb-0">
                    {{ session.dureeMinutes }} min
                  </p>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="6" sm="3" v-if="session.raison">
              <VCard variant="outlined" rounded="lg">
                <VCardText class="pa-3 text-center">
                  <p class="text-xs text-disabled mb-1">Raison</p>
                  <p class="text-sm font-weight-medium mb-0">
                    {{ session.raison }}
                  </p>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- Compétences -->
          <div v-if="session.scoresCompetences?.length > 0">
            <VDivider class="mb-4" />
            <p class="text-xs font-weight-bold text-uppercase text-disabled mb-3">
              <VIcon icon="bx-brain" size="14" class="me-1" />
              Compétences évaluées
            </p>
            <VRow>
              <VCol
                v-for="comp in session.scoresCompetences"
                :key="comp.competenceId"
                cols="12" md="6"
              >
                <VCard variant="outlined" rounded="lg" class="mb-2">
                  <VCardText class="pa-3">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-sm font-weight-medium">{{ comp.nom }}</span>
                      <VChip
                        :color="getCompetenceColor(comp.statut)"
                        size="x-small"
                        variant="tonal"
                      >
                        {{ comp.statut }}
                      </VChip>
                    </div>
                    <VProgressLinear
                      :model-value="Math.round(comp.scoreObtenu * 100)"
                      :color="getProgressColor(comp.scoreObtenu)"
                      height="6"
                      rounded
                      bg-color="rgba(0,0,0,0.06)"
                      class="mb-1"
                    />
                    <p class="text-xs text-disabled mb-0">
                      {{ comp.nbBonnesReponses }}/{{ comp.nbQuestions }} bonnes réponses
                      · Niveau {{ comp.niveauAtteint }}
                    </p>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </div>

          <div v-else class="text-center py-3">
            <p class="text-xs text-disabled mb-0">
              Aucune donnée de compétences disponible
            </p>
          </div>

        </VCardText>
      </VCard>

      <!-- Empty state -->
      <VCard v-if="!user.sessions?.length" class="text-center py-12">
        <VCardText>
          <VIcon icon="bx-history" size="64" color="disabled" class="mb-4" />
          <p class="text-h6 text-disabled mb-2">Aucune session trouvée</p>
          <p class="text-sm text-disabled">
            Cet utilisateur n'a pas encore passé d'évaluation
          </p>
        </VCardText>
      </VCard>
    </div>

  </div>
</template>

<script setup lang="ts">
import usersService, { UserHistoryDTO } from '@/@admin/services/usersService'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()

const loading = ref(false)
const user = ref<UserHistoryDTO>({
  utilisateurId: 0,
  email: '',
  nom: '',
  prenom: '',
  totalSessions: 0,
  sessionsTerminees: 0,
  scoreGlobalMoyen: 0,
  sessions: [],
})

const goBack = () => router.push('/admin/users')

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

const getStatutIcon = (statut: string) => {
  if (statut === 'TERMINEE') return 'bx-check-circle'
  if (statut === 'EN_COURS') return 'bx-hourglass'
  return 'bx-x-circle'
}

const getStatutColor = (statut: string) => {
  if (statut === 'TERMINEE') return 'success'
  if (statut === 'EN_COURS') return 'warning'
  return 'error'
}

const getStatutColorHex = (statut: string) => {
  if (statut === 'TERMINEE') return '#28C76F'
  if (statut === 'EN_COURS') return '#FF9F43'
  return '#FF4C51'
}

const getScoreClass = (score: number) => {
  if (score >= 0.8) return 'text-success'
  if (score >= 0.6) return 'text-warning'
  return 'text-error'
}

const getProgressColor = (score: number) => {
  if (score >= 0.8) return 'success'
  if (score >= 0.6) return 'warning'
  return 'error'
}

const getCompetenceColor = (statut: string) => {
  const colors: Record<string, string> = {
    LACUNE:      'error',
    A_RENFORCER: 'warning',
    ACQUIS:      'success',
    MAITRISE:    'primary',
  }
  return colors[statut] || 'grey'
}

const loadHistorique = async () => {
  try {
    loading.value = true
    const data = await usersService.getHistorique(route.params.id)
    if (data && typeof data === 'object') {
      user.value = {
        utilisateurId:    data.utilisateurId    || 0,
        email:            data.email            || '',
        nom:              data.nom              || '',
        prenom:           data.prenom           || '',
        totalSessions:    data.totalSessions    || 0,
        sessionsTerminees: data.sessionsTerminees || 0,
        scoreGlobalMoyen: data.scoreGlobalMoyen || 0,
        sessions: Array.isArray(data.sessions) ? data.sessions : [],
      }
    }
  } catch (err) {
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadHistorique())
</script>
