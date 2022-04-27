<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page de gestion des emprunts et retours
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
      <q-input outlined v-model="idEtu" :model-value="idEtu" label="ID étudiant" @update:model-value="getStudent(idEtu)"/>
    </div>

    <!-- Bouton qui éxecute la méthode pour scanner le QR code de l'étudiant
    uniquement visible sur mobile -->
    <q-btn v-if="$q.platform.is.mobile" color="primary" class="q-mx-md" label="Scan" @click="scanStudent"/>

    <!-- Retourne le nom de l'étudiant scanné -->
    <p>{{ nameStu }}</p>
  </div>

  <div class="flex flex-center q-my-md">

    <div style="max-width: 200px" class="q-mx-md">
      <q-input outlined v-model="idMat" :model-value="idMat" label="ID matériel"  @update:model-value="getMaterial(idMat)"/>
    </div>
    <!-- Bouton qui éxecute la méthode pour scanner le QR code du matériel
     uniquement visible sur mobile -->
    <q-btn v-if="$q.platform.is.mobile" color="primary" class="q-mx-md" label="Scan" @click="scanMaterial"/>

    <!-- Retourne le nom du matériel scanné et l'affiche uniquement si le champ contient une donnée -->
    <p v-if="idMat!==''">{{ nameMat }}</p>
  </div>

  <!-- Change le texte et l'icone du bouton si le champ matériel est vide ou pas -->
  <div v-if="this.idMat!==''" class="flex flex-center q-my-md">
    <label class="q-pa-md">Ajoutez le matériel</label>
    <q-btn icon="check" color="primary" @click="initIdMat"/>
  </div>
  <div v-else class="flex flex-center q-my-md">
    <label class="q-pa-md">Supprimer la liste</label>
    <q-btn icon="clear" color="primary" @click="resetLists"/>
  </div>

  <!-- Retourne l'ID du matériel scanné -->
  <q-list class="text-center">
    <q-item v-for="mat in listMat" :key="mat">
      <q-item-section>
        {{ mat }}
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

  <div class="flex flex-center q-pa-md">
    <!-- Bouton pour envoyer la requête POST -->
    <q-btn color="primary" @click="postEmprunt">
      {{ empRet }}
    </q-btn>
  </div>

  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ empRet.toUpperCase() }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-list class="text-center">
          <q-item>
            <q-item-section>
              <!-- Condition qui change le message en fonction du code erreur -->
              <p v-if="errorCode===403">Erreur {{ errorCode }} : appareil déjà prêté ou retour d’un appareil non prêté</p>
              <p v-else-if="errorCode===404">Erreur {{ errorCode }} : identifiant(s) non trouvé(s)</p>
              <p v-else-if="errorCode===500">le requête n’a pas pu être enregistré sur le serveur</p>

              <!-- Affiche toutes les requêtes même si une requête ne passe pas -->
              <p>Requête(s) validée(s) :</p>
              <div v-for="name in listNameMat" :key="name">
                {{ name }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <!-- Vide les listes quand on ferme la pop-up -->
        <q-btn flat label="OK" color="primary" v-close-popup @click="resetLists"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
// Importation de les éléments
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
      tagId: '', // ID retourné du scan de NFC
      retour: false,
      resEmp: null,
      idEtu: '', // Résultat du QR code scanné
      idMat: '', // Résultat du QR code scanné
      nameMat: '', // Nom du matériel scanné
      nameStu: '', // Nom de l'étudiant scanné
      listIdMat: [], // Liste des ID des matériaux scannés
      listNameMat: [], // Liste des noms des matériaux scannés
      listMat: [], // Liste pour afficher l'identifiant du matériel
      errorCode: null // Code de l'erreur si un ID n'est pas pas correct
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

    // Ajouter l'id du matétiel à la liste et vider le champs
    initIdMat () {
      this.listIdMat.push(this.idMat)
      this.idMat = ''
      this.listMat.push(this.nameMat)
    },

    // Vider les 2 listes
    resetLists () {
      this.listIdMat = []
      this.listNameMat = []
      this.listMat = []
    },

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
      if (this.idEtu === '') {
        this.idEtu = this.tagId
        this.getStudent((this.idEtu))
      } else {
        this.idMat = this.tagId
        this.getMaterial((this.idMat))
      }

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
    getStudent (id) {
      // Vider le contenu de la variable
      this.nameStu = ''
      apiGeFoPro.get('/INF/rest/idreq.php?id=' + id).then(name => {
        // Afficher le résultat de la requête avec l'ID
        // Afficher uniquement le nom et prénom
        decodeURIComponent(this.nameStu = name.data.split(',')[1])
      })
    },
    // Méthode pour obtenir le nom de l'étudiant depuis son ID
    getMaterial (id) {
      // Vider le contenu de la variable
      this.nameMat = ''

      apiGeFoPro.get('/INF/rest/idreq.php?id=' + id).then(name => {
        // Afficher le résultat de la requête avec l'ID
        // Afficher l'ID et le modèle
        this.nameMat = name.data.split(',')[1]
      })
    },
    // Méthode pour scanner un QR code de l'étudiant
    scanStudent () {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idEtu = result.text
          this.getStudent((this.idEtu))
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
          orientation: 'portrait', // Android uniquement (portrait|landscape), par défaut non réglé pour qu'il tourne avec le téléphone
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS et Android
        }
      )
    },
    // Méthode pour scanner un QR code de l'étudiant
    scanMaterial () {
      cordova.plugins.barcodeScanner.scan(
        result => {
          this.idMat = result.text
          this.getMaterial((this.idMat))
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
          orientation: 'portrait', // Android uniquement (portrait|landscape), par défaut non réglé pour qu'il tourne avec le téléphone
          disableAnimations: true, // iOS
          disableSuccessBeep: true // iOS et Android
        }
      )
    },
    postEmprunt () {
      // Réinitialser la variable avec aucune valeur dedans
      this.resEmp = null
      this.errorCode = null

      // Création d'un formulaire pour envoyer dans la requête
      const formData = new FormData()
      // Ajout des données dans le formulaire
      formData.append('idUser', this.idEtu)

      this.listIdMat.forEach(idMat => {
        formData.append('idDevice', idMat)
        // Ajout d'un paramètre uniquement si le bouton "Retour" est choisi
        if (this.empRet === 'retourner') {
          formData.append('ret', '')
        }
        // Création de la requête complète
        apiGeFoPro.post('/INF/rest/borrow.php',
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
          this.nameMat = resEmp.data.split(',')[2]
          this.resEmp = resEmp.data.split(',')[2]

          // Ajout le nom de l'article à une liste pour afficher tous les articles
          this.listNameMat.push(this.resEmp)
          this.alert = true
        }).catch((err) => {
          this.getMaterial(idMat)
          this.errorCode = err.response.status
          this.alert = true
        })
      })
    }
  }
})
</script>
