<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour scanner un QR code
 -->

<template>
  <div>
    <h2>Scanner le QR code</h2>
    <q-btn color="primary" label="Scan" @click="scanImage" />
    <br>
    <!-- Check Box pour déterminer s'il s'agit d'un retour ou une emprunt -->
    <q-checkbox label="Est-ce un retour ? (Si oui, cochez)" :left-label="true" color="primary" id="checkbox" v-model="retour"  :model-value="retour"/>
    <!-- Afficher avec une variable si la case est cochée (true) ou pas (false) -->
    <label>{{ retour ? "retour" : "emprunt" }}</label>
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
</template>

<script>
// Importation de l'élément "ref"
import {ref} from "vue";
// Importation de l'élément "api"
import { api } from 'boot/axios'

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
      retour: false,
      imageSrc: '',
      title: '', // resultat du QR code scanné
      description: ''
    }
  },
  // Déclaration des méthodes
  methods: {
    // Méthode pour scanner un QR code
    scanImage() {
      cordova.plugins.barcodeScanner.scan(
        result => {
          alert(
            'Résultat: ' +
            result.text +
            '\n' +
            'Format: ' +
            result.format +
            '\n' +
            'Scan annulé: ' +
            result.cancelled +
            '\n' +
            'Etat: ' +
            (this.retour ? "retour" : "emprunt")
            +
            '\n' +
            'Etat: ' +
            (this.group)
          )
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
    }
  }
}
</script>

