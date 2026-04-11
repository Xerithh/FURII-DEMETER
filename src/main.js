import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Styles
import '@/assets/styles/fonts.css'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Fetch user before mount
const authStore = useAuthStore()
authStore.fetchCurrentUser().finally(() => {
  // Mount vue app
  app.mount('#app')
})
