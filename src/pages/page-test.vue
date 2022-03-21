<template>
  <h1>page de test</h1>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="text" :model-value="text" label="ID étudiant" />
      <q-btn color="primary">
        Tester
      </q-btn>
    </div>

  </div>
</template>

<script>



export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>
