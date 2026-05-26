// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@clerk/nuxt'],
  routeRules: {
    '/': { prerender: false },
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
