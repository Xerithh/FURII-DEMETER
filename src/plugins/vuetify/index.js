import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { themes } from './theme'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

const AUTO_DARK_MODE_SESSION_KEY = 'isisu:auto-dark-mode'

const getSystemThemeName = () => {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const getInitialThemeName = () => {
  if (typeof window === 'undefined') return 'light'

  const autoDarkModeEnabled =
    window.sessionStorage.getItem(AUTO_DARK_MODE_SESSION_KEY) === 'true'

  return autoDarkModeEnabled ? getSystemThemeName() : 'light'
}

export default function (app) {
  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    theme: {
      defaultTheme: getInitialThemeName(),
      themes,
    },
  })

  app.use(vuetify)

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const syncAutoTheme = () => {
      if (window.sessionStorage.getItem(AUTO_DARK_MODE_SESSION_KEY) !== 'true') {
        return
      }

      vuetify.theme.global.name.value = mediaQuery.matches ? 'dark' : 'light'
    }

    syncAutoTheme()
    mediaQuery.addEventListener('change', syncAutoTheme)
  }
}
