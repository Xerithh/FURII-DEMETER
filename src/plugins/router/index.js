import { useAuthStore } from '@/stores/auth'
import { useQuizStore } from '@/stores/quizStore'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const quizStore = useQuizStore()

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

  const rawRole = authStore.user?.role || ''
  const userRole = String(rawRole).toUpperCase().replace('ROLE_', '')

  if (to.path === '/account-settings') {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    return next(userRole === 'ADMIN' ? '/admin/account-settings' : '/student/account-settings')
  }

  if (to.meta.allowedRoles && Array.isArray(to.meta.allowedRoles)) {
    const roles = to.meta.allowedRoles.map(role => String(role).toUpperCase().replace('ROLE_', ''))
    
    console.log(`[Router Guard] Roles autorises (normalises): ${roles}`)
    console.log(`[Router Guard] Role normalise: ${userRole}`)

    if (!userRole || !roles.includes(userRole)) {
      console.log('[Router Guard] Redirection manuelle: echec correspondance role')
      return next('/login') 
    }
  }

  const lockedByStore = quizStore.sessionActive
  const lockedByStorage = localStorage.getItem('quiz-session-active') === '1'
  const isQuizLocked = lockedByStore || lockedByStorage
  const isQuizSessionRoute = to.path.startsWith('/student/quiz/session')
  const isQuizResultsRoute = to.path.startsWith('/student/quiz/results')

  if (isQuizLocked && !isQuizSessionRoute && !isQuizResultsRoute) {
    console.log('[Router Guard] Session quiz active: navigation bloquee hors evaluation')
    return next('/student/quiz/session')
  }

  // Sécurisation des accès et redirection (RBAC)
  const isStudentRoute = to.path.startsWith('/student');
  const isAdminRoute = to.path.startsWith('/admin');
  
  if (userRole === 'ADMIN' && isStudentRoute) {
    console.log('[Router Guard] Redirection ADMIN vers son espace');
    const toastStore = (await import('@/stores/toast')).useToastStore();
    toastStore.addToast({ message: "Accès refusé : redirection vers votre espace autorisé.", type: "error" });
    return next('/admin');
  }

  if (userRole !== 'ADMIN' && userRole !== '' && isAdminRoute) {
    console.log('[Router Guard] Redirection ETUDIANT vers son espace');
    const toastStore = (await import('@/stores/toast')).useToastStore();
    toastStore.addToast({ message: "Accès refusé : redirection vers votre espace autorisé.", type: "error" });
    return next('/student/dashboard');
  }

  next()
})

export default function (app) {
  app.use(router)
}
export { router }

