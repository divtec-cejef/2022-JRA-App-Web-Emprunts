<template>
  <q-item
    clickable
    v-ripple
    exact
    tag="a"
    :to="lien"
  >
    <q-item-section
      v-if="icone"
      avatar
    >
      <q-icon :name="icone" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ titre }}</q-item-label>
      <q-item-label v-if="description" caption>
        {{ description }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuLiens',
  props: {
    titre: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    lien: {
      type: String,
      default: '#'
    },

    icone: {
      type: String,
      default: ''
    }
  }
})
</script>
