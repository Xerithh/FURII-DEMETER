<script setup>
import { useAuthStore } from "@/stores/auth";
import avatar1 from "@images/avatars/avatar-1.png";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const profileMenuOpen = ref(false);
const logoutDialogOpen = ref(false);

const openLogoutDialog = () => {
  profileMenuOpen.value = false;
  logoutDialogOpen.value = true;
};

const confirmLogout = () => {
  // clear session/local storage if needed
  try {
    // prefer store logout to keep app state consistent and show toast
    const authStore = useAuthStore();
    authStore.logout();
  } catch (e) {}

  logoutDialogOpen.value = false;
  router.push("/login");
};

const externalOpenHandler = () => openLogoutDialog();

onMounted(() => {
  window.addEventListener("open-logout-dialog", externalOpenHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("open-logout-dialog", externalOpenHandler);
});
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        v-model="profileMenuOpen"
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
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
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              Sophie Martin
            </VListItemTitle>
            <VListItemSubtitle>Étudiante</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem
            :to="{
              path: '/student/account-settings',
              query: { tab: 'account' },
            }"
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

          <!-- 👉 Settings -->
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

            <VListItemTitle>Paramètres</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem to="/student/help-center" link>
            <template #prepend>
              <VIcon class="me-2" icon="bx-help-circle" size="22" />
            </template>

            <VListItemTitle>Aide</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem link @click.prevent="openLogoutDialog">
            <template #prepend>
              <VIcon class="me-2" icon="bx-log-out" size="22" />
            </template>

            <VListItemTitle>Déconnexion</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>

  <VDialog v-model="logoutDialogOpen" max-width="420">
    <VCard>
      <VCardItem>
        <VCardTitle>Confirmer la déconnexion</VCardTitle>
      </VCardItem>

      <VCardText>
        Voulez-vous vraiment vous déconnecter de votre session ?
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
          >Se déconnecter</VBtn
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
