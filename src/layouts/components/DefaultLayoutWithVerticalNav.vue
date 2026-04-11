<script setup>
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import NavItems from "@/layouts/components/NavItems.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";

// TODO: Remplacer par votre logo AUXO au format PNG
// import logoAuxo from '@images/logo-auxo.png'
import logoAuxo from "@images/logo-auxo.png";
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchContainer = ref(null);
const searchInput = ref(null);
const searchValue = ref("");
const searchFocused = ref(false);
const isMac = ref(false);

const navSearchItems = [
  {
    title: "Mon Tableau de Bord",
    to: "/etudiant",
    icon: "bx-home-smile",
    keywords: ["tableau", "dashboard", "etudiant"],
  },
  {
    title: "Quiz sur une UE",
    to: "/tables",
    icon: "bx-brain",
    keywords: ["quiz", "ue"],
  },
  {
    title: "Quiz sur une matière",
    to: "/icons",
    icon: "bx-brain",
    keywords: ["quiz", "matiere"],
  },
  {
    title: "Quiz Aléatoire",
    to: "/icons",
    icon: "bx-brain",
    keywords: ["quiz", "aleatoire"],
  },
  {
    title: "Modules Suggérés",
    to: "/modules-suggeres",
    icon: "bx-bulb",
    keywords: ["recommandations", "modules"],
  },
  {
    title: "Parcours Personnalisés",
    to: "/parcours-personnalises",
    icon: "bx-map",
    keywords: ["parcours"],
  },
  {
    title: "Ressources Complémentaires",
    to: "/ressources-complementaires",
    icon: "bx-book-alt",
    keywords: ["ressources"],
  },
  {
    title: "Mes Modules",
    to: "/mes-modules",
    icon: "bx-book-open",
    keywords: ["apprentissage", "modules"],
  },
  {
    title: "Historique",
    to: "/historique",
    icon: "bx-history",
    keywords: ["progression"],
  },
  {
    title: "Mon Profil",
    to: "/account-settings",
    icon: "bx-user",
    keywords: ["profil", "compte", "parametres"],
  },
  {
    title: "Bibliothèque",
    to: "/cards",
    icon: "bx-library",
    keywords: ["ressources", "bibliotheque"],
  },
  {
    title: "Centre d'aide",
    to: "/centre-aide",
    icon: "bx-help-circle",
    keywords: ["aide", "faq", "support"],
  },
];

const normalizedSearch = computed(() => searchValue.value.trim().toLowerCase());
const filteredSearchItems = computed(() => {
  const query = normalizedSearch.value;

  if (!query) return navSearchItems.slice(0, 8);

  return navSearchItems
    .filter((item) => {
      const haystack =
        `${item.title} ${item.to} ${(item.keywords || []).join(" ")}`.toLowerCase();

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
  if (searchContainer.value && !searchContainer.value.contains(e.target))
    closeSearch();
};

const onGlobalKeydown = (e) => {
  const isK = e.key && (e.key === "k" || e.key === "K");

  if ((e.ctrlKey || e.metaKey) && isK) {
    // prevent browser/search shortcuts
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
  window.addEventListener("keydown", onGlobalKeydown);
  window.addEventListener("click", onGlobalClick);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onGlobalKeydown);
  window.removeEventListener("click", onGlobalClick);
});

onMounted(() => {
  // detect Mac platform for displaying the correct shortcut
  try {
    isMac.value =
      /Mac|iPhone|iPad|iPod/.test(navigator.platform) ||
      /Macintosh/.test(navigator.userAgent);
  } catch (e) {
    isMac.value = false;
  }
});
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
          ref="searchContainer"
          class="search-navbar-container d-flex align-center cursor-pointer ms-lg-n3"
          style="user-select: none"
        >
          <!-- 👉 Search Trigger button -->
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
              <span class="search-suggestion-path">{{ item.to }}</span>
            </button>
          </div>
        </div>

        <VSpacer />

        <NavbarThemeSwitcher class="me-1" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink to="/" class="app-logo app-title-wrapper">
        <img :src="logoAuxo" alt="AUXO Logo" class="app-logo-img" height="32" />
      </RouterLink>

      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="bx-x" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }

  // Constrain logo images
  &-img {
    height: 32px;
    width: auto;
    display: block;
  }
}

/* Search input wrapper: place the shortcut inside the input area */

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

.search-shortcut-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.search-shortcut-chip .meta-key {
  padding: 0.125rem 0.5rem;
  display: inline-flex;
  gap: 0.35rem;
}

.search-shortcut-chip .meta-key .kbd {
  padding: 0.18rem 0.45rem;
  border-radius: 6px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgba(0, 0, 0, 0.04);
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

.search-suggestion-path {
  color: rgba(var(--v-theme-on-surface), 0.58);
  font-size: 0.78rem;
  white-space: nowrap;
}
</style>
