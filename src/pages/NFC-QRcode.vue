<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour scanner une puce NFC
 -->

<template>
  <div text-center>
      <span v-if="compatible">
        <h2>Scannez</h2>
        <br>
        <!-- Bouton qui affiche l'historique de scan -->
        <q-btn color="primary" @click="dialog = true">Historique</q-btn>
        <q-dialog v-model="dialog" scrollable>
          <q-card>
            <div>Historique</div>
            <ul style="height: 300px;">
              <!-- Liste à puces qui affiche les éléments scannés -->
                <li v-for="item in items" v-bind:key="item">
                  <div>
                    <p v-text="item"></p>
                  </div>
                </li>
              <!-- Si aucun scan réalisé, la liste affiche 'pas d'historique' -->
                <li v-if="items.length === 0">
                  <div>
                    <p class="text-center">Pas d'historique</p>
                  </div>
                </li>
            </ul>
          </q-card>
        </q-dialog>
      </span>

    <!-- Afficher si la fonction NFC du téléphone n'est pas activée -->
    <span v-if="nfc_disabled">
        <h2>Activez le paramètre NFC</h2>
      <!-- Affiche un bouton pour activer la fonction NFC du téléphone -->
      <q-btn color="primary" v-on:click="showSettings">Activer</q-btn>
      </span>
  </div>
</template>

<script>

export default {
  // Nom de la page
  name: 'NFC',
  // Déclaration des données
  data(){
    return {
      compatible: true,
      nfc_disabled: false,
      dialog: false,
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
      let tagId = nfc.bytesToHexString(tag.id);

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
    }
  }
}
</script>
