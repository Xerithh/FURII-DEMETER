<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import logoAuxo from "@/assets/images/logo-auxo.png";
import { useAuthStore } from "@/stores/auth";

defineProps<{
  isPastHero: boolean;
}>();

const isMobileMenuOpen = ref(false);
const authStore = useAuthStore();

const syncBodyScrollLock = (isLocked: boolean) => {
  document.body.style.overflow = isLocked ? "hidden" : "";
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleWindowResize = () => {
  if (window.innerWidth >= 640) {
    closeMobileMenu();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
};

watch(isMobileMenuOpen, (isOpen) => {
  syncBodyScrollLock(isOpen);
});

onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
  window.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  syncBodyScrollLock(false);
  window.removeEventListener("resize", handleWindowResize);
  window.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-transparent">
    <nav
      class="mx-auto flex w-full justify-center px-4 py-4"
      aria-label="Navigation principale"
    >
      <div
        class="nav-bar-box relative flex w-full max-w-3xl items-center justify-between rounded-xl border bg-white/10 px-4 py-1"
      >
        <div class="nav-left flex items-center gap-3">
          <a
            href="/"
            class="flex items-center gap-3 text-sm font-semibold"
            :class="isPastHero ? 'text-slate-900' : 'text-white'"
          >
            <img
              :src="logoAuxo"
              alt="logo-auxo"
              class="h-6 w-6 object-contain"
            />
          </a>
        </div>

        <div class="nav-right flex items-center gap-3 sm:gap-6">
          <div
            class="nav-center hidden items-center gap-6 text-sm sm:flex"
            :class="isPastHero ? 'text-slate-900' : 'text-white'"
          >
            <a
              href="#processus"
              :class="
                isPastHero
                  ? 'text-slate-900 transition hover:text-[var(--isis-blue)]'
                  : 'text-white transition hover:text-[var(--isis-blue-light)]'
              "
              >Processus</a
            >
            <a
              href="#apercu-etudiant"
              :class="
                isPastHero
                  ? 'text-slate-900 transition hover:text-[var(--isis-blue)]'
                  : 'text-white transition hover:text-[var(--isis-blue-light)]'
              "
              >Etudiant</a
            >
            <a
              href="#recommandations"
              :class="
                isPastHero
                  ? 'text-slate-900 transition hover:text-[var(--isis-blue)]'
                  : 'text-white transition hover:text-[var(--isis-blue-light)]'
              "
              >Recommandations</a
            >
          </div>

          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="hidden items-center rounded-xl bg-[var(--isis-blue)] px-4 py-1 text-sm font-semibold text-white shadow-sm sm:inline-flex"
          >
            Connexion
          </RouterLink>

          <RouterLink
            v-else
            to="/student/dashboard"
            class="hidden items-center rounded-xl bg-[var(--isis-blue)] px-4 py-1 text-sm font-semibold text-white shadow-sm sm:inline-flex"
          >
            Dashboard
          </RouterLink>

          <button
            type="button"
            class="mobile-menu-btn inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors sm:hidden"
            :class="
              isPastHero
                ? 'border-slate-300 text-slate-900 hover:bg-slate-100/80'
                : 'border-white/80 text-white hover:bg-white/10'
            "
            :aria-expanded="isMobileMenuOpen"
            aria-controls="landing-mobile-menu"
            aria-label="Ouvrir le menu"
            @click="toggleMobileMenu"
          >
            <span v-if="!isMobileMenuOpen" class="text-xl leading-none"
              >☰</span
            >
            <span v-else class="text-xl leading-none">✕</span>
          </button>
        </div>
      </div>
    </nav>
  </header>

  <div
    id="landing-mobile-menu"
    class="mobile-panel fixed inset-0 z-[70] sm:hidden"
    :class="[
      isMobileMenuOpen
        ? 'pointer-events-auto opacity-100'
        : 'pointer-events-none opacity-0',
    ]"
  >
    <div
      class="mobile-panel-surface flex h-screen flex-col bg-white px-0 pb-6 pt-5 text-slate-900"
    >
      <div class="flex items-center justify-between px-6">
        <span class="text-sm uppercase tracking-[0.2em] text-slate-500"
          >Menu</span
        >
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-xl leading-none text-slate-900 transition hover:bg-slate-50"
          aria-label="Fermer le menu"
          @click="closeMobileMenu"
        >
          ✕
        </button>
      </div>

      <div
        class="mobile-menu-links mt-10 flex flex-1 flex-col justify-center gap-6 px-6"
      >
        <a
          href="#processus"
          class="px-2 py-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 transition hover:bg-slate-50 rounded-md"
          @click="closeMobileMenu"
          >Processus</a
        >
        <a
          href="#apercu-etudiant"
          class="px-2 py-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 transition hover:bg-slate-50 rounded-md"
          @click="closeMobileMenu"
          >Etudiant</a
        >
        <a
          href="#recommandations"
          class="px-2 py-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 transition hover:bg-slate-50 rounded-md"
          @click="closeMobileMenu"
          >Recommandations</a
        >
        <a
          href="#faq"
          class="px-2 py-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 transition hover:bg-slate-50 rounded-md"
          @click="closeMobileMenu"
          >FAQ</a
        >
      </div>

      <div class="mobile-login-cta mt-auto pt-5 px-6">
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[var(--isis-blue)] px-6 text-lg font-semibold text-white transition hover:bg-[#1e40af]"
          @click="closeMobileMenu"
        >
          Se connecter
        </RouterLink>

        <RouterLink
          v-else
          to="/student/dashboard"
          class="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[var(--isis-blue)] px-6 text-lg font-semibold text-white transition hover:bg-[#1e40af]"
          @click="closeMobileMenu"
        >
          Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-bar-box {
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
}

.icon-box {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.btn-small {
  height: 36px;
  font-size: 0.95rem;
  padding-left: 12px;
  padding-right: 12px;
}

.force-white-border {
  border: 1px solid rgba(255, 255, 255, 0.95) !important;
}

.mobile-panel {
  transition: opacity 200ms ease;
}

.mobile-panel-surface {
  min-height: 100dvh;
}

@media (max-width: 420px) {
  .mobile-menu-links a {
    font-size: 1.65rem;
  }
}

@media (min-width: 768px) {
  .nav-bar-box {
    gap: 18px;
    padding: 8px 16px;
  }
}
</style>
