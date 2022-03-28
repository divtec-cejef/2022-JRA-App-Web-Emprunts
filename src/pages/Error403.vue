<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        403
      </div>

      <div class="text-h2" style="opacity:.4">
        <p>Vous ne passerez pas !</p>
        <p class="small">Cette page protégée...</p>
      </div>

      <q-btn
        class="q-mt-xl"
        size="xl"
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

<style lang="scss" scoped>
.small {
  font-size: .6em;
}
</style>
