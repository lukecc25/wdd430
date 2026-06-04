<script setup>
import { useFirebaseAuth } from './composables/useFirebaseAuth.js';
import AuthPanel from './components/AuthPanel.vue';
const { user, ready, logOut } = useFirebaseAuth();
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <h1 class="site-header__brand">🍳 CookQuest</h1>
      <div class="auth-actions">
        <span v-if="!ready" class="site-header__loading">…</span>
        <template v-else-if="user">
          <button type="button" class="auth-btn auth-btn--ghost" @click="logOut">Sign out</button>
        </template>
        <AuthPanel v-else />
      </div>
    </header>

    <div class="container">
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>
