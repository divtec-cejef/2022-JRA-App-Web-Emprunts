<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour scanner un QR code
 -->

<template>

  <div>
    <div class="q-gutter-md" style="max-width: 200px">
      <q-input outlined v-model="idEtu" :model-value="idEtu" label="ID étudiant"/>
    </div>
    <!-- Bouton qui éxecute la méthode pour scanner le QR code de l'étudiant -->
    <q-btn color="primary" label="Scan" @click="scanEtudiant" />
    <!-- Retourne l'ID de l'étudiant scanné -->
    <p>ID de l'étudiant: {{ idEtu }}</p>
  </div>
  <div>
    <div class="q-gutter-md" style="max-width: 200px">
      <q-input v-model="idMat" :model-value="idMat" label="ID matériel"/>
    </div>
    <!-- Bouton qui éxecute la méthode pour scanner le QR code du matériel -->
    <q-btn color="primary" label="Scan" @click="scanMatériel" />
    <!-- Retourne l'ID du matériel scanné -->
    <p>ID du matériel: {{ idMat }}</p>
  </div>

  <!-- Boutons radios pour choisir si c'est un emprunt ou un retour -->
  <div class="q-pa-md">
    <q-option-group
      :options="options"
      type="radio"
      v-model="empRet"
      color="primary"
      :model-value="empRet"
    />
    <!-- Afficher avec une variable quel choix est sélectionné -->
    <label>{{ empRet }}</label>
  </div>

  <!-- Bouton pour envoyer la requête POST -->
  <q-btn color="primary" @click="postEmprunt">
    Envoyer
  </q-btn>
  <!-- Afficher le résultat de la requête -->
  <p>Résultat: {{ resEmp }}</p>
</template>

<script>
// Importation de l'élément "ref"
import { defineComponent, ref } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  setup () {
    return {
      empRet: ref('emprunt'),
      options: [
        { label: 'Emprunt', value: 'emprunt', checkedIcon: 'task_alt' },
        { label: 'Retour', value: 'retour', checkedIcon: 'task_alt' }
      ]
    }
  },
  // Nom de la page
  name: 'Gestion',
  // Déclaration des données
  data () {
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
    scanEtudiant () {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idEtu = result.text
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
          // formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: 'portrait', // Android uniquement (portrait|landscape), par défaut non réglé pour qu'il tourne avec le téléphone
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS et Android
        }
      )
    },
    // Méthode pour scanner un QR code de l'étudiant
    scanMatériel () {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idMat = result.text
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
          // formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: 'portrait', // Android uniquement (portrait|landscape), par défaut non réglé pour qu'il tourne avec le téléphone
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS et Android
        }
      )
    },
    postEmprunt () {
      // Réinitialser la variable avec aucune valeur dedans
      this.resEmp = null
      // idUser: "73be4c03"
      // idDevice: "2bf8991d"
      // Création d'un formulaire pour envoyer dans la requête
      const formData = new FormData()
      // Ajout des données dans le formulaire
      formData.append('idUser', this.idEtu)
      formData.append('idDevice', this.idMat)
      // Ajout d'un paramètre uniquement si le bouton "Retour" est choisi
      if (this.empRet === 'retour') { formData.append('ret', '') }
      // Création de la requête complète
      api.post('/ELT/rest/borrow.php',
        // Paramètres de la requête
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
    // Méthode pour obtenir le nom de l'étudiant depuis son ID
    getEtudiantFromAPI () {
      const id = this.title
      api.get('/ELT/rest/idreq.php?id=' + id).then(res => {
        // Afficher le résltat de la rquête avec l'ID
        // Afficher uniquement le nom et prénom
        this.res = res.data.split(',')[1]
      })
    }
  }
})
</script>
