import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: 'http://api-int.divtec.local/',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

/**
 * Test si l'expiration du token et plus petite que la limite fixée
 * par rapport à l'heure actuelle.
 *
 * Retourne vrais si token en dessous de la limite
 *
 * @param dateExpiration - Date d'expiration
 * @param limiteEnMinutes - Limite en minutes
 * @returns {boolean}
 */
function tokenLimite (dateExpiration, limiteEnMinutes) {
  // Calculs et tests pour prolonger la durée de vie du token
  const dateActuelle = parseInt(Date.now() / 1000)
  const dateLimite = dateExpiration - 60 * limiteEnMinutes
  return dateActuelle > dateLimite // Rafraichit, prolonge la durée de vie
}

export default boot(({ app, store }) => {
  // Interception des requêtes
  api.interceptors.request.use(function (config) {
    const utilisateur = store.getters['auth/utilisateur'] || null
    // Rafraichit le token si validité inférieure à 30min
    if (
      utilisateur &&
      config.url !== '/refresh' &&
      tokenLimite(utilisateur.tokenExpiration, 30)
    ) {
      store.dispatch('auth/refresh')
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  // Interception des réponses
  api.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    if (
      error.response.status === 401 &&
      error.response.config.url !== '/auth/logout' &&
      error.response.config.url !== '/auth/login'
    ) {
      store.dispatch('auth/logout')
    }
    return Promise.reject(error)
  })

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
