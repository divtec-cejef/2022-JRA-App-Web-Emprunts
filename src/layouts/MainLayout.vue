<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white text-black flex flex-center column">
        <img class="q-mx-md" style="width: 200px" :src="require('src/assets/logo-divtec.svg')" alt="Logo de la DIVTEC">
        <div class="flex flex-center">
          <span class="q-mx-md" style="max-width: 100px" v-if="utilisateur">
            {{ this.utilisateur.nom }}
          </span>
          <q-btn flat color="primary" v-if="utilisateur" @click="logout" icon="logout"/>
          <q-btn flat v-else icon="login" to="connexion"/>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { utilisateurEstAutorise } from 'src/functions/auth'
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',
  computed: {
    ...mapGetters('auth', ['utilisateur']),
    liensUtilisateur () {
      return this.liens.filter(lien => utilisateurEstAutorise(this.utilisateur, lien.roles))
    }
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
})
</script>
