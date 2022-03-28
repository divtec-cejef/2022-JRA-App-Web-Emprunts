// import { afficherMessageErreur } from 'src/functions/message-erreur'
import { utilisateurEstAutorise } from 'src/functions/auth'

// Récupère l'objet router représentant Vue router
export default ({ router, store }) => {
  // Avant de rediriger le visiteur
  router.beforeEach((to, from, next) => {
    // Récupère les roles autorisés pour cette page
    const { roles } = to.meta
    // Récupère l'utilisateur connecté
    const utilisateur = store.getters['auth/utilisateur']

    // Si la route est protégée
    if (roles) {
      // Si utilisateur pas connecté => login
      if (!utilisateur) {
        return next({ path: '/connexion', query: { returnUrl: to.path } })
      }

      // Si l'utilisateur n'as pas les droits
      if (!utilisateurEstAutorise(utilisateur, roles)) {
        // role not authorised so redirect to home page
        return next({ path: '/403' })
      }
    }

    next() // Continue la navigation normalement
  })
}
