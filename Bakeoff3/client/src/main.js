import { createApp } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import router from './router';
import { apolloClient } from './apollo';
import './assets/main.css';

// Client-side rendering only: mount Vue in the browser, not on a server.
const app = createApp(App);
app.use(router);
app.provide(DefaultApolloClient, apolloClient);

if (typeof document !== 'undefined') {
  app.mount('#app');
}
