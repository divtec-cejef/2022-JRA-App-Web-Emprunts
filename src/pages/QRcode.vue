<template>
  <div>
    <h2>Scanner le QR code</h2>
    <q-btn color="primary" label="Scan" @click="scanImage" />
    <h2>{{ title }}</h2>
    <label for="checkbox">Est-ce un retour ? (Si oui, cochez) </label>
    <input type="checkbox" id="checkbox" v-model="checked">
    <!-- Afficher avec une variable si la case est cochée (true) ou pas (false) -->
    <label for="checkbox">{{ retourouemprunt() }}</label>

  </div>
</template>

<script>
export default {
  data() {
    return {
      test: "",
      checked: false,
      retouroupas: "emprunt",
      imageSrc: '',
      title: '', //resultat du QR code scanné
      description: ''
    }
  },
  methods: {
    retourouemprunt(){
      if(this.checked===true){
        return this.retouroupas="retour";
      }else{
        return this.retouroupas="emprunt";
      }
    },
    scanImage() {
      cordova.plugins.barcodeScanner.scan(
        result => {
          alert(
            'Result: ' +
            result.text +
            '\n' +
            'Format: ' +
            result.format +
            '\n' +
            'Cancelled: ' +
            result.cancelled +
            '\n' +
            'retour ou emprunt: ' +
            this.retour
          )
        },
        error => {
          alert('Scanning failed: ' + error)
        },
        {
          preferFrontCamera: false, // iOS and Android
          showFlipCameraButton: true, // iOS and Android
          showTorchButton: true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt: 'Placez le QR code à l\'intérieur de la zone', // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS and Android
        }
      )
    }
  }
}
</script>

