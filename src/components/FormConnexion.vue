<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md"
  >
    <q-input
      outlined
      type="email"
      v-model="form.email"
      label="E-mail"
      hint="prenom.nom@divtec.ch"
      lazy-rules
      :rules="[val => validateEmail(val) || 'Email invalide']"
    >
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
    </q-input>

    <q-input
      outlined
      type="password"
      v-model="form.password"
      label="Mot de passe"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Champ obligatoire !']"
    >
      <template v-slot:prepend>
        <q-icon name="key" />
      </template>
    </q-input>

    <div>
      <q-btn push size="lg" label="Connexion" type="submit" color="primary"/>
    </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'FormConnexion',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    onSubmit () {
      this.login(this.form)
    },
    validateEmail (email) {
      // Source : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
}
</script>

<style scoped>

</style>
