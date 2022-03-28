import VueJwtDecode from 'vue-jwt-decode'

export const ROLES = {
  /* TODO Valider qu'on utlise bien le CN et non les OU */
  /* TODO Valider si besion user générique, applicatif, pour connexion AD */
  SECRETAIRE: ['ADM-SECR'],
  APPRENTI: ['APP-EMT', 'APP-EPT', 'APP-EST', 'APP-MPT'],
  ENSEIGNANT: ['MAI-TOUS'],
  COORDINATEUR: ['ADM-COORD']
}
// TODO Tout mettre dans magasin AUTH ???
/**
 * Créer un utilisateur à partir des données encodées
 * dans une JWT Token
 *
 * Retourne false en cas d'erreur
 *
 * @param token
 * @returns {{roles, nom: *, email: *}}
 */
export function getUtilisateurDataFromJWT (token) {
  // console.log('-*-*- getUtilisateurDataFromJWT -*-*-')
  let JwtDecode
  try {
    JwtDecode = VueJwtDecode.decode(token)
  } catch {
    return false
  }

  return {
    nom: JwtDecode.custom_data.displayname,
    email: JwtDecode.custom_data.userprincipalname,
    roles: JwtDecode.custom_data.memberof.map(cn => cn.split(',')[0].split('=')[1]),
    tokenExpiration: JwtDecode.exp
  }
}

/**
 * Permet de savoir si un utilisateur à un role
 * @param utilisateur utilisateur
 * @param rolesValides tableau des roles valides
 * @returns {boolean}
 */
export function utilisateurARole (utilisateur, rolesValides) {
  if (!utilisateur || !utilisateur.roles.length) {
    return false
  }
  return utilisateur.roles.some(r => rolesValides.indexOf(r) >= 0)
}

/**
 * Test si l'utilisateur fait partie d'un des groupes de roles en paramètres
 * @param utilisateur Objet Utilisateur représentant l'utilisateur
 * @param groupesDeRolesValides Tableau des groupes de roles
 * @returns {boolean}
 */
export function utilisateurEstAutorise (utilisateur, groupesDeRolesValides) {
  // Si pas de protection, l'utilisateur est authorisé
  if (!groupesDeRolesValides) {
    return true
  }
  if (!utilisateur || !utilisateur.roles.length) {
    return false
  }
  for (const rolesValides of groupesDeRolesValides) {
    if (utilisateurARole(utilisateur, rolesValides)) {
      return true
    }
  }
  return false
}
