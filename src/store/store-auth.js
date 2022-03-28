import { api } from 'boot/axios'
import { afficherMessageErreur } from 'src/functions/message-erreur'
import { Loading, LocalStorage } from 'quasar'
import { ROLES, utilisateurARole, getUtilisateurDataFromJWT } from 'src/functions/auth'

// State : données du magasin
const state = {
  token: null,
  utilisateur: null
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_USER (state, utilisateur) {
    state.utilisateur = utilisateur
  }
}

/*
Actions : méthodes du magasin qui font appel aux mutations
Elles peuvent être asynchrones !
 */
const actions = {
  setUtilisateur ({ commit, dispatch }, token) {
    const utilisateur = getUtilisateurDataFromJWT(token)

    if (!utilisateur) {
      dispatch('logout')
    } else {
      // Ajoute le token et le utilisateur dans le magasin et dans localStorage
      commit('SET_TOKEN', token)
      commit('SET_USER', utilisateur)
      LocalStorage.set('token', token)
      LocalStorage.set('utilisateur', utilisateur)
    }
  },
  clearUtilisateur ({ commit }) {
    commit('SET_TOKEN', null)
    commit('SET_USER', null)
    LocalStorage.clear()
  },
  login ({ commit, dispatch }, payload) {
    Loading.show()
    const that = this
    api.post('/auth/login', payload)
      .then(function (response) {
        dispatch('setUtilisateur', response.data.token)
        // Redirige l'utilisateur vers la page d'accueil
        that.$router.push(that.$router.currentRoute.value.query.returnUrl || '/')
        // Cache la fenêtre de chargement
        Loading.hide()
      })
      .catch(function (error) {
        dispatch('clearUtilisateur')
        Loading.hide()
        afficherMessageErreur('Connexion impossible !')
        throw error
      })
  },
  refresh ({ dispatch, state }) {
    const config = {
      headers: { Authorization: 'Bearer ' + state.token }
    }
    api.post('/auth/refresh', null, config)
      .then(function (response) {
        dispatch('setUtilisateur', response.data.token)
      })
      .catch(function () {
        dispatch('logout')
      })
  },
  logout ({ state, dispatch }) {
    // Construction du token
    const config = {
      headers: { Authorization: 'Bearer ' + state.token }
    }
    // API déconnexion
    api.post('/auth/logout', null, config)
    // Efface les donneés utilisteur
    dispatch('clearUtilisateur')
    // Redirection vers le formulaire de connexion
    this.$router.push({
      path: '/connexion', // TODO voir si redirection vers home page
      query: { returnUrl: this.$router.currentRoute.value.fullPath }
    })
  }
}
/*
Getters : retourne les données du magasin
Fonctionne comme les propriétés calculées
Sert à calculer, trier, filtrer ou formater les donneés
 */
const getters = {
  utilisateur: state => state.utilisateur,
  estSecretaire: state => utilisateurARole(state.utilisateur, ROLES.SECRETAIRE),
  estEnseignant: state => utilisateurARole(state.utilisateur, ROLES.ENSEIGNANT),
  estCoordinateur: state => utilisateurARole(state.utilisateur, ROLES.COORDINATEUR),
  estApprenti: state => utilisateurARole(state.utilisateur, ROLES.APPRENTI)
  // tokenValide: state => !!getUtilisateurDataFromJWT(state.token)
}

/*
Exporte les constantes, variables du fichier
On pourra ainsi les récupérer, les importer dans un autre fichier JS.

namespace: true, ajoute un namespace à notre objet retourné.
 */
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
