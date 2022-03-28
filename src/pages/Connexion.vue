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
