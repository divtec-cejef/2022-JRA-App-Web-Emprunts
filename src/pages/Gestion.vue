<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour scanner un QR code
 -->

<template>

  <!-- Afficher si la fonction NFC du téléphone n'est pas activée -->
  <div v-if="nfc_disabled">
    <h5 class="flex flex-center">Activez le paramètre NFC</h5>
    <div class="flex flex-center q-pa-md">
      <!-- Affiche un bouton pour activer la fonction NFC du téléphone -->
      <q-btn color="primary" v-on:click="showSettings">Activer</q-btn>
    </div>
  </div>

    <div class="flex flex-center q-my-md q-mt-xl">
    <div style="max-width: 200px" class="q-mx-md">
      <q-input outlined v-model="idEtu" :model-value="idEtu" label="ID étudiant"/>
    </div>

      <!-- Bouton qui éxecute la méthode pour scanner le QR code de l'étudiant
      uniquement visible sur mobile -->
      <q-btn v-if="$q.platform.is.mobile" color="primary" class="q-mx-md" label="Scan" @click="scanEtudiant" />

      <!-- Retourne l'ID de l'étudiant scanné -->
      <p hidden>ID de l'étudiant: {{ idEtu }}</p>
    </div>

    <div class="flex flex-center q-my-md">

      <!-- if pour détecter sur quelle plateforme on est et
      changer l'afficher en focntion de la plateforme -->
      <div style="max-width: 200px" class="q-mx-md">
        <q-input outlined v-model="idMat" :model-value="idMat" label="ID matériel"/>
      </div>

      <!-- Bouton qui éxecute la méthode pour scanner le QR code du matériel
      uniquement visible sur mobile -->
      <q-btn v-if="$q.platform.is.mobile" color="primary" class="q-mx-md" label="Scan" @click="scanMateriel"/>
    </div>

  <div class="flex flex-center q-my-md">
    <label class="q-pa-md">Ajoutez le matériel</label>
    <q-btn v-if="this.idMat!==''" icon="check" color="primary" @click="this.listIdMat.push(idMat), this.idMat='' "/>
    <q-btn disable v-else icon="clear" color="primary"/>
  </div>

    <!-- Retourne l'ID du matériel scanné -->
    <q-list class="text-center">
      <q-item v-for="mat in listIdMat" :key="mat">
        <q-item-section>
          {{mat}}
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Boutons radios pour choisir si c'est un emprunt ou un retour -->
    <div class="flex flex-center q-pa-md">
      <q-option-group
        :options="options"
        type="radio"
        v-model="empRet"
        color="primary"
        :model-value="empRet"
      />
    </div>

      <!-- Afficher avec une variable quel choix est sélectionné -->
      <p hidden>{{ empRet }}</p>

    <div class="flex flex-center q-pa-md">
    <!-- Bouton pour envoyer la requête POST @click="alert = true"-->
      <q-btn color="primary" @click="postEmprunt">
        {{ empRet }}
      </q-btn>
    </div>

  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">Information</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-list class="text-center">
          <q-item v-if="!error" v-for="name in listNameMat" :key="name">
            <q-item-section>
              {{name}}
            </q-item-section>
          </q-item>
            <q-item v-else>
              <q-item-section>
                <p v-if="resEmp===403">Erreur {{resEmp}} : appareil déjà prêté ou retour d’un appareil non prêté</p>
                <p v-else-if="resEmp===404">Erreur {{resEmp}} : identifiant(s) non trouvé(s)</p>
                <p v-else-if="resEmp===500">le requête n’a pas pu être enregistré sur le serveur</p>
              </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

    <!-- Afficher le résultat de la requête -->
    <p >Résultat: {{ resEmp }}</p>
</template>

<script>
// Importation de l'élément "ref"
import { defineComponent, ref } from 'vue'
import { apiGeFoPro } from 'boot/axios'

