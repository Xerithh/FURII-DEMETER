<script setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  // trigger global event to open logout confirmation handled by UserProfile
  try {
    window.dispatchEvent(new CustomEvent("open-logout-dialog"));
  } catch (e) {}
};
</script>

<template>
  <!-- 👉 Tableau de Bord -->
  <VerticalNavLink
    :item="{
      title: 'Mon Tableau de Bord',
      icon: 'bx-home-smile',
      to: '/student/dashboard',
    }"
  />

  <!-- 👉 Quiz -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Quizz',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Évaluation Globale',
      icon: 'bx-brain',
      to: '/student/random-quiz',
    }"
  />

  <!-- 👉 Mon Apprentissage -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Mon Apprentissage',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Mes Modules',
      icon: 'bx-book-open',
      to: '/student/my-modules',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Historique',
      icon: 'bx-history',
      to: '/student/history',
    }"
  />

  <!-- 👉 Ressources -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Ressources',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Bibliothèque',
      icon: 'bx-library',
      to: '/student/cards',
    }"
  />

  <!-- 👉 Communauté -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Communauté',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Centre d\'aide',
      icon: 'bx-group',
      to: '/student/help-center',
    }"
  />

  <!-- 👉 Compte -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Compte',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Mon Profil',
      icon: 'bx-user',
      to: '/student/account-settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Déconnexion',
      icon: 'bx-log-out',
    }"
    class="mb-logout"
    @click="handleLogout"
  />
</template>

<style scoped lang="scss">
::v-deep .mb-logout {
  margin-bottom: 3rem;
}
</style>
