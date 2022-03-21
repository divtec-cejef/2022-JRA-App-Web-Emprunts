<template>
  <h1>page de test</h1>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="text" :model-value="text" label="ID étudiant" />
      <q-btn color="primary" @click="getFromAPI">
        Tester
      </q-btn>
    </div>

  </div>
</template>

<script>

import {api} from "boot/axios";

export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    getFromAPI() {
      let id = this.text
      api.get("/ELT/rest/idreq.php?id="+id).then(res => {
        console.log('CREATION OK', res)
      })
    }
  }
}
</script>
