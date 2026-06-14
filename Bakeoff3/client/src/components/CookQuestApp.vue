<script setup>
import { ref, computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { LESSONS_QUERY, PROGRESS_QUERY } from '../graphql/operations.js';
import { useFirebaseAuth, welcomeName } from '../composables/useFirebaseAuth.js';
import ProfileCard from './ProfileCard.vue';
import LessonGrid from './LessonGrid.vue';
import LessonRunner from './LessonRunner.vue';
import LessonCreator from './LessonCreator.vue';

const { user, ready } = useFirebaseAuth();
const displayWelcome = computed(() => welcomeName(user.value));

const lessonsQuery = useQuery(LESSONS_QUERY, null, () => ({
  enabled: ready.value,
  fetchPolicy: 'network-only',
}));

const progressQuery = useQuery(PROGRESS_QUERY, null, () => ({
  enabled: ready.value && !!user.value,
  fetchPolicy: 'network-only',
}));

const lessons = computed(() => lessonsQuery.result.value?.lessons ?? []);

const loading = computed(() => {
  if (!ready.value) return true;
  return lessonsQuery.loading.value && lessons.value.length === 0;
});

const progress = computed(() => {
  const entries = progressQuery.result.value?.progress ?? [];
  return Object.fromEntries(
    entries.map((p) => [p.lessonId, { score: p.score, totalPossible: p.totalPossible }])
  );
});

function refetchHome() {
  lessonsQuery.refetch();
  if (user.value) progressQuery.refetch();
}

watch(user, () => {
  lessonsQuery.refetch();
  progressQuery.refetch();
});

const error = ref('');
const activeLessonId = ref(null);
const showCreateLesson = ref(false);
const profileRefresh = ref(0);

function handleLessonSubmitted() {
  profileRefresh.value += 1;
  refetchHome();
}

function handleLessonCreated(lesson) {
  showCreateLesson.value = false;
  profileRefresh.value += 1;
  refetchHome();
  if (lesson?.id) activeLessonId.value = lesson.id;
}

function handleError(message) {
  error.value = message;
}

function openCreateLesson() {
  activeLessonId.value = null;
  showCreateLesson.value = true;
  error.value = '';
}
</script>

<template>
  <div>
    <p v-if="loading" class="muted">Loading...</p>

    <template v-else>
      <p class="tagline">
        <template v-if="!user">
          Bite-sized cooking lessons. Sign in to track your score.
        </template>
        <template v-else>
          Welcome back, <strong>{{ displayWelcome }}</strong>! Pick a lesson and earn points.
        </template>
      </p>

      <section v-if="!user">
        <h2>Sign in to start cooking</h2>
        <p class="muted">Use Sign in or Sign up in the header to get started.</p>
      </section>

      <section v-else>
        <ProfileCard :refresh-key="profileRefresh" @error="handleError" />

        <LessonRunner
          v-if="activeLessonId"
          :key="activeLessonId"
          :lesson-id="activeLessonId"
          @error="handleError"
          @submitted="handleLessonSubmitted"
          @close="activeLessonId = null"
        />
        <LessonCreator
          v-else-if="showCreateLesson"
          @created="handleLessonCreated"
          @cancel="showCreateLesson = false"
          @error="handleError"
        />
        <template v-else>
          <div class="lessons-header">
            <h2>Lessons</h2>
            <button type="button" class="test-creator__open" @click="openCreateLesson">
              + Create lesson
            </button>
          </div>
          <p v-if="!lessons.length" class="muted">
            No lessons loaded. Check Firebase and GraphQL server, then restart
            <code>npm run dev</code>.
          </p>
          <LessonGrid
            v-else
            :lessons="lessons"
            :progress="progress"
            @select-lesson="activeLessonId = $event"
          />
        </template>
      </section>
    </template>

    <p v-if="error" class="app-error" role="alert">{{ error }}</p>
  </div>
</template>
