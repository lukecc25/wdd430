<script setup>
import { useFirebaseAuth } from './composables/useFirebaseAuth.js';
import AuthPanel from './components/AuthPanel.vue';
import CookQuestApp from './components/CookQuestApp.vue';

const { user, ready, logOut } = useFirebaseAuth();
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="site-header__brand-group">
        <img
          src="/images/penguinhero.webp"
          alt=""
          class="site-header__logo"
          width="80"
          height="80"
        />
        <h1 class="site-header__brand">CookQuest</h1>
      </div>
      <div class="auth-actions">
        <span v-if="!ready" class="site-header__loading">Loading...</span>
        <template v-else-if="user">
          <button type="button" class="auth-btn auth-btn--ghost" @click="logOut">Sign out</button>
        </template>
        <AuthPanel v-else />
      </div>
    </header>

    <div class="container">
      <main>
        <CookQuestApp />
      </main>
    </div>
    <img
      src="/images/penguinbottom.webp"
      alt="Penguin resting at the bottom of the page"
      class="bottom-penguin"
    />
  </div>
</template>
