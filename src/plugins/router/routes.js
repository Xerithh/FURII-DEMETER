export const routes = [
  { path: '/', redirect: '/etudiant/dashboard' },
  {
    path: '/etudiant',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'etudiant-dashboard',
        component: () => import('@/views/etudiant/DashboardEtudiant.vue'),
      },
      {
        path: 'account-settings',
        name: 'etudiant-account-settings',
        component: () => import('@/views/etudiant/ProfileEtudiant.vue'),
      },
      {
        path: 'modules-suggeres',
        name: 'etudiant-modules-suggeres',
        component: () => import('@/views/etudiant/ModulesSuggeresEtudiant.vue'),
      },
      {
        path: 'parcours-personnalises',
        name: 'etudiant-parcours-personnalises',
        component: () => import('@/views/etudiant/ParcoursPersonnalisesEtudiant.vue'),
      },
      {
        path: 'ressources-complementaires',
        name: 'etudiant-ressources-complementaires',
        component: () => import('@/views/etudiant/RessourcesComplementairesEtudiant.vue'),
      },
      {
        path: 'mes-modules',
        name: 'etudiant-mes-modules',
        component: () => import('@/views/etudiant/MesModulesEtudiant.vue'),
      },
      {
        path: 'mon-parcours',
        name: 'etudiant-mon-parcours',
        component: () => import('@/views/etudiant/MonParcoursEtudiant.vue'),
      },
      {
        path: 'mes-evaluations',
        name: 'etudiant-mes-evaluations',
        component: () => import('@/views/etudiant/MesEvaluationsEtudiant.vue'),
      },
      {
        path: 'historique',
        name: 'etudiant-historique',
        component: () => import('@/views/etudiant/HistoriqueEtudiant.vue'),
      },
      // Keep dev pages here temporarily to avoid breaking existing links if needed,
      // or we can put them in a generic path
    ],
  },
  {
    path: '/dev',
    component: () => import('@/layouts/default.vue'),
    children: [
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
    ]
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
