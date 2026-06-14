<script setup>
import { computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { ME_QUERY } from '../graphql/operations.js';
import { useFirebaseAuth, profileDisplayName } from '../composables/useFirebaseAuth.js';

const props = defineProps({
  refreshKey: { type: Number, default: 0 },
});

const emit = defineEmits(['error']);

const { user: firebaseUser, ready } = useFirebaseAuth();

const { result, error, refetch, loading } = useQuery(ME_QUERY, null, () => ({
  enabled: ready.value && !!firebaseUser.value,
  fetchPolicy: 'network-only',
}));

watch(
  () => [ready.value, props.refreshKey, firebaseUser.value],
  () => {
    if (ready.value && firebaseUser.value) refetch();
  }
);

watch(error, (err) => {
  if (err) {
    emit('error', err.message || 'Profile load failed');
  }
});

const user = computed(() => result.value?.me);

const displayName = computed(() => {
  if (user.value) return profileDisplayName(user.value);
  if (firebaseUser.value?.displayName) return firebaseUser.value.displayName;
  if (firebaseUser.value?.email) return firebaseUser.value.email;
  return '';
});
</script>

<template>
  <div v-if="loading && !user" class="profile-card">
    <strong>Loading profile...</strong>
  </div>
  <div v-else class="profile-card">
    <div>
      <strong>{{ displayName }}</strong>
      <div class="muted">
        Total score: <span>{{ user?.totalScore ?? 0 }}</span>
      </div>
    </div>
  </div>
</template>
