<template>
  <div class="card" style="width: 18rem;">
    <qrcode-stream @decode="onDecode" @init="onInit" />

  </div>
</template>

<script>
import { QrcodeStream } from 'vue3-qrcode-reader'
export default {
  name: "QRcode",
  components: { QrcodeStream },
  async onDecode (result) {

  },
  async onInit (promise) {

  }
}
</script>

<style scoped>

</style>