export default defineComponent({
  setup () {
    return {
      alert: ref(false),
      empRet: ref('emprunter'),
      options: [
        { label: 'Emprunt', value: 'emprunter', checkedIcon: 'task_alt' },
        { label: 'Retour', value: 'retourner', checkedIcon: 'task_alt' }
      ]
    }
  },
  // Nom de la page
  name: 'Gestion',
  // Déclaration des données
  data () {
    return {
      compatible: true,
      nfc_disabled: false,
      tagId: '',
      res: '',
      retour: false,
      imageSrc: '',
      resEmp: null,
      idEtu: '', // resultat du QR code scanné
      idMat: '', // resultat du QR code scanné
      listIdMat: [],
      listNameMat: [],
      error: false,
      description: ''
    }
  },
  mounted () {
    // Lorsque la vue est montée, enregistre l'événement du scan
    this.registerTagEvent()
  },
  beforeUnmount () {
    // Lorsque la vue est détruite (départ de l'utilisateur),
    // annule l'enregistrement de l'événement de balise de numérisation pour éviter de numériser la balise dans une autre vue
    this.unregisterTagEvent()
  },
  // Déclaration des méthodes
  methods: {

    registerTagEvent () {
      // Annulation de l'écoute de l'événement "resume" précédent.
      document.removeEventListener('resume', this.registerTagEvent, false)
      if (typeof (nfc) !== 'undefined') {
        // NFC est disponible, en attente de scan
        // eslint-disable-next-line no-undef
        nfc.addTagDiscoveredListener(this.displayTagId, this.success, this.error)
      } else {
        // Le plugin n'est pas présent ou n'a pas pu être initialisé.
        this.error()
      }
    },
    unregisterTagEvent () {
      // Tester si le plugin NFC est défini
      if (typeof (nfc) !== 'undefined') {
        // eslint-disable-next-line no-undef
        nfc.removeTagDiscoveredListener(this.displayTagId)
      }
    },
    displayTagId (nfcEvent) {
      // Décoder les données des tags du plugin NFC
      const tag = nfcEvent.tag
      this.tagId = ''
      // eslint-disable-next-line no-undef
      this.tagId = nfc.bytesToHexString(tag.id)
      this.idEtu = this.tagId
      // Ajouter la nouvelle balise à la liste sauvegardée
      this.items.push(this.tagId)
      // Afficher le tag Id dans la console
      console.log(this.tagId)
    },
    error (e) {
      // Gérer l'état
      if (e === 'NFC_DISABLED') {
        this.compatible = false
        this.nfc_disabled = true
      } else {
        this.nfc_disabled = false
        this.compatible = false
      }
    },
    success () {
      this.compatible = true
      this.nfc_disabled = false
      console.log('NfC initialisé')
    },
    showSettings () {
      // Ouvre les paramètres du téléphone pour activer les paramètres NfC
      // eslint-disable-next-line no-undef
      nfc.showSettings()
      // Pour rafraîchir l'état du NFC, nous ajoutons un écouteur à l'événement "resume".
      // L'événement "resume" est déclenché par Cordova lorsque l'application est relancée.
      document.addEventListener('resume', this.registerTagEvent, false)
    },
    // Méthode pour obtenir le nom de l'étudiant depuis son ID
    getEtudiantFromAPI () {
      const id = this.idEtu
      apiGeFoPro.get('/ELT/rest/idreq.php?id=' + id).then(nomEtu => {
        // Afficher le résultat de la requête avec l'ID
        // Afficher uniquement le nom et prénom
        this.nomEtu = nomEtu.data.split(',')[1]
      })
    },
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
    scanMateriel () {
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
      if (this.empRet === 'retourner') { formData.append('ret', '') }
      // Création de la requête complète
      apiGeFoPro.post('/ELT/rest/borrow.php',
        // Paramètres de la requête
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).then((resEmp) => {
        console.log(resEmp)
        // Nom du matériel
        this.resEmp = resEmp.data.split(',')[2]

        // Ajout le nom de l'article à une liste pour afficher tous les articles
        this.listNameMat.push(this.resEmp)

        this.error = false
        this.alert = true

      }).catch((err) => {
        this.error = true
        this.resEmp = err.response.status
        this.alert = true
      })
    }
  }
})
</script>
