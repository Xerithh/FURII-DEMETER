import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

interface ToastState {
  toasts: ToastItem[]
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: [],
  }),

  actions: {
    addToast(payload: { message: string; type?: ToastType; duration?: number }) {
      const duration = payload.duration ?? 5000
      const toast: ToastItem = {
        id: Date.now() + Math.floor(Math.random() * 100000),
        message: payload.message,
        type: payload.type ?? 'info',
        duration,
      }

      this.toasts.push(toast)

      window.setTimeout(() => {
        this.removeToast(toast.id)
      }, duration)

      return toast.id
    },

    removeToast(id: number) {
      this.toasts = this.toasts.filter(toast => toast.id !== id)
    },
  },
})
