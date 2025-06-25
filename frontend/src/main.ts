import { createApp } from 'vue'
import { Chart, registerables } from 'chart.js'
import pluginAnnotation from 'chartjs-plugin-annotation'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from '@/app/App.vue'
import router from '@/app/router'
import '@/app/assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})

Chart.register(...registerables, pluginAnnotation)

app.mount('#app')
