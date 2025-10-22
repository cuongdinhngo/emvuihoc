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
      { code: 'vi', file: 'vi.json' },
      { code: 'en', file: 'en.json' }
    ],
    defaultLocale: 'vi'
  },
})
