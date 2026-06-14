import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // Pure client-side SPA — static index.html + client bundle, no SSR.
  appType: 'spa',
  plugins: [vue()],
  build: {
    ssr: false,
  },
  server: {
    port: 5173,
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
