export const routes = [
  {
    path: '/etudiant',
    redirect: '/student/dashboard',
  },
  {
    path: '/tables',
    redirect: '/student/tables',
  },
  {
    path: '/icons',
    redirect: '/student/icons',
  },
  {
    path: '/quiz-aleatoire',
    redirect: '/student/random-quiz',
  },
  {
    path: '/mes-modules',
    redirect: '/student/my-modules',
  },
  {
    path: '/historique',
    redirect: '/student/history',
  },
  {
    path: '/cards',
    redirect: '/student/cards',
  },
  {
    path: '/centre-aide',
    redirect: '/student/help-center',
  },
  {
    path: '/account-settings',
    redirect: '/student/account-settings',
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/landing.vue'),
      },
    ],
  },
  {
    path: '/student',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/etudiant.vue'),
        meta: { requiresAuth: true, allowedRoles: ['STUDENT', 'etudiant', 'Etudiant', 'ETUDIANT', 'ROLE_ETUDIANT', 'CANDIDAT_VAE', 'ROLE_CANDIDAT_VAE'] },
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'random-quiz',
        component: () => import('@/pages/quiz-aleatoire.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'my-modules',
        component: () => import('@/pages/mes-modules.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'history',
        component: () => import('@/pages/historique.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'help-center',
        component: () => import('@/pages/centre-aide.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/authentication.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/auth/register.vue'),
      },
      {
        path: 'auth/otp',
        component: () => import('@/pages/auth/otp.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
