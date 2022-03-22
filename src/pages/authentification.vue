<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour authentifier l'étudiant
 -->

<template>
  <div text-center>
      <span v-if="compatible">
        <h2>Scannez</h2>
        <br>
      </span>

    <!-- Afficher si la fonction NFC du téléphone n'est pas activée -->
    <span v-if="nfc_disabled">
        <h2>Activez le paramètre NFC</h2>
      <!-- Affiche un bouton pour activer la fonction NFC du téléphone -->
      <q-btn color="primary" v-on:click="showSettings">Activer</q-btn>
      </span>
  </div>
  <br>
  <q-btn color="primary" label="Scan" @click="scanImage" />
  <p>Résulat du QRcode: {{ idEtu }}</p>
  <q-btn color="primary" label="Se connecter" @click="getEtudiantFromAPI" />
  <p>Nom de l'étudiant: {{ nomEtu }}</p>
  <span v-if="nomEtu">
    <p>OK</p>
    {{changerPage()}}
  </span>
</template>

<script>

import {api} from "boot/axios";

export default {
  // Nom de la page
  name: 'authentification',
  // Déclaration des données
  data(){
    return {
      compatible: true,
      nfc_disabled: false,
      dialog: false,
      tagId: '',
      nomEtu: '',
      idEtu: '', // resultat du QR code scanné
      items: JSON.parse((localStorage.getItem("scanHistorique")||"[]")),
    }
  },
  /*
  watch:{
    items: function (v) {
      // Surveillez le push sur les données des éléments. Si un nouvel élément est poussé, il est enregistré dans le " localStorage ".
      localStorage.setItem("scanHistorique", JSON.stringify(this.items));
    }
  },
   */

  mounted(){
    // Lorsque la vue est montée, enregistre l'événement du scan
    this.registerTagEvent();
  },
  beforeDestroy(){
    // Lorsque la vue est détruite (départ de l'utilisateur),
    // annule l'enregistrement de l'événement de balise de numérisation pour éviter de numériser la balise dans une autre vue
    this.unregisterTagEvent();
  },


  // Déclaration des méthodes
  methods: {
    changerPage(){
      this.$router.push('/')
    },
    // Méthode pour scanner un QR code
    scanImage() {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idEtu = result.text;
          alert(
            'Résultat: ' +
            result.text +
            '\n' +
            'Format: ' +
            result.format +
            '\n' +
            'Scan annulé: ' +
            result.cancelled
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
    },
    registerTagEvent(){
      // Annulation de l'écoute de l'événement "resume" précédent.
      document.removeEventListener("resume", this.registerTagEvent, false);

      if (typeof(nfc) !== "undefined"){
        // NFC est disponible, en attente de scan
        nfc.addTagDiscoveredListener(this.displayTagId, this.success, this.error);
      }else{
        // Le plugin n'est pas présent ou n'a pas pu être initialisé.
        this.error();
      }
    },
    unregisterTagEvent(){
      // Tester si le plugin NFC est défini
      if (typeof(nfc) !== "undefined") {
        nfc.removeTagDiscoveredListener(this.displayTagId);
      }
    },
    displayTagId(nfcEvent){
      // Décoder les données des tags du plugin NFC
      let tag = nfcEvent.tag;
      this.tagId = '';
      this.tagId = nfc.bytesToHexString(tag.id);
      this.idEtu = this.tagId;

      // Ajouter la nouvelle balise à la liste sauvegardée
      this.items.push(tagId);

      // Afficher le tag Id dans la console
      console.log(tagId)
    },
    error(e){
      // Gérer l'état
      if(e === "NFC_DISABLED"){
        this.compatible = false;
        this.nfc_disabled = true;
      }else{
        this.nfc_disabled = false;
        this.compatible = false;
      }
    },
    success(){
      this.compatible = true;
      this.nfc_disabled = false;
      console.log("NfC initialisé");
    },
    showSettings(){
      // Ouvre les paramètres du téléphone pour activer les paramètres NfC
      nfc.showSettings();

      // Pour rafraîchir l'état du NFC, nous ajoutons un écouteur à l'événement "resume".
      // L'événement "resume" est déclenché par Cordova lorsque l'application est relancée.
      document.addEventListener("resume", this.registerTagEvent, false);
    },
    // Méthode pour obtenir le nom de l'étudiant depuis son ID
    getEtudiantFromAPI() {
      let id = this.idEtu
      api.get("/ELT/rest/idreq.php?id="+id).then(nomEtu => {
        // Afficher le résltat de la rquête avec l'ID
        // Afficher uniquement le nom et prénom
        this.nomEtu = nomEtu.data.split(",")[1]
      })
    }
  }
}
</script>
