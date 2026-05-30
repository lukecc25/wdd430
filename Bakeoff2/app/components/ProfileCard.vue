<script setup>
const props = defineProps({
  refreshKey: { type: Number, default: 0 },
});

const emit = defineEmits(['error']);

const { isLoaded } = useAuth();
const { user: clerkUser } = useUser();
const authedFetch = useAuthedFetch();
const user = ref(null);

async function loadProfile() {
  if (!isLoaded.value) return;

  try {
    const data = await authedFetch('/api/users/me');
    user.value = data.user;
  } catch (err) {
    const status = err?.statusCode || err?.status;
    const detail = err?.data?.message || err?.statusMessage || err?.message;
    const fallback = profileFromClerkUser(clerkUser.value);

    if (fallback) {
      user.value = fallback;
      if (status === 401) {
        emit('error', 'Session not ready — try refreshing the page.');
      } else {
        emit(
          'error',
          `Could not sync score from database${detail ? `: ${detail}` : ''}. Showing Clerk profile only.`
        );
      }
      return;
    }

    emit('error', `Profile load failed${status ? ` (${status})` : ''}${detail ? `: ${detail}` : ''}`);
  }
}

watch(() => [isLoaded.value, props.refreshKey], loadProfile, { immediate: true });

const displayName = computed(() => profileDisplayName(user.value));
</script>

<template>
  <div v-if="!user" class="profile-card">
    <strong>Loading profile…</strong>
  </div>
  <div v-else class="profile-card">
    <img v-if="user.imageUrl" :src="user.imageUrl" alt="" width="44" height="44" />
    <div>
      <strong>{{ displayName }}</strong>
      <div class="muted">
        Total score: <span>{{ user.totalScore }}</span>
      </div>
    </div>
  </div>
</template>
