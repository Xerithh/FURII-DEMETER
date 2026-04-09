<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const handleLogout = () => {
  try { localStorage.removeItem('authToken') } catch (e) {}
  router.push('/login')
}
</script>

<template>
  <!-- NAVIGATION ÉTUDIANT -->
  <!-- 👉 Tableau de Bord -->
  <VerticalNavLink
    :item="{
      title: 'Mon Tableau de Bord',
      icon: 'bx-home-smile',
      to: '/etudiant/dashboard',
    }"
  />

  <!-- 👉 Quiz -->
  <VerticalNavGroup
    :item="{
      title: 'Quiz',
      icon: 'bx-brain',
      neutral: true,
    }"
  >
    <VerticalNavLink :item="{ title: 'Quiz sur une UE', to: '/dev/tables' }" />
    <VerticalNavLink :item="{ title: 'Quiz sur une matière', to: '/dev/icons' }" />
    <VerticalNavLink :item="{ title: 'Quiz Aléatoire', to: '/dev/icons' }" />
  </VerticalNavGroup>

  <!-- 👉 Recommandations -->
  <VerticalNavGroup
    :item="{
      title: 'Recommandations',
      icon: 'bx-brain',
      badgeContent: '3',
      badgeClass: 'bg-success',
      neutral: true,
    }"
  >
    <VerticalNavLink :item="{ title: 'Modules Suggérés', to: '/etudiant/modules-suggeres' }" />
    <VerticalNavLink :item="{ title: 'Parcours Personnalisés', to: '/etudiant/parcours-personnalises' }" />
    <VerticalNavLink :item="{ title: 'Ressources Complémentaires', to: '/etudiant/ressources-complementaires' }" />
  </VerticalNavGroup>

  <!-- 👉 Mon Apprentissage -->
  <VerticalNavSectionTitle :item="{ heading: 'Mon Apprentissage' }" />
  <VerticalNavLink :item="{ title: 'Mes Modules', icon: 'bx-book-open', to: '/etudiant/mes-modules' }" />
  <VerticalNavLink :item="{ title: 'Mon Parcours', icon: 'bx-trending-up', to: '/etudiant/mon-parcours' }" />
  <VerticalNavLink :item="{ title: 'Mes Évaluations', icon: 'bx-medal', to: '/etudiant/mes-evaluations' }" />
  <VerticalNavLink :item="{ title: 'Historique', icon: 'bx-history', to: '/etudiant/historique' }" />
  <VerticalNavLink :item="{ title: 'Mon Profil', icon: 'bx-user', to: '/etudiant/account-settings' }" />

  <!-- 👉 Ressources -->
  <VerticalNavSectionTitle :item="{ heading: 'Ressources' }" />
  <VerticalNavLink :item="{ title: 'Bibliothèque', icon: 'bx-library', to: '/dev/cards' }" />
  <VerticalNavLink :item="{ title: 'Exercices', icon: 'bx-edit', to: '/dev/form-layouts' }" />

  <!-- 👉 Communauté -->
  <VerticalNavSectionTitle :item="{ heading: 'Communauté' }" />
  <VerticalNavLink :item="{ title: 'Forum', icon: 'bx-message-square-dots', to: '/dev/tables' }" />
  <VerticalNavLink :item="{ title: 'Groupes d\'étude', icon: 'bx-group', to: '/dev/cards' }" />

  <!-- 👉 Aide -->
  <VerticalNavSectionTitle :item="{ heading: 'Aide & Support' }" />
  <VerticalNavLink :item="{ title: 'Centre d\'aide', icon: 'bx-help-circle', to: '/dev/typography' }" />
  <VerticalNavLink :item="{ title: 'Tutoriels', icon: 'bx-video', to: '/dev/icons' }" />
  <VerticalNavLink :item="{ title: 'Contacter un Tuteur', icon: 'bx-message', to: '/etudiant/dashboard' }" />

  <!-- 👉 Compte -->
  <VerticalNavSectionTitle :item="{ heading: 'Compte' }" />
  <VerticalNavLink
    :item="{
      title: 'Déconnexion',
      icon: 'bx-log-out',
    }"
    @click="handleLogout"
    class="mb-logout cursor-pointer"
  />
</template>

<style scoped lang="scss">
::v-deep .mb-logout {
  margin-bottom: 3rem;
}
</style>
