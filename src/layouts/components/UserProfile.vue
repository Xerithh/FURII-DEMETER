<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const profileMenuOpen = ref(false);
const logoutDialogOpen = ref(false);

const fullName = computed(() => {
  const prenom = authStore.user?.prenom?.trim() || "";
  const nom = authStore.user?.nom?.trim() || "";
  const combined = `${prenom} ${nom}`.trim();
  if (combined) return combined;

  const mailPrefix = authStore.user?.email?.split("@")?.[0]?.trim();
  return mailPrefix || "Utilisateur";
});

const roleLabel = computed(() => authStore.mapRoleLabel(authStore.user?.role));

const avatarSrc = computed(() => {
  const photo = authStore.user?.photoUrl?.trim();
  return photo || "";
});

const initials = computed(() => {
  const prenom = authStore.user?.prenom?.trim() || "";
  const nom = authStore.user?.nom?.trim() || "";
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase().trim();
});

const openLogoutDialog = () => {
  profileMenuOpen.value = false;
  logoutDialogOpen.value = true;
};

const confirmLogout = () => {
  authStore.logout();
  logoutDialogOpen.value = false;
  router.push("/login");
};

const externalOpenHandler = () => openLogoutDialog();

onMounted(() => {
  window.addEventListener("open-logout-dialog", externalOpenHandler);

  if (
    authStore.isAuthenticated &&
    (!authStore.user?.prenom || !authStore.user?.nom)
  ) {
    authStore.loadCompleteProfile();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("open-logout-dialog", externalOpenHandler);
});
</script>

<template>
  <div class="d-flex align-center cursor-pointer" role="button" tabindex="0">
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      color="success"
      bordered
    >
      <VAvatar color="primary" variant="tonal">
        <VImg v-if="avatarSrc" :src="avatarSrc" />
        <span v-else-if="initials" class="text-subtitle-2 font-weight-bold">{{
          initials
        }}</span>
        <VIcon v-else icon="bx-user" />
      </VAvatar>
    </VBadge>

    <div class="d-none d-md-flex flex-column ms-2 text-right">
      <span class="text-body-2 font-weight-medium line-clamp-1">{{
        fullName
      }}</span>
      <span class="text-caption text-medium-emphasis line-clamp-1">{{
        roleLabel
      }}</span>
    </div>

    <VMenu
      v-model="profileMenuOpen"
      activator="parent"
      width="230"
      location="bottom end"
      offset="14px"
    >
      <VList>
        <VListItem>
          <template #prepend>
            <VListItemAction start>
              <VBadge
                dot
                location="bottom right"
                offset-x="3"
                offset-y="3"
                color="success"
              >
                <VAvatar color="primary" variant="tonal">
                  <VImg v-if="avatarSrc" :src="avatarSrc" />
                  <span
                    v-else-if="initials"
                    class="text-subtitle-2 font-weight-bold"
                    >{{ initials }}</span
                  >
                  <VIcon v-else icon="bx-user" />
                </VAvatar>
              </VBadge>
            </VListItemAction>
          </template>

          <VListItemTitle class="font-weight-semibold">{{
            fullName
          }}</VListItemTitle>
          <VListItemSubtitle>{{ roleLabel }}</VListItemSubtitle>
        </VListItem>

        <VDivider class="my-2" />

        <VListItem
          :to="{ path: '/student/account-settings', query: { tab: 'account' } }"
          :class="{
            'router-link-exact-active':
              route.path === '/student/account-settings' &&
              route.query.tab === 'account',
          }"
          link
        >
          <template #prepend>
            <VIcon class="me-2" icon="bx-user" size="22" />
          </template>
          <VListItemTitle>Mon Profil</VListItemTitle>
        </VListItem>

        <VListItem
          :to="{
            path: '/student/account-settings',
            query: { tab: 'settings' },
          }"
          :class="{
            'router-link-exact-active':
              route.path === '/student/account-settings' &&
              route.query.tab === 'settings',
          }"
          link
        >
          <template #prepend>
            <VIcon class="me-2" icon="bx-cog" size="22" />
          </template>
          <VListItemTitle>Parametres</VListItemTitle>
        </VListItem>

        <VListItem to="/student/help-center" link>
          <template #prepend>
            <VIcon class="me-2" icon="bx-help-circle" size="22" />
          </template>
          <VListItemTitle>Aide</VListItemTitle>
        </VListItem>

        <VDivider class="my-2" />

        <VListItem link @click.prevent="openLogoutDialog">
          <template #prepend>
            <VIcon class="me-2" icon="bx-log-out" size="22" />
          </template>
          <VListItemTitle>Deconnexion</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>

  <VDialog v-model="logoutDialogOpen" max-width="420">
    <VCard>
      <VCardItem>
        <VCardTitle>Confirmer la deconnexion</VCardTitle>
      </VCardItem>

      <VCardText>
        Voulez-vous vraiment vous deconnecter de votre session ?
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="logoutDialogOpen = false"
        >
          Annuler
        </VBtn>
        <VBtn class="logout-confirm-btn" @click="confirmLogout"
          >Se deconnecter</VBtn
        >
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.logout-confirm-btn {
  background-color: #ef4444 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: none !important;
  text-transform: none !important;
}

.logout-confirm-btn:hover {
  background-color: #dc2626 !important;
  color: #ffffff !important;
}
</style>
