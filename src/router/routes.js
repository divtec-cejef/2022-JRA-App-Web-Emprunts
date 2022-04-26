import { ROLES } from 'src/functions/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { // accueil
        path: '',
        component: () => import('pages/Connexion.vue')
      },
      { // Tout le monde du moment qu'il est connecté avec son login DIVTEC
        path: '/gestion',
        component: () => import('pages/Gestion.vue'),
        meta: { roles: [ROLES.ENSEIGNANT, ROLES.APPRENTI, ROLES.SECRETAIRE, ROLES.COORDINATEUR] }
      }
    ]
  },
  {
    path: '/connexion',
    component: () => import('layouts/SimplePageLayout'),
    children: [
      { path: '', component: () => import('pages/Connexion') }
    ]
  },
  {
    path: '/403',
    component: () => import('pages/Error403.vue')
  },
  { // Pour toute les requêtes non-valides => 403
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
