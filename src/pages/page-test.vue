<template>
  <h1>page de test</h1>
  <h4>Trouver un étudiant</h4>
  <p>id: 73BE4C03</p>
  <!-- Afficher le résultat de la requête pour trouver l'étudiant -->
  <p>Réponse: {{ res }}</p>

  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="text" :model-value="text" label="ID étudiant" />
      <q-btn color="primary" @click="getFromAPI">
        Tester
      </q-btn>
    </div>
  </div>
  <q-separator style="height: 5px" color="dark" inset />

  <h4>Faire un emprunt</h4>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="idMat" :model-value="idMat" label="ID matériel" />
      <q-input v-model="idEtu" :model-value="idEtu" label="ID étudiant" />
      <q-btn color="primary" @click="postEmprunt">
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
      text: '',
      res: '',
      idEtu: '',
      idMat: ''
    }
  },
  methods: {
    getFromAPI() {
      let id = this.text
      api.get("/ELT/rest/idreq.php?id="+id).then(res => {
        // Afficher le résltat de la rquête avec l'ID
        // Afficher uniquement le nom et prénom
        this.res = res.data.split(",")[1]
      })
    },
    postEmprunt(){

    }
  }
}
</script>
