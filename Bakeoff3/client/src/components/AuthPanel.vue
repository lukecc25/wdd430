<script setup>
import { ref } from 'vue';
import { useFirebaseAuth } from '../composables/useFirebaseAuth.js';

const { signIn, signUp, signInWithGoogle } = useFirebaseAuth();

/** null = chooser only; 'signin' | 'signup' = email/password form */
const view = ref(null);
const email = ref('');
const password = ref('');
const error = ref('');
const busy = ref(false);

function openSignIn() {
  view.value = 'signin';
  error.value = '';
}

function openSignUp() {
  view.value = 'signup';
  error.value = '';
}

function closeForm() {
  view.value = null;
  email.value = '';
  password.value = '';
  error.value = '';
}

async function handleSubmit(event) {
  event.preventDefault();
  error.value = '';
  busy.value = true;
  try {
    if (view.value === 'signin') {
      await signIn(email.value, password.value);
    } else {
      await signUp(email.value, password.value);
    }
  } catch (err) {
    error.value = err?.message || 'Authentication failed';
  } finally {
    busy.value = false;
  }
}

async function handleGoogleSignIn() {
  error.value = '';
  busy.value = true;
  try {
    await signInWithGoogle();
  } catch (err) {
    error.value = err?.message || 'Log in with Google failed';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="auth-panel">
    <template v-if="!view">
      <button type="button" class="auth-btn" :disabled="busy" @click="openSignIn">
        Log in
      </button>
      <button type="button" class="auth-btn auth-btn--ghost" :disabled="busy" @click="openSignUp">
        Sign up
      </button>
    </template>

    <form v-else class="auth-panel__form" @submit="handleSubmit">
      <button type="button" class="auth-panel__back" :disabled="busy" @click="closeForm">
        ← Back
      </button>
      <input v-model="email" type="email" placeholder="Email" required autocomplete="email" />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="6"
        :autocomplete="view === 'signin' ? 'current-password' : 'new-password'"
      />
      <button type="submit" class="auth-btn" :disabled="busy">
        {{ busy ? '…' : view === 'signin' ? 'Log in' : 'Create account' }}
      </button>
      <button
        v-if="view === 'signin'"
        type="button"
        class="auth-btn auth-btn--google"
        :disabled="busy"
        @click="handleGoogleSignIn"
      >
        Log in with Google
      </button>
      <p v-if="error" class="auth-panel__error">{{ error }}</p>
    </form>
  </div>
</template>
