
<template>
  <h1>Ouvrir l'appareil photo</h1>
  <v-container text-center>

    <q-btn v-on:click="takePicture">{{ takePhoto }}</q-btn>
  </v-container>

</template>

<script>


export default {
  name: 'RFID',
  data() {
    return {
      imagePath: ""
    }
  },
  methods: {
    // Use the camera plugin to capture image
    takePicture() {
      if (navigator.camera) {
        navigator.camera.getPicture(this.setPicture, this.error, {});
      }else{
        // If the navigator.camera is not available display generic error to the user.
        this.error();
      }
    },
    // Set the picture path in the data of the vue
    // this action will automatically update the view.
    setPicture(imagePath){
      this.imagePath = imagePath;
    },
    error(){
      nativeAlert("Erreur");
    }
  }
}
</script>

<style scoped>
img{
  width: 50%;
  display: block;
  margin: auto;
}
</style>
