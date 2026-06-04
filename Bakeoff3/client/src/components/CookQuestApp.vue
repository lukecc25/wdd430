<script setup>
import { ref, computed } from 'vue';
import { useFirebaseAuth, welcomeName } from '../composables/useFirebaseAuth.js';
import ProfileCard from './ProfileCard.vue';
import LessonGrid from './LessonGrid.vue';
import LessonRunner from './LessonRunner.vue';
import LessonCreator from './LessonCreator.vue';

defineProps({
  lessons: { type: Array, default: () => [] },
  progress: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['refresh']);

const { user } = useFirebaseAuth();
const displayWelcome = computed(() => welcomeName(user.value));

const error = ref('');
const activeLessonId = ref(null);
const showCreateLesson = ref(false);
const profileRefresh = ref(0);

function handleLessonSubmitted() {
  profileRefresh.value += 1;
  emit('refresh');
}

function handleLessonCreated(lesson) {
  showCreateLesson.value = false;
  profileRefresh.value += 1;
  emit('refresh');
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
    <p v-if="loading" class="muted">Loading…</p>

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
