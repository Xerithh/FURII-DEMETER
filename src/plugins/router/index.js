import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  console.log(`[Router Guard] Navigation vers: ${to.path}`)
  console.log(`[Router Guard] Etat connexion store: ${authStore.isAuthenticated}`)
  console.log(`[Router Guard] Role utilisateur detecte: ${authStore.user?.role || 'Aucun'}`)

  // Réhydratation si le store est vide mais qu'un token est présent
  if (!authStore.user && localStorage.getItem('accessToken')) {
    console.log('[Router Guard] Token trouve en local, tentative de rehydratation...')
    const success = await authStore.fetchCurrentUser()
    if (!success) {
      console.log('[Router Guard] Echec de la rehydratation, redirection vers /login')
      return next('/login')
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router Guard] Redirection manuelle: route protegee et utilisateur non authentifie')
    return next('/login')
  }

  if (to.meta.allowedRoles && Array.isArray(to.meta.allowedRoles)) {
    const roles = to.meta.allowedRoles.map(role => String(role).toUpperCase().replace('ROLE_', ''))
    const rawRole = authStore.user?.role || ''
    const userRole = String(rawRole).toUpperCase().replace('ROLE_', '')
    
    console.log(`[Router Guard] Roles autorises (normalises): ${roles}`)
    console.log(`[Router Guard] Role normalise: ${userRole}`)

    if (!userRole || !roles.includes(userRole)) {
      console.log('[Router Guard] Redirection manuelle: echec correspondance role')
      return next('/login') 
    }
  }

  next()
})

export default function (app) {
  app.use(router)
}
export { router }

