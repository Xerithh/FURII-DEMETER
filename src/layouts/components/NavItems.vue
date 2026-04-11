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
      to: '/etudiant',
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
      title: 'Quiz sur une UE',
      icon: 'bx-brain',
      to: '/tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Quiz sur une matière',
      icon: 'bx-book-open',
      to: '/icons',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Quiz Aléatoire',
      icon: 'bx-shuffle',
      to: '/quiz-aleatoire',
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
      to: '/mes-modules',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Historique',
      icon: 'bx-history',
      to: '/historique',
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
      to: '/cards',
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
      to: '/centre-aide',
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
      to: '/account-settings',
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
