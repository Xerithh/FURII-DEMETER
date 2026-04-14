<template>
  <div class="admin-users">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Gestion des Utilisateurs</h1>
      <VBtn
        color="primary"
        variant="tonal"
        prepend-icon="bx:refresh"
        @click="refresh"
        :loading="adminStore.isUsersLoading"
      >
        Actualiser
      </VBtn>
    </div>

    <!-- Loading state -->
    <VProgressLinear
      v-if="adminStore.isUsersLoading"
      indeterminate
      class="mb-6"
    />

    <!-- Users Table -->
    <UsersTable
      :users="adminStore.users"
      :loading="adminStore.isUsersLoading"
      @view-detail="handleViewDetail"
      @suspend="handleSuspend"
      @activate="handleActivate"
      @delete="handleDelete"
    />

    <!-- Detail Dialog (TODO: Phase 3+) -->
    <VDialog v-model="showDetailDialog" max-width="600">
      <VCard>
        <VCardItem>
          <VCardTitle>Détails Utilisateur</VCardTitle>
        </VCardItem>
        <VDivider />
        <VCardText class="pa-6">
          <p v-if="selectedUser" class="text-body-2">
            <strong>Email:</strong> {{ selectedUser.email }} <br />
            <strong>Nom:</strong> {{ selectedUser.nom }}
            {{ selectedUser.prenom }}
            <br />
            <strong>Rôle:</strong> {{ selectedUser.role }} <br />
            <strong>Statut:</strong> {{ selectedUser.statut }} <br />
            <strong>Sessions:</strong> {{ selectedUser.nombreSessions }} <br />
            <strong>Score Moyen:</strong> {{ selectedUser.scoreMoyen }}%
          </p>
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn text @click="showDetailDialog = false">Fermer</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Confirm Delete Dialog -->
    <VDialog v-model="showConfirmDeleteDialog" max-width="400">
      <VCard>
        <VCardItem>
          <VCardTitle class="text-error">Confirmer la suppression</VCardTitle>
        </VCardItem>
        <VDivider />
        <VCardText class="pa-6">
          <p v-if="userToDelete">
            Êtes-vous sûr de vouloir supprimer l'utilisateur
            <strong>{{ userToDelete.email }}</strong> ?
          </p>
          <p class="text-caption text-medium-emphasis">
            Cette action est irréversible.
          </p>
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn text @click="showConfirmDeleteDialog = false">Annuler</VBtn>
          <VBtn color="error" @click="confirmDelete" :loading="isDeleting">
            Supprimer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import UsersTable from "@/@admin/components/tables/UsersTable.vue";
import { useAdminStore } from "@/@admin/stores/admin";
import type { UtilisateurDashboardDTO } from "@/@admin/types/admin";
import { useToastStore } from "@/stores/toast";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const toastStore = useToastStore();
const router = useRouter();

// Dialog states
const showDetailDialog = ref(false);
const showConfirmDeleteDialog = ref(false);
const selectedUser = ref<UtilisateurDashboardDTO | null>(null);
const userToDelete = ref<UtilisateurDashboardDTO | null>(null);
const isDeleting = ref(false);

const breadcrumbs = [
  {
    title: "Admin",
    href: "/admin",
    disabled: false,
  },
  {
    title: "Utilisateurs",
    disabled: true,
  },
];

onMounted(() => {
  adminStore.fetchUsers();
});

const refresh = () => {
  adminStore.fetchUsers();
};

// Action handlers
const handleViewDetail = (user: UtilisateurDashboardDTO) => {
  router.push(`/admin/users/${user.id}`);
};

const handleSuspend = (user: UtilisateurDashboardDTO) => {
  toastStore.addToast({
    message: `Utilisateur ${user.email} suspendu (TODO: API call)`,
    type: "warning",
  });
  // TODO: Implémenter l'appel API pour suspendre
};

const handleActivate = (user: UtilisateurDashboardDTO) => {
  toastStore.addToast({
    message: `Utilisateur ${user.email} activé (TODO: API call)`,
    type: "success",
  });
  // TODO: Implémenter l'appel API pour activer
};

const handleDelete = (user: UtilisateurDashboardDTO) => {
  userToDelete.value = user;
  showConfirmDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  isDeleting.value = true;
  try {
    // TODO: Implémenter l'appel API pour supprimer
    toastStore.addToast({
      message: `Utilisateur ${userToDelete.value.email} supprimé (TODO: API call)`,
      type: "success",
    });
    showConfirmDeleteDialog.value = false;
    userToDelete.value = null;
  } catch (error) {
    toastStore.addToast({
      message: "Erreur lors de la suppression",
      type: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>
