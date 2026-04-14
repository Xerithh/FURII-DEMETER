<template>
  <VCard>
    <VCardItem>
  <VCardTitle>Utilisateurs</VCardTitle>
  <VCardSubtitle>{{ filteredUsers.length }} utilisateur(s)</VCardSubtitle>
  <template #append>
    <VTextField
      v-model="search"
      prepend-inner-icon="bx-search"
      placeholder="Rechercher..."
      density="compact"
      variant="outlined"
      style="min-width: 250px"
      hide-details
      clearable
    />
  </template>
</VCardItem>
    <VDivider />

    <!-- Filters Row -->
    <VCardText class="filters-row pa-4">
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <VSelect
            v-model="filterRole"
            label="Filtrer par Rôle"
            :items="roleOptions"
            clearable
            dense
          />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VSelect
            v-model="filterStatut"
            label="Filtrer par Statut"
            :items="statutOptions"
            clearable
            dense
          />
        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center gap-2">
          <VBtn
            color="primary"
            variant="tonal"
            size="small"
            @click="applyFilters"
          >
            Appliquer Filtres
          </VBtn>
          <VBtn variant="tonal" size="small" @click="resetFilters">
            Réinitialiser
          </VBtn>
          <span class="text-caption text-medium-emphasis">
            {{ filteredUsers.length }} utilisateur(s)
          </span>
        </VCol>
      </VRow>
    </VCardText>

    <VDivider />

    <!-- Table -->
    <VDataTable
      :headers="headers"
      :items="paginatedUsers"
      :loading="loading"
      :items-per-page.sync="itemsPerPage"
      :page.sync="currentPage"
      class="elevation-1 data-table clickable-table"
      density="comfortable"
      item-key="id"
    >
      <!-- Email Column (Clickable) -->
      <template #item.email="{ item }">
        <div class="email-cell" @click="emitShowDetail(item)">
          {{ item.email }}
        </div>
      </template>

      <!-- Nom Column (Clickable) -->
      <template #item.nom="{ item }">
        <div class="name-cell" @click="emitShowDetail(item)">
          {{ item.nom }} {{ item.prenom }}
        </div>
      </template>

      <!-- Role Column -->
      <template #item.role="{ item }">
        <VChip
          :color="getRoleColor(item.role)"
          variant="elevated"
          size="small"
          label
        >
          {{ getRoleLabel(item.role) }}
        </VChip>
      </template>

      <!-- Statut Column -->
      <template #item.statut="{ item }">
        <VChip
          :color="getStatutColor(item.statut)"
          variant="tonal"
          size="small"
          label
        >
          {{ item.statut }}
        </VChip>
      </template>

      <!-- Score Moyen Column -->
      <template #item.scoreMoyen="{ item }">
  <div class="d-flex align-center gap-2">
    <VProgressCircular
      :model-value="item.scoreMoyen > 1 ? item.scoreMoyen : item.scoreMoyen * 10"
      :color="getScoreColor(item.scoreMoyen > 1 ? item.scoreMoyen : item.scoreMoyen * 10)"
      size="36"
      width="3"
    >
      <span class="text-caption font-weight-bold" style="font-size: 9px !important">
        {{ item.scoreMoyen > 1 
          ? Math.round(item.scoreMoyen) 
          : Math.round(item.scoreMoyen * 10) }}%
      </span>
    </VProgressCircular>
  </div>
</template>

      <!-- Dernière Connexion Column -->
      <template #item.derniereConnexion="{ item }">
        <span class="text-caption">
          {{ formatDate(item.derniereConnexion) }}
        </span>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <VBtn
            icon="bx:info-circle"
            size="x-small"
            variant="text"
            color="info"
            @click="emitShowDetail(item)"
          />
          <VMenu>
            <template #activator="{ props }">
              <VBtn
                icon="bx:dots-vertical-rounded"
                size="x-small"
                variant="text"
                v-bind="props"
              />
            </template>
            <VList min-width="200">
              <VListItem
                v-if="item.statut === 'ACTIF'"
                @click="emitSuspend(item)"
              >
                <template #prepend>
                  <VIcon icon="bx:pause" />
                </template>
                <VListItemTitle>Suspendre</VListItemTitle>
              </VListItem>
              <VListItem
                v-if="item.statut !== 'ACTIF'"
                @click="emitActivate(item)"
              >
                <template #prepend>
                  <VIcon icon="bx:play" />
                </template>
                <VListItemTitle>Activer</VListItemTitle>
              </VListItem>
              <VDivider class="my-2" />
              <VListItem @click="emitDelete(item)">
                <template #prepend>
                  <VIcon icon="bx:trash" color="error" />
                </template>
                <VListItemTitle class="text-error">Supprimer</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </template>

      <!-- No data slot -->
      <template #no-data>
        <VEmptyState
          headline="Aucun utilisateur trouvé"
          text="Essayez de modifier vos filtres ou votre recherche"
        />
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup lang="ts">
import type {
  Role,
  StatutCompte,
  UtilisateurDashboardDTO,
} from "@/@admin/types/admin";
import { computed, ref } from "vue";

