<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page d'accueil de l'application
 -->

<template>
  <h4>Se connecter</h4>
  <q-btn color="primary" to="/authentification">
    Authentifier
  </q-btn>
  <h1>Scan QR code</h1>

  <q-btn color="primary" to="/QRcode">
    Scanner
  </q-btn>

  <h1>Scan NFC</h1>
  <q-btn color="primary" to="/NFC">
    Scanner
  </q-btn>
  <h1>Scan NFC et QRcode</h1>
  <q-btn color="primary" to="/NFC-QRcode">
    Scanner
  </q-btn>
  <h1>Page test</h1>
  <q-btn color="primary" to="/page-test">
    Tester
  </q-btn>

</template>

<script>

import { defineComponent } from 'vue';

export default defineComponent({
  // Nom de la page
  name: 'PageIndex'

})
</script>
