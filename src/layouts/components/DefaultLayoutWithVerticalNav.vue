<script setup>
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import NavItems from '@/layouts/components/NavItems.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// TODO: Remplacer par votre logo AUXO au format PNG
// import logoAuxo from '@images/logo-auxo.png'
import logoAuxo from '@images/logo-auxo.png'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const searchInput = ref(null)
const searchValue = ref('')
const searchFocused = ref(false)
const isMac = ref(false)

const onGlobalKeydown = e => {
  const isK = e.key && (e.key === 'k' || e.key === 'K')
  if ((e.ctrlKey || e.metaKey) && isK) {
    // prevent browser/search shortcuts
    e.preventDefault()
    e.stopPropagation()

    // focus the search input if available
    if (searchInput.value && typeof searchInput.value.focus === 'function') {
      searchInput.value.focus()


      // place cursor at end
      const val = searchInput.value.value

      searchInput.value.setSelectionRange?.(val?.length ?? 0, val?.length ?? 0)
    }
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))

onMounted(() => {
  // detect Mac platform for displaying the correct shortcut
  try {
    isMac.value = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || /Macintosh/.test(navigator.userAgent)
  } catch (e) {
    isMac.value = false
  }
})

const notifications = [
  {
    title: 'Nouveau module recommandé',
    message: 'DevOps - CI/CD pour débutants',
    time: 'il y a 2h',
    icon: 'bx-cloud',
    color: 'primary',
  },
  {
    title: 'Félicitations ! 🎉',
    message: 'Vous avez obtenu 8 badges cette semaine',
    time: 'il y a 5h',
    icon: 'bx-trophy',
    color: 'success',
  },
  {
    title: 'Rappel d\'évaluation',
    message: 'Quiz JavaScript - à rendre avant demain',
    time: 'il y a 1j',
    icon: 'bx-list-check',
    color: 'warning',
  },
  {
    title: 'Score amélioré',
    message: 'Votre score en Compréhension a augmenté de 5%',
    time: 'il y a 2j',
    icon: 'bx-trending-up',
    color: 'info',
  },
]
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
          class="d-flex align-center cursor-pointer ms-lg-n3"
          style="user-select: none;"
        >
          <!-- 👉 Search Trigger button -->
          <IconBtn>
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
                style="background: transparent; border: none; outline: none; color: #000; font-size: inherit; font-family: inherit; padding: 0;"
                class="search-input"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
              >

              <span
                v-show="!searchValue.length"
                class="shortcut-badge"
              >
                <span class="kbd">Ctrl+K</span>
                <span class="kbd">⌘K</span>
              </span>
            </div>
          </span>
        </div>

        <VSpacer />

        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />

          <!-- Notifications Menu -->
          <VMenu
            activator="parent"
            width="380"
            location="bottom end"
            offset="14px"
          >
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

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink
        to="/"
        class="app-logo app-title-wrapper"
      >
        <img
          :src="logoAuxo"
          alt="AUXO Logo"
          class="app-logo-img"
          height="32"
        >
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

.search-input-wrapper .search-input {
  padding-right: 2.5rem;
}

.shortcut-badge {
  position: absolute;
  right: -.75rem;
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
</style>
