<template>
  <h1>page de test</h1>
  <h4>Trouver un étudiant</h4>
  <p>id: 73BE4C03</p>
  <!-- Afficher le résultat de la requête pour trouver l'étudiant -->
  <p>Réponse: {{ resEtu }}</p>

  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="text" :model-value="text" label="ID étudiant"/>
      <q-btn color="primary" @click="getFromAPI">
        Tester
      </q-btn>
    </div>
  </div>
  <q-separator style="height: 5px" color="dark" inset/>

  <h4>Faire un emprunt</h4>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="idMat" :model-value="idMat" label="ID matériel"/>
      <q-input v-model="idEtu" :model-value="idEtu" label="ID étudiant"/>
      <div class="q-pa-md">
        <q-option-group
          :options="options"
          type="radio"
          v-model="group"
          color="primary"
          :model-value="group"
        />
        <!-- Afficher avec une variable quel choix est sélectionné -->
        <label>{{ group }}</label>
      </div>
      <q-btn color="primary" @click="postEmprunt">
        Tester
      </q-btn>
      <p>Réponse: {{ resEmp }}</p>
    </div>
  </div>

</template>

<script>

import {api} from "boot/axios";
import {ref} from "vue";

export default {
  setup() {
    return {
      group: ref('emprunt'),
      options: [
        {label: 'Emprunt', value: 'emprunt', checkedIcon: "task_alt"},
        {label: 'Retour', value: 'retour', checkedIcon: "task_alt"}
      ]
    }
  },
  data() {
    return {
      text: '',
      resEtu: '',
      resEmp: null,
      reponse: '',
      idEtu: '',
      idMat: ''
    }
  },
  methods: {
    getFromAPI() {
      let id = this.text
      api.get("/ELT/rest/idreq.php?id=" + id).then(resEtu => {
        // Afficher le résltat de la requête avec l'ID
        // Afficher uniquement le nom et prénom
        this.resEtu = resEtu.data.split(",")[1]
      })
    },
    postEmprunt() {
      //idUser: "73be4c03"
      //idDevice: "2bf8991d"
      let formData = new FormData();

      formData.append('idUser', this.idEtu)
      formData.append('idDevice', this.idMat)

      api.post("/ELT/rest/borrow.php",
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
    }
  }

}
</script>
