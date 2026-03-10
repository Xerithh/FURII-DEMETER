export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
      {
        path: 'modules-suggeres',
        component: () => import('@/pages/modules-suggeres.vue'),
      },
      {
        path: 'parcours-personnalises',
        component: () => import('@/pages/parcours-personnalises.vue'),
      },
      {
        path: 'ressources-complementaires',
        component: () => import('@/pages/ressources-complementaires.vue'),
      },
      {
        path: 'mes-modules',
        component: () => import('@/pages/mes-modules.vue'),
      },
      {
        path: 'mon-parcours',
        component: () => import('@/pages/mon-parcours.vue'),
      },
      {
        path: 'mes-evaluations',
        component: () => import('@/pages/mes-evaluations.vue'),
      },
      {
        path: 'historique',
        component: () => import('@/pages/historique.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
