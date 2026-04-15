<!-- src/@admin/layouts/AdminLayout.vue -->
<script setup lang="ts">
import VerticalNavLayout from "@/@layouts/components/VerticalNavLayout.vue";
import VerticalNavLink from "@/@layouts/components/VerticalNavLink.vue";
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import logoAuxo from "@/assets/images/logo-auxo.png";
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import { useAuthStore } from "@/stores/auth";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const searchContainer = ref(null);
const searchInput = ref(null);
const searchValue = ref("");
const searchFocused = ref(false);

const navSearchItems = computed(() => [
  {
    title: "Tableau de Bord",
    to: "/admin",
    icon: "bx-home-smile",
    section: "Vue d'ensemble",
    keywords: ["dashboard", "accueil", "admin"],
  },
  {
    title: "Utilisateurs",
    to: "/admin/users",
    icon: "bx-group",
    section: "Gestion du Contenu",
    keywords: ["utilisateur", "comptes", "etudiants"],
  },
  {
    title: "Questions",
    to: "/admin/questions",
    icon: "bx-help-circle",
    section: "Gestion du Contenu",
    keywords: ["questions", "quiz", "banque"],
  },
  {
    title: "Statistiques",
    to: "/admin/statistiques",
    icon: "bx-bar-chart-alt-2",
    section: "Statistiques",
    keywords: ["stats", "analyse", "indicateurs"],
  },
]);

const normalizedSearch = computed(() => searchValue.value.trim().toLowerCase());
const filteredSearchItems = computed(() => {
  const query = normalizedSearch.value;
  const source = navSearchItems.value || [];

  if (!query) return source.slice(0, 8);

  return source
    .filter((item) => {
      const haystack =
        `${item.title} ${item.section || ""} ${(item.keywords || []).join(" ")}`.toLowerCase();

      return haystack.includes(query);
    })
    .slice(0, 8);
});

const showSuggestions = computed(
  () => searchFocused.value && filteredSearchItems.value.length > 0,
);

const openSearch = async () => {
  searchFocused.value = true;
  await nextTick();

  if (searchInput.value && typeof searchInput.value.focus === "function") {
    searchInput.value.focus();

    const val = searchInput.value.value;

    searchInput.value.setSelectionRange?.(val?.length ?? 0, val?.length ?? 0);
  }
};

const closeSearch = ({ clearValue = false } = {}) => {
  if (clearValue) searchValue.value = "";
  searchFocused.value = false;
  searchInput.value?.blur?.();
};

const resetSearchState = () => closeSearch({ clearValue: true });

const selectSearchItem = (item) => {
  resetSearchState();
  router.push(item.to).catch(() => {});
};

const onGlobalClick = (e) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    closeSearch();
  }
};

const onGlobalKeydown = (e) => {
  const isK = e.key && (e.key === "k" || e.key === "K");

  if ((e.ctrlKey || e.metaKey) && isK) {
    e.preventDefault();
    e.stopPropagation();
    openSearch();
    return;
  }

  if (e.key === "Escape" && searchFocused.value) {
    closeSearch();
    return;
  }

  if (
    e.key === "Enter" &&
    searchFocused.value &&
    filteredSearchItems.value.length > 0
  ) {
    e.preventDefault();
    selectSearchItem(filteredSearchItems.value[0]);
  }
};

onMounted(() => {
  // Force sidebar visible en desktop
  document.documentElement.style.setProperty("--layout-nav-type", "vertical");
  window.addEventListener("keydown", onGlobalKeydown);
  window.addEventListener("click", onGlobalClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onGlobalKeydown);
  window.removeEventListener("click", onGlobalClick);
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 Navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <div
          ref="searchContainer"
          class="search-navbar-container d-flex align-center cursor-pointer ms-lg-n3"
          style="user-select: none"
        >
          <IconBtn @click.stop="openSearch">
            <VIcon icon="bx-search" />
          </IconBtn>

          <span class="d-none d-md-flex align-center text-disabled ms-2">
            <div
              class="search-input-wrapper me-2"
              :class="{ focused: searchFocused }"
            >
              <input
                ref="searchInput"
                v-model="searchValue"
                type="text"
                placeholder="Rechercher..."
                style="
                  background: transparent;
                  border: none;
                  outline: none;
                  color: #000;
                  font-size: inherit;
                  font-family: inherit;
                  padding: 0;
                "
                class="search-input"
                @focus="openSearch"
                @blur="searchFocused = false"
              />

              <span v-show="!searchValue.length" class="shortcut-badge">
                <span class="kbd">Ctrl+K</span>
                <span class="kbd">⌘K</span>
              </span>
            </div>
          </span>

          <div v-if="showSuggestions" class="search-suggestions">
            <button
              v-for="item in filteredSearchItems"
              :key="`${item.title}-${item.to}`"
              type="button"
              class="search-suggestion-item"
              @mousedown.prevent="selectSearchItem(item)"
            >
              <span class="search-suggestion-left">
                <VIcon :icon="item.icon" size="18" class="me-2" />
                <span>{{ item.title }}</span>
              </span>
              <span class="search-suggestion-meta">{{ item.section }}</span>
            </button>
          </div>
        </div>

        <VSpacer />

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
          style="height: 32px; width: auto; object-fit: contain"
        />
      </RouterLink>
      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="bx-x" />
      </IconBtn>
    </template>

    <!-- 👉 Navigation -->
    <template #vertical-nav-content>
      <VerticalNavSectionTitle
        :item="{
          heading: 'Vue d\'ensemble',
        }"
      />
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

      <VerticalNavSectionTitle
        :item="{
          heading: 'Compte',
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

<style lang="scss">
@use "@layouts/styles/default-layout";

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;
  text-decoration: none;
}

.search-input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.search-navbar-container {
  position: relative;
}

.search-input-wrapper .search-input {
  padding-right: 2.5rem;
}

.shortcut-badge {
  position: absolute;
  right: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.12s ease;
  display: inline-flex;
  align-items: center;
}

.shortcut-badge .kbd {
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.45rem;
  border-radius: 6px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgba(0, 0, 0, 0.04);
  font-size: 0.85rem;
  line-height: 1;
}

.shortcut-badge .kbd + .kbd {
  margin-left: 0.35rem;
}

.search-input-wrapper.focused .shortcut-badge {
  opacity: 0;
}

.search-suggestions {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: 30;
  width: min(38rem, 82vw);
  max-height: 22rem;
  overflow-y: auto;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 0 0 12px 12px;
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.search-suggestion-item {
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.search-suggestion-item + .search-suggestion-item {
  border-top: 1px solid rgba(var(--v-border-color), 0.08);
}

.search-suggestion-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.search-suggestion-left {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.search-suggestion-meta {
  color: rgba(var(--v-theme-on-surface), 0.58);
  font-size: 0.78rem;
  white-space: nowrap;
}
</style>
