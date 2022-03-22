<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour scanner un QR code
 -->

<template>
  <div>
    <h2>Scannez l'étudiant</h2>
    <q-btn color="primary" label="Scan" @click="scanEtudiant" />
    <p>ID de l'étudiant: {{ idEtu }}</p>

    <h2>Scannez le matériel</h2>
    <q-btn color="primary" label="Scan" @click="scanMatériel" />
    <p>ID du matériel: {{ idMat }}</p>

  </div>

  <div class="q-pa-md">
    <q-option-group
      :options="options"
      type="radio"
      v-model="group"
      color="primary"
      :model-value="group"
    />
    <!-- Afficher avec une variable quel choix est sélectionné -->
    <label>{{ group }}</label>
  </div>




  <q-btn color="primary" @click="postEmprunt">
    Tester
  </q-btn>
  <p>Réponse: {{ resEmp }}</p>
</template>

<script>
// Importation de l'élément "ref"
import {ref} from 'vue';
// Importation de l'élément "api"
import { api } from 'boot/axios';

export default {
  setup() {
    return {
      group: ref('emprunt'),
      options: [
        { label: 'Emprunt', value: 'emprunt', checkedIcon:"task_alt"},
        { label: 'Retour', value: 'retour', checkedIcon:"task_alt"}
      ]
    }
  },
  // Nom de la page
  name: 'QRcode',
  // Déclaration des données
  data() {
    return {
      res: '',
      retour: false,
      imageSrc: '',
      resEmp: null,
      idEtu: '', // resultat du QR code scanné
      idMat: '', // resultat du QR code scanné
      description: ''
    }
  },
  // Déclaration des méthodes
  methods: {
    // Méthode pour scanner un QR code de l'étudiant
    scanEtudiant() {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idEtu = result.text;

        },
        error => {
          alert('Scan raté: ' + error)
        },
        {
          preferFrontCamera: false, // iOS et Android
          showFlipCameraButton: true, // iOS et Android
          showTorchButton: true, // iOS et Android
          torchOn: false, // Android, au lancement le flash est allumé
          saveHistory: true, // Android, enregistrer l'historique de scan
          prompt: 'Placez le QR code à l\'intérieur de la zone', // Android
          resultDisplayDuration: 1000, // Android, affiche le texte scanné pendant 1s en bas avant d'afficher l'alerte
          //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: 'portrait', // Android uniquement (portrait|landscape), par défaut non réglé pour qu'il tourne avec le téléphone
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS et Android
        }
      )
    },
    // Méthode pour scanner un QR code de l'étudiant
    scanMatériel() {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idMat = result.text;

        },
        error => {
          alert('Scan raté: ' + error)
        },
        {
          preferFrontCamera: false, // iOS et Android
          showFlipCameraButton: true, // iOS et Android
          showTorchButton: true, // iOS et Android
          torchOn: false, // Android, au lancement le flash est allumé
          saveHistory: true, // Android, enregistrer l'historique de scan
          prompt: 'Placez le QR code à l\'intérieur de la zone', // Android
          resultDisplayDuration: 1000, // Android, affiche le texte scanné pendant 1s en bas avant d'afficher l'alerte
          //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: 'portrait', // Android uniquement (portrait|landscape), par défaut non réglé pour qu'il tourne avec le téléphone
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS et Android
        }
      )
    },

    postEmprunt() {
      this.resEmp=null;
      //idUser: "73be4c03"
      //idDevice: "2bf8991d"
      let formData = new FormData();

      formData.append('idUser', this.idEtu)
      formData.append('idDevice', this.idMat)
      if(this.group==="retour")
        formData.append('ret', '')

      api.post("/ELT/rest/borrow.php",
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).then((resEmp) => {
        this.resEmp = resEmp
      }).catch((err) => {
        console.error(err)
      })
    },
    getEtudiantFromAPI() {
      let id = this.title
      api.get("/ELT/rest/idreq.php?id="+id).then(res => {
        // Afficher le résltat de la rquête avec l'ID
        // Afficher uniquement le nom et prénom
        this.res = res.data.split(",")[1]
      })
    }
  }
}
</script>

