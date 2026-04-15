<!-- src/@admin/layouts/AdminLayout.vue -->
<script setup lang="ts">
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import logoAuxo from '@/assets/images/logo-auxo.png'
import VerticalNavLayout from '@/@layouts/components/VerticalNavLayout.vue'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLink from '@/@layouts/components/VerticalNavLink.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // Force sidebar visible en desktop
  document.documentElement.style.setProperty('--layout-nav-type', 'vertical')
})

const authStore = useAuthStore()
const router = useRouter()

const notifications = [
  {
    title: 'Nouvel utilisateur inscrit',
    message: 'Un nouveau candidat VAE vient de s\'inscrire',
    time: 'il y a 10min',
    icon: 'bx-user-plus',
    color: 'primary',
  },
  {
    title: 'Question signalée',
    message: 'Une question a été signalée comme incorrecte',
    time: 'il y a 1h',
    icon: 'bx-error',
    color: 'warning',
  },
  {
    title: 'Rapport disponible',
    message: 'Statistiques hebdomadaires prêtes',
    time: 'il y a 3h',
    icon: 'bx-bar-chart-alt-2',
    color: 'success',
  },
]

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <VerticalNavLayout>

    <!-- 👉 Navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">

        <IconBtn class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- Badge Admin -->
        <VChip color="primary" variant="tonal" size="small" class="ms-2">
          <VIcon icon="bx-shield" start size="14" />
          Administration ISIS
        </VChip>

        <VSpacer />

        <!-- Notifications -->
        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
          <VBadge color="error" content="3" floating />
          <VMenu activator="parent" width="380" location="bottom end" offset="14px">
            <VList>
              <VListItem>
                <VListItemTitle class="font-weight-semibold text-h6">
                  Notifications
                </VListItemTitle>
              </VListItem>
              <VDivider class="my-2" />
              <VListItem
                v-for="(notif, idx) in notifications"
                :key="idx"
                link
              >
                <template #prepend>
                  <VAvatar
                    :icon="notif.icon"
                    :color="notif.color"
                    size="40"
                    rounded
                    variant="tonal"
                    class="me-3"
                  />
                </template>
                <VListItemTitle class="font-weight-semibold">
                  {{ notif.title }}
                </VListItemTitle>
                <VListItemSubtitle class="text-sm">
                  {{ notif.message }}
                </VListItemSubtitle>
                <VListItemSubtitle class="text-xs text-disabled">
                  {{ notif.time }}
                </VListItemSubtitle>
              </VListItem>
              <VDivider class="my-2" />
              <VListItem link>
                <VListItemTitle class="text-center text-primary">
                  Voir toutes les notifications
                </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </IconBtn>

        <NavbarThemeSwitcher class="me-1" />
        <UserProfile />

      </div>
    </template>

    <!-- 👉 Logo Sidebar -->
    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink to="/admin" class="app-logo d-flex align-center gap-2">
        <img
          :src="logoAuxo"
          alt="AUXO Logo"
          style="height: 32px; width: auto; object-fit: contain;"
        />
        <VChip color="primary" size="x-small" variant="tonal">
          Admin
        </VChip>
      </RouterLink>
      <IconBtn class="d-block d-lg-none" @click="toggleIsOverlayNavActive(false)">
        <VIcon icon="bx-x" />
      </IconBtn>
    </template>

    <!-- 👉 Navigation -->
    <template #vertical-nav-content>

      <VerticalNavLink
        :item="{
          title: 'Tableau de Bord',
          icon: 'bx-home-smile',
          to: '/admin',
        }"
      />

      <VerticalNavSectionTitle :item="{ heading: 'Gestion du Contenu' }" />

      <VerticalNavLink
        :item="{
          title: 'Utilisateurs',
          icon: 'bx-group',
          to: '/admin/users',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Questions',
          icon: 'bx-help-circle',
          to: '/admin/questions',
        }"
      />

      <VerticalNavSectionTitle :item="{ heading: 'Statistiques' }" />

      <VerticalNavLink
        :item="{
          title: 'Statistiques',
          icon: 'bx-bar-chart-alt-2',
          to: '/admin/statistiques',
        }"
      />

      <VerticalNavSectionTitle :item="{ heading: 'Compte' }" />

      <VerticalNavLink
        :item="{
          title: 'Mon Profil',
          icon: 'bx-user',
          to: '/student/account-settings',
        }"
      />

      <VerticalNavLink
        :item="{ title: 'Déconnexion', icon: 'bx-log-out' }"
        @click="logout"
      />

    </template>

    <!-- 👉 Pages -->
    <RouterView />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

  </VerticalNavLayout>
</template>

css<style lang="scss">
@use "@layouts/styles/default-layout";

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;
  text-decoration: none;
}
</style>
