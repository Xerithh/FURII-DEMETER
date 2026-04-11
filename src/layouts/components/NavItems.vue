<script setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
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

  <!-- 👉 Quiz (remonté en haut) -->
  <VerticalNavGroup
    :item="{
      title: 'Quiz',
      icon: 'bx-brain',
      neutral: true,
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Quiz sur une UE',
        to: '/tables',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Quiz sur une matière',
        to: '/icons',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Quiz Aléatoire',
        to: '/icons',
      }"
    />
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
    <VerticalNavLink
      :item="{
        title: 'Modules Suggérés',
        to: '/modules-suggeres',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Parcours Personnalisés',
        to: '/parcours-personnalises',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Ressources Complémentaires',
        to: '/ressources-complementaires',
      }"
    />
  </VerticalNavGroup>

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

  <VerticalNavLink
    :item="{
      title: 'Mon Profil',
      icon: 'bx-user',
      to: '/account-settings',
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
