import { createApp } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import { apolloClient } from './apollo';
import './assets/main.css';

const app = createApp(App);
app.provide(DefaultApolloClient, apolloClient);
app.mount('#app');
