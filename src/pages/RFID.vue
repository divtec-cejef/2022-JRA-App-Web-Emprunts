<template>

  <div v-if="isCameraOpen" class="camera-box">
    <video ref="camera" :width="450" :height="337.5" autoplay></video>
  </div>
  <div class="camera-button">
    <button type="button" class="button is-rounded" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
      <span v-if="!isCameraOpen">Open Camera</span>
      <span v-else>Close Camera</span>
    </button>
  </div>


</template>

<script>
export default {
  name: 'RFID',
  components: {},
  data() {
    return {
      isCameraOpen: false

    }
  },

  methods: {

    toggleCamera() {
      if(this.isCameraOpen) {
        this.isCameraOpen = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach(track => {
        track.stop();
      });
    },
    createCameraElement() {
      const constraints = (window.constraints = {
        audio: false,
        video: {
          facingMode: {
            exact: "environment"
          }
        }
      });


      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.$refs.camera.srcObject = stream;
        })
        .catch(error => {
          alert("May the browser didn't support or there is some errors.");
        });
    },



  }
}
</script>

<style>
video {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
}
</style>
