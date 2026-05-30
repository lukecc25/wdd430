// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // Bakeoff 2: static rendering — pre-built HTML shell, client-side hydration & data fetching
  ssr: false,

  modules: ['@clerk/nuxt'],

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  clerk: {
    signInForceRedirectUrl: '/',
    signUpForceRedirectUrl: '/',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'CookQuest',
      meta: [
        {
          name: 'description',
          content: 'Bite-sized cooking lessons with score tracking.',
        },
      ],
    },
  },
});
