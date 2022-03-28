<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary">
        <q-toolbar-title>
          DIVTEC APP
        </q-toolbar-title>

        <div>
          <span class="q-pa-md" v-if="utilisateur">
            {{this.utilisateur.nom}}
          </span>
          <q-btn flat v-if="utilisateur" @click="logout">
            Déconnexion
          </q-btn>
          <q-btn flat v-else to="connexion">
            Connexion
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ROLES, utilisateurEstAutorise } from 'src/functions/auth'
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      liens: [
        // TODO définir authorisation trouver un point central pour définir les auth de navigation
        {
          titre: 'Accueil',
          icone: 'home',
          lien: '/',
          roles: null
        },
        {
          titre: 'Secretaires',
          icone: 'manage_accounts',
          lien: '/secretaire',
          roles: [ROLES.SECRETAIRE]
        },
        {
          titre: 'Enseignants',
          icone: 'manage_accounts',
          lien: '/enseignants',
          roles: [ROLES.ENSEIGNANT]
        },
        {
          titre: 'Apprentis',
          icone: 'manage_accounts',
          lien: '/apprenti',
          roles: [ROLES.APPRENTI]
        },
        {
          titre: 'Enseignants et apprentis',
          icone: 'manage_accounts',
          lien: '/ens-app',
          roles: [ROLES.ENSEIGNANT, ROLES.APPRENTI]
        },
        {
          titre: 'Emprunt et retour',
          icone: 'manage_accounts',
          lien: '/gestion',
          roles: [ROLES.ENSEIGNANT, ROLES.APPRENTI, ROLES.COORDINATEUR, ROLES.SECRETAIRE]
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['utilisateur']),
    liensUtilisateur () {
      return this.liens.filter(lien => utilisateurEstAutorise(this.utilisateur, lien.roles))
    }
  },
  methods: {
    ...mapActions('auth', ['logout'])
  },
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
