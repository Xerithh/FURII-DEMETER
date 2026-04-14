<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { Check, Info, X, XCircle } from "lucide-vue-next";

const toastStore = useToastStore();

const toneClasses: Record<string, string> = {
  success: "text-emerald-700 border-emerald-200",
  error: "text-rose-700 border-rose-200",
  info: "text-sky-700 border-sky-200",
};

const progressClasses: Record<string, string> = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  info: "bg-sky-500",
};

const iconFor = (type: string) => {
  if (type === "success") return Check;
  if (type === "error") return XCircle;
  return Info;
};
</script>

<template>
  <div
    class="pointer-events-none fixed left-4 top-4 z-[3000] w-[22rem] max-w-[calc(100vw-2rem)]"
  >
    <TransitionGroup name="toast-list" tag="div" class="flex flex-col gap-3">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast-item flex items-center pointer-events-auto relative overflow-hidden rounded-md border bg-white px-4 py-2 shadow-sm"
        :class="toneClasses[toast.type]"
        :style="{ '--toast-duration': `${toast.duration}ms` }"
      >
        <button
          type="button"
          @click="toastStore.removeToast(toast.id)"
          class="absolute top-1 right-1 z-10 rounded-sm p-1 hover:text-slate-700"
          aria-label="Fermer"
          style="color: #64748b"
        >
          <X class="h-4 w-4" />
        </button>

        <div class="flex items-center gap-3">
          <component :is="iconFor(toast.type)" class="h-5 w-5 shrink-0" />
          <p
            class="text-sm font-medium text-slate-700 flex-1 break-words m-0 leading-tight"
          >
            {{ toast.message }}
          </p>
        </div>

        <div class="absolute bottom-0 left-0 h-0.5 w-full bg-slate-100">
          <div
            class="toast-progress h-full origin-left"
            :class="progressClasses[toast.type]"
            :style="{ '--toast-duration': `${toast.duration}ms` }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-list-enter-active {
  transition: all 360ms cubic-bezier(0.2, 0.85, 0.28, 1.2);
}

.toast-list-leave-active {
  transition: all 220ms ease;
  position: absolute;
}

.toast-list-move {
  transition: transform 260ms ease;
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.toast-item {
  animation: toast-pop var(--toast-duration) linear forwards;
}

.toast-progress {
  animation: toast-progress var(--toast-duration) linear forwards;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@keyframes toast-pop {
  0%,
  92% {
    transform: scale(1);
  }
  96% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
