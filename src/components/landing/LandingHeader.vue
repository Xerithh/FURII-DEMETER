<script setup lang="ts">
defineProps<{
  isPastHero: boolean;
}>();
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-transparent">
    <nav
      class="mx-auto flex w-full justify-center px-4 py-4"
      aria-label="Navigation principale"
    >
      <div
        class="nav-bar-box flex w-full max-w-3xl items-center justify-between rounded-xl border bg-white/10 px-4 py-1"
      >
        <div class="nav-left flex items-center gap-3">
          <a
            href="/"
            class="flex items-center gap-3 text-sm font-semibold"
            :class="isPastHero ? 'text-slate-900' : 'text-white'"
          >
            <span
              class="icon-box inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--isis-blue)] text-white"
              >I</span
            >
          </a>
        </div>

        <div class="nav-right flex items-center gap-6">
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
              href="#apercu-dashboard"
              :class="
                isPastHero
                  ? 'text-slate-900 transition hover:text-[var(--isis-blue)]'
                  : 'text-white transition hover:text-[var(--isis-blue-light)]'
              "
              >Dashboard</a
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

          <a
            href="/login"
            class="btn-small inline-flex items-center rounded-xl border bg-transparent px-4 py-1 text-sm transition-colors"
            :class="
              isPastHero
                ? 'border-slate-300 text-slate-900 hover:bg-slate-100/80'
                : 'border-white/80 text-white hover:bg-white/5 force-white-border'
            "
          >
            Connexion
          </a>
        </div>
      </div>
    </nav>
  </header>
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

@media (min-width: 768px) {
  .nav-bar-box {
    gap: 18px;
    padding: 8px 16px;
  }
}
</style>
