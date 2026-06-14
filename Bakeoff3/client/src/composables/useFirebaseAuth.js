import { ref } from 'vue';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase.js';

const user = ref(null);
const ready = ref(false);
let unsubscribe = null;

function initAuthListener() {
  if (unsubscribe) return;
  unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    ready.value = true;
  });
}

initAuthListener();

export function useFirebaseAuth() {

  async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function logOut() {
    await signOut(auth);
  }

  return { user, ready, signIn, signUp, signInWithGoogle, logOut };
}

export function profileDisplayName(profile) {
  if (!profile) return '';
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  return name || profile.email || '';
}

export function welcomeName(firebaseUser) {
  if (!firebaseUser) return 'Chef';
  if (firebaseUser.displayName) return firebaseUser.displayName.split(' ')[0];
  if (firebaseUser.email) return firebaseUser.email.split('@')[0];
  return 'Chef';
}
