<script setup>
defineProps({
  lessons: { type: Array, default: () => [] },
  progress: { type: Object, default: () => ({}) },
});

const { welcomeName } = useClerkDisplayName();

const error = ref('');
const activeLessonId = ref(null);
const profileRefresh = ref(0);

function handleLessonSubmitted() {
  profileRefresh.value += 1;
  refreshNuxtData('home');
}

function handleError(message) {
  error.value = message;
}
</script>

<template>
  <div>
    <ClerkLoading>
      <p class="muted">Loading…</p>
    </ClerkLoading>

    <ClerkLoaded>
      <p class="tagline">
        <SignedOut>
          Bite-sized cooking lessons. Sign in to track your score.
        </SignedOut>
        <SignedIn>
          Welcome back, <strong>{{ welcomeName }}</strong>! Pick a lesson and earn points.
        </SignedIn>
      </p>

      <SignedOut>
        <section>
          <h2>Sign in to start cooking</h2>
          <p class="muted">Use Sign in or Sign up in the header to get started.</p>
        </section>
      </SignedOut>

      <SignedIn>
        <section>
          <ProfileCard :refresh-key="profileRefresh" @error="handleError" />

          <LessonRunner
            v-if="activeLessonId"
            :lesson-id="activeLessonId"
            @error="handleError"
            @submitted="handleLessonSubmitted"
            @close="activeLessonId = null"
          />
          <template v-else>
            <h2>Lessons</h2>
            <p v-if="!lessons.length" class="muted">
              No lessons loaded. Set DATABASE_URL in .env and restart
              <code>npm run dev</code>.
            </p>
            <LessonGrid
              v-else
              :lessons="lessons"
              :progress="progress"
              :refresh-key="profileRefresh"
              @select-lesson="activeLessonId = $event"
            />
          </template>
        </section>
      </SignedIn>
    </ClerkLoaded>

    <p v-if="error" class="app-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
