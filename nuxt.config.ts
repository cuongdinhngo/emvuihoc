// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/']
    },
    output: {
      publicDir: 'dist'
    }
  },
  router: {
    options: {
      hashMode: false
    }
  },
  app: {
    baseURL: '/emvuihoc/',
    buildAssetsDir: '/assets/'
  },
  experimental: {
    payloadExtraction: false
  },
  build: {
    analyze: false
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    locales: [
      { code: 'vi', file: 'vi.json', name: 'Tiếng Việt' },
      { code: 'en', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'vi',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    langDir: 'locales/'
  },
})
