<!--
  Auteur: Sévan Bendit
  Date: 22.06.2022
  Description: Page pour se connecter
 -->

<template>
  <q-page padding class="full-width column content-center">
    <img
      class="logo"
      alt="Logo DIVTEC"
      src="~assets/logo-divtec.svg"
    >
    <form-connexion class="q-my-lg" />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import FormConnexion from 'components/FormConnexion'

export default defineComponent({
  name: 'PageConnexion',
  components: { FormConnexion }
})
</script>

<style lang="scss" scoped>
.logo {
  max-width: 360px;
}
</style>