interface Props {
  users: UtilisateurDashboardDTO[];
  loading?: boolean;
}

interface Emits {
  (e: "view-detail", user: UtilisateurDashboardDTO): void;
  (e: "suspend", user: UtilisateurDashboardDTO): void;
  (e: "activate", user: UtilisateurDashboardDTO): void;
  (e: "delete", user: UtilisateurDashboardDTO): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// State
const search = ref("");
const filterRole = ref<Role | null>(null);
const filterStatut = ref<StatutCompte | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Options
const roleOptions = [
  { title: "Étudiants FIE3", value: "ETUDIANT_FIE3" },
  { title: "Candidats VAE", value: "CANDIDAT_VAE" },
];

const statutOptions = [
  { title: "Actif", value: "ACTIF" },
  { title: "En attente OTP", value: "EN_ATTENTE_OTP" },
  { title: "Suspendu", value: "SUSPENDU" },
];

// Table Headers
const headers = [
  { title: "Email", key: "email" },
  { title: "Nom / Prénom", key: "nom" },
  { title: "Rôle", key: "role", width: "120px" },
  { title: "Statut", key: "statut", width: "120px" },
  { title: "Sessions", key: "nombreSessions", align: "center" },
  { title: "Score Moyen", key: "scoreMoyen", align: "center", width: "120px" },
  { title: "Dernière Connexion", key: "derniereConnexion" },
  { title: "", key: "actions", align: "end", sortable: false, width: "80px" },
];

// Filtered & Paginated Data
const filteredUsers = computed(() => {
  return props.users.filter((user) => {
    // Exclude admin users
    if (user.role === "ADMIN") {
      return false;
    }

    // Search filter
    const searchLower = search.value.toLowerCase();
    const matchesSearch =
      !searchLower ||
      user.email.toLowerCase().includes(searchLower) ||
      user.nom.toLowerCase().includes(searchLower) ||
      user.prenom.toLowerCase().includes(searchLower);

    // Role filter
    const matchesRole = !filterRole.value || user.role === filterRole.value;

    // Statut filter
    const matchesStatut =
      !filterStatut.value || user.statut === filterStatut.value;

    return matchesSearch && matchesRole && matchesStatut;
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Helper Functions
const getRoleColor = (role: Role) => {
  const colors: Record<Role, string> = {
    ETUDIANT_FIE3: "blue",
    CANDIDAT_VAE: "green",
    ADMIN: "purple",
  };
  return colors[role] || "grey";
};

const getRoleLabel = (role: Role) => {
  const labels: Record<Role, string> = {
    ETUDIANT_FIE3: "FIE3",
    CANDIDAT_VAE: "VAE",
    ADMIN: "Admin",
  };
  return labels[role] || role;
};

const getStatutColor = (statut: StatutCompte) => {
  const colors: Record<StatutCompte, string> = {
    ACTIF: "success",
    EN_ATTENTE_OTP: "warning",
    SUSPENDU: "error",
  };
  return colors[statut] || "grey";
};

const getScoreColor = (score: number) => {
  const normalized = score > 1 ? score : score * 100
  if (normalized >= 80) return 'success'
  if (normalized >= 60) return 'warning'
  return 'error'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page
};

const resetFilters = () => {
  search.value = "";
  filterRole.value = null;
  filterStatut.value = null;
  currentPage.value = 1;
};

// Emits
const emitShowDetail = (user: UtilisateurDashboardDTO) => {
  emit("view-detail", user);
};

const emitSuspend = (user: UtilisateurDashboardDTO) => {
  emit("suspend", user);
};

const emitActivate = (user: UtilisateurDashboardDTO) => {
  emit("activate", user);
};

const emitDelete = (user: UtilisateurDashboardDTO) => {
  emit("delete", user);
};
</script>

<style scoped lang="scss">
.filters-row {
  background-color: rgba(0, 0, 0, 0.02);
}

.search-field {
  max-width: 300px;
}

.email-cell,
.name-cell {
  cursor: pointer;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.1);
    text-decoration: underline;
  }
}

:deep(.data-table) {
  .v-data-table__tr {
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
