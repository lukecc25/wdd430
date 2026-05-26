<script setup>
const PER_PAGE = 3;

const props = defineProps({
  lessons: { type: Array, default: () => [] },
  progress: { type: Object, default: () => ({}) },
  refreshKey: { type: Number, default: 0 },
});

const emit = defineEmits(['selectLesson']);

const { isLoaded } = useAuth();
const authedFetch = useAuthedFetch();
const progressState = ref({ ...props.progress });
const page = ref(0);

watch(
  () => props.progress,
  (value) => {
    progressState.value = { ...(value || {}) };
  },
  { deep: true }
);

async function loadProgress() {
  if (!isLoaded.value) return;
  try {
    const data = await authedFetch('/api/lessons/progress');
    progressState.value = data.progress || {};
  } catch {
    // keep existing progress on failure
  }
}

watch(() => [isLoaded.value, props.refreshKey], loadProgress, { immediate: true });

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.lessons.length / PER_PAGE))
);

const safePage = computed(() => Math.min(page.value, totalPages.value - 1));

const visible = computed(() =>
  props.lessons.slice(
    safePage.value * PER_PAGE,
    safePage.value * PER_PAGE + PER_PAGE
  )
);

function lessonKey(lesson) {
  return lesson._id?.toString?.() ?? lesson._id;
}
</script>

<template>
  <div class="lessons-carousel">
    <div class="lessons-grid">
      <button
        v-for="lesson in visible"
        :key="lessonKey(lesson)"
        type="button"
        :class="[
          'lesson-card',
          `lesson-card--${lesson.difficulty}`,
          progressState[lessonKey(lesson)] ? 'lesson-card--completed' : '',
        ]"
        @click="emit('selectLesson', lessonKey(lesson))"
      >
        <span v-if="progressState[lessonKey(lesson)]" class="lesson-card__completed">
          Completed
        </span>
        <strong>{{ lesson.title }}</strong>
        <span class="muted">{{ lesson.difficulty }}</span>
        <span v-if="progressState[lessonKey(lesson)]" class="lesson-card__score">
          Score: {{ progressState[lessonKey(lesson)].score }} /
          {{ progressState[lessonKey(lesson)].totalPossible }}
        </span>
        <p>{{ lesson.description || '' }}</p>
      </button>
    </div>

    <div v-if="lessons.length > PER_PAGE" class="lessons-carousel__controls">
      <button
        type="button"
        class="lessons-carousel__btn"
        :disabled="safePage === 0"
        aria-label="Previous lessons"
        @click="page = Math.max(0, page - 1)"
      >
        ← Prev
      </button>
      <span class="lessons-carousel__indicator">
        {{ safePage + 1 }} / {{ totalPages }}
      </span>
      <button
        type="button"
        class="lessons-carousel__btn"
        :disabled="safePage >= totalPages - 1"
        aria-label="Next lessons"
        @click="page = Math.min(totalPages - 1, page + 1)"
      >
        Next →
      </button>
    </div>
  </div>
</template>
