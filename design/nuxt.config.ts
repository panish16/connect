// https://nuxt.com/docs/api/configuration/nuxt-config
const isStudioEnabled = process.env.STUDIO === 'true'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    ...(isStudioEnabled ? ['nuxt-studio'] : []),
    '@nuxt/ui',
    '@nuxt/a11y',
    '@nuxt/eslint'
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2026-05-01',
  app: {
    head: {
      htmlAttrs: {
        lang: 'en-CA'
      }
    }
  },
  studio: {
    repository: {
      provider: 'github', 
      owner: 'daxiom',
      repo: 'connect',
      branch: 'main'
    }
  },
  extends: [
    '@sbc-connect/nuxt-pay'
  ],
  content: {
    // Content configuration
  },
  nitro: {
    preset: 'node_server',
    externals: {
      external: ['better-sqlite3']
    },
    prerender: {
      routes: ['/'],
      crawlLinks: true
    },
    devStorage: {
      db: {
        driver: 'fs',
        base: '/tmp/db'
      }
    }
  },
  auth: {
    session: {
      name: '__session'
    }
  },
  runtimeConfig: {
    auth: {
      cookieName: '__session'
    }
  },
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en-CA',
        language: 'en-CA',
        dir: 'ltr',
        file: 'en-CA.ts'
      },
      {
        name: 'Français',
        code: 'fr-CA',
        language: 'fr-CA',
        dir: 'ltr',
        file: 'fr-CA.ts'
      }
    ],
    langDir: 'locales',
    defaultLocale: 'en-CA',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  icon: {
    clientBundle: { scan: false }
  }
})