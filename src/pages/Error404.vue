<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops! Vous êtes perdu ? Il n'y a rien ici...
      </div>

      <q-btn
        size="xl"
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Page d'accueil"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>
