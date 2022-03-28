<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
// TODO Générer les icones du site
export default defineComponent({
  name: 'App',
  methods: {
    ...mapActions('auth', ['setUtilisateur'])
  },
  mounted () {
    // Récupère les données du localStorage
    const LStoken = this.$q.localStorage.getItem('token')

    if (LStoken) {
      this.setUtilisateur(LStoken)
    }
  }
})
</script>
