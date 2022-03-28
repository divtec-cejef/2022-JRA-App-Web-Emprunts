import { ROLES } from 'src/functions/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { // accueil
        path: '',
        component: () => import('pages/Index.vue')
      },
      { // secretaire
        path: '/secretaire',
        component: () => import('pages/Secretaires.vue'),
        meta: { roles: [ROLES.SECRETAIRE] }
      },
      { // enseignants
        path: '/enseignants',
        component: () => import('pages/Enseignants.vue'),
        meta: { roles: [ROLES.ENSEIGNANT] }
      },
      { // apprentis
        path: '/apprenti',
        component: () => import('pages/Apprentis.vue'),
        meta: { roles: [ROLES.APPRENTI] }
      },
      { // enseignants et apprentis
        path: '/ens-app',
        component: () => import('pages/EnseignantsApprentis.vue'),
        meta: { roles: [ROLES.ENSEIGNANT, ROLES.APPRENTI] }
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
