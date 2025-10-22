// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/']
    }
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
    defaultLocale: 'vi',
    lazy: true
  },
})
