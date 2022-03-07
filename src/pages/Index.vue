<template>
  <h1>Scan QR code</h1>
  <button>Scanner</button>
  <div class="card" style="width: 18rem;">
    <qrcode-stream @decode="onDecode" @init="onInit" />
    <div class="card-body">
      <p class="card-text">Please scan the qrcode event registration that we have sent via your email.</p>
      <hr>
      <div class="alert" role="alert">

      </div>
    </div>
  </div>

  <h1>Scan RFID</h1>

</template>

<script>
import { QrcodeStream } from 'vue3-qrcode-reader'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { QrcodeStream },
  async onDecode (result) {

  },
  async onInit (promise) {

  }
})
</script>
