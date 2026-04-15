export const routes = [
  {
    path: '/etudiant',
    redirect: '/student/dashboard',
  },
  {
    path: '/tables',
    redirect: '/student/random-quiz',
  },
  {
    path: '/icons',
    redirect: '/student/random-quiz',
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
    path: '/confidentialite',
    redirect: '/privacy',
  },
  {
    path: '/conditions-utilisation',
    redirect: '/terms',
  },
  {
    path: '/contact-support',
    redirect: '/support',
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
        redirect: '/student/random-quiz',
        meta: { requiresAuth: true },
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tables',
        redirect: '/student/random-quiz',
        meta: { requiresAuth: true },
      },
      {
        path: 'random-quiz',
        component: () => import('@/pages/quiz-aleatoire.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'quiz/session',
        component: () => import('@/pages/quiz/session.vue'),
        meta: { requiresAuth: true, allowedRoles: ['STUDENT', 'etudiant', 'Etudiant', 'ETUDIANT', 'ROLE_ETUDIANT', 'CANDIDAT_VAE', 'ROLE_CANDIDAT_VAE'] },
      },
      {
        path: 'quiz/results',
        component: () => import('@/pages/quiz/results.vue'),
        meta: { requiresAuth: true, allowedRoles: ['STUDENT', 'etudiant', 'Etudiant', 'ETUDIANT', 'ROLE_ETUDIANT', 'CANDIDAT_VAE', 'ROLE_CANDIDAT_VAE'] },
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
        path: 'privacy',
        name: 'privacy',
        component: () => import('@/pages/confidentialite.vue'),
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import('@/pages/conditions-utilisation.vue'),
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('@/pages/contact-support.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
  // ─── ADMIN ROUTES ───────────────────────────────────────────
  {
  path: '/admin',
  component: () => import('@/@admin/layouts/AdminLayout.vue'),
  meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
  children: [
    {
      path: '',
      name: 'admin-dashboard',
      component: () => import('@/@admin/pages/AdminDashboard.vue'),
    },
    {
      path: 'account-settings',
      name: 'admin-account-settings',
      component: () => import('@/pages/account-settings.vue'),
      meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
    },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/@admin/pages/AdminUsers.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'users/:id',
        name: 'admin-user-history',
        component: () => import('@/@admin/pages/AdminUserHistory.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'questions',
        name: 'admin-questions',
        component: () => import('@/@admin/pages/AdminQuestions.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'statistiques',
        name: 'admin-statistiques',
        component: () => import('@/@admin/pages/AdminStatistics.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
    ],
  },
]
