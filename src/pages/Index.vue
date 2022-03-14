<template>
  <h1>Scan QR code</h1>

  <q-btn to="/QRcode">
    Scanner
  </q-btn>

  <h1>Scan NFC</h1>
  <q-btn to="/NFC">
    Scanner
  </q-btn>
  <h1>Scan test</h1>
  <q-btn to="/page-test">
    Scanner
  </q-btn>

</template>

<script>

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex'

})
</script>
