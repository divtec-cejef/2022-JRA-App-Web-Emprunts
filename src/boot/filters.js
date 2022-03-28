// src/boot/filters.js
import { date } from 'quasar'
import { boot } from 'quasar/wrappers'

// https://v3.vuejs.org/guide/migration/filters.html#_3-x-update

export default boot(async ({ app }) => {
  app.config.globalProperties.$filters = {
    dmy (value) {
      if (date.isValid(value)) {
        const dateLocale = new Date(value)
        return date.formatDate(dateLocale, 'DD.MM.YYYY')
      }
      // Si date invalide on retourne la valeur sans modification
      return value
    }
  }
})
