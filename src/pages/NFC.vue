<!--
  Auteur: Sévan Bendit
  Date: 15.03.2022
  Description: Page pour scanner une puce NFC
 -->

<template>
  <div text-center>
      <span v-if="compatible">
        Waiting
        <br>
        <q-btn @click="dialog = true">History</q-btn>
        <q-dialog v-model="dialog" scrollable>
          <q-card>
            <div>History</div>
            <ul style="height: 300px;">
                <li v-for="item in items" v-bind:key="item">
                  <div>
                    <p v-text="item"></p>
                  </div>
                </li>
                <li v-if="items.length === 0">
                  <div>
                    <p class="text-center">Pas d'historique</p>
                  </div>
                </li>
            </ul>
          </q-card>
        </q-dialog>
      </span>
    <q-btn v-on:click="showSettings" v-else-if="nfc_disabled">Settings</q-btn>
    <span v-else>Pas disponible</span>
  </div>
</template>

<script>

export default {
  name: 'NFC',
  data(){
    return {
      compatible: true,
      nfc_disabled: false,
      dialog: false,
      items: JSON.parse((localStorage.getItem("scanHistory")||"[]")),
    }
  },
  watch:{
    items: function (v) {
      // Watch push on the items data. If a new item is push save it to the « localStorage ».
      localStorage.setItem("scanHistory", JSON.stringify(this.items));
    }
  },
  mounted(){
    // When the view is mounted, register the scan tag event.
    this.registerTagEvent();
  },
  beforeDestroy(){
    // When the view is destroyed (user leave), unregister the scan tag event, to avoid scanning tag in other view
    this.unregisterTagEvent();
  },
  methods: {
    registerTagEvent(){
      // Unregister previously « resume » event listener.
      document.removeEventListener("resume", this.registerTagEvent, false);

      if (typeof(nfc) !== "undefined"){
        // Nfc is available, waiting for scan
        nfc.addTagDiscoveredListener(this.displayTagId, this.success, this.error);
      }else{
        // Plugin not present or failed to initialized.
        this.error();
      }
    },
    unregisterTagEvent(){
      // Test if the plugin is defined
      if (typeof(nfc) !== "undefined") {
        nfc.removeTagDiscoveredListener(this.displayTagId);
      }
    },
    displayTagId(nfcEvent){
      // Decode tag data from the plugin
      let tag = nfcEvent.tag;
      let tagId = nfc.bytesToHexString(tag.id);

      // Push the new tag to the saved list
      this.items.push(tagId);

      // Show the tag Id to the user
      console.log(tagId)
    },
    error(e){
      // Manage the state
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
      console.log("Nfc initialized");
    },
    showSettings(){
      // Trigger the phone settings to enable the Nfc settings
      nfc.showSettings();

      // To refresh the state of the nfc, we add a listener to the « resume » event.
      // The resume event is triggered by cordova when the app is « Resumed ».
      document.addEventListener("resume", this.registerTagEvent, false);
    }
  }
}
</script>
