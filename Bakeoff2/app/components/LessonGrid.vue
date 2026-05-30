<script setup>
const PER_PAGE = 3;

const props = defineProps({
  lessons: { type: Array, default: () => [] },
  progress: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['selectLesson']);

const page = ref(0);

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

function lessonProgress(lesson) {
  return props.progress[lessonKey(lesson)];
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
          lessonProgress(lesson) ? 'lesson-card--completed' : '',
        ]"
        @click="emit('selectLesson', lessonKey(lesson))"
      >
        <span v-if="lessonProgress(lesson)" class="lesson-card__completed">
          Completed
        </span>
        <span v-if="lesson.isCommunity" class="lesson-card__badge lesson-card__badge--community">
          Shared
        </span>
        <span
          v-else-if="!lesson.isOfficial && lesson.visibility === 'private'"
          class="lesson-card__badge lesson-card__badge--private"
        >
          Private
        </span>
        <strong>{{ lesson.title }}</strong>
        <span class="muted">{{ lesson.difficulty }}</span>
        <span v-if="lesson.authorName && lesson.isCommunity" class="lesson-card__author muted">
          by {{ lesson.authorName }}
        </span>
        <span v-if="lessonProgress(lesson)" class="lesson-card__score">
          Score: {{ lessonProgress(lesson).score }} /
          {{ lessonProgress(lesson).totalPossible }}
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
