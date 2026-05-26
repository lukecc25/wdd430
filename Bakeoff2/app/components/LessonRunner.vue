<script setup>
const props = defineProps({
  lessonId: { type: String, required: true },
});

const emit = defineEmits(['error', 'submitted', 'close']);

const authedFetch = useAuthedFetch();
const lesson = ref(null);
const answers = ref({});
const result = ref(null);

watch(
  () => props.lessonId,
  async (lessonId) => {
    if (!lessonId) {
      lesson.value = null;
      result.value = null;
      return;
    }

    try {
      const data = await $fetch(`/api/lessons/${lessonId}`);
      lesson.value = data;
      answers.value = {};
      result.value = null;
    } catch (err) {
      const status = err?.statusCode || err?.status;
      emit('error', `Could not load lesson${status ? ` (${status})` : ''}`);
    }
  },
  { immediate: true }
);

const perfect = computed(
  () => result.value && result.value.score === result.value.totalPossible
);

const percent = computed(() => {
  if (!result.value?.totalPossible) return 0;
  return Math.round((result.value.score / result.value.totalPossible) * 100);
});

function handleBackToLessons() {
  result.value = null;
  emit('close');
}

function handleRedoLesson() {
  result.value = null;
  answers.value = {};
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!lesson.value) return;

  const answerList = lesson.value.questions.map((_, qi) => {
    const val = answers.value[qi];
    return val === undefined ? -1 : Number(val);
  });

  try {
    const data = await authedFetch(`/api/lessons/${props.lessonId}/attempts`, {
      method: 'POST',
      body: { answers: answerList },
    });
    result.value = data;
    emit('submitted');
  } catch (err) {
    const status = err?.statusCode || err?.status;
    emit('error', `Submit failed${status ? ` (${status})` : ''}`);
  }
}
</script>

<template>
  <div v-if="!lesson" class="lesson-runner">
    <p class="muted">Loading lesson…</p>
  </div>

  <div
    v-else-if="result"
    class="lesson-runner lesson-runner--complete"
  >
    <h2 class="lesson-runner__title">{{ lesson.title }}</h2>

    <div :class="['lesson-results', perfect ? 'lesson-results--perfect' : '']">
      <template v-if="perfect">
        <p class="lesson-results__congrats">Congratulations, you got 100%!</p>
        <p class="lesson-results__points">
          You earned <strong>{{ result.score }}</strong> points.
        </p>
      </template>
      <template v-else>
        <p class="lesson-results__score">You scored {{ percent }}%</p>
        <p class="lesson-results__points">
          You earned <strong>{{ result.score }}</strong> of
          {{ result.totalPossible }} points.
        </p>
      </template>

      <ul class="feedback">
        <li
          v-for="(f, i) in result.feedback"
          :key="i"
          :class="['feedback-item', f.correct ? 'correct' : 'incorrect']"
        >
          Q{{ i + 1 }}: {{ f.correct ? '✓' : '✗' }} (+{{ f.points }}) — {{ f.explanation }}
        </li>
      </ul>

      <div class="lesson-results__actions">
        <button type="button" class="lesson-results__back" @click="handleBackToLessons">
          Back to lessons
        </button>
        <button type="button" class="lesson-results__redo" @click="handleRedoLesson">
          Redo lesson
        </button>
      </div>
    </div>
  </div>

  <div v-else class="lesson-runner">
    <button type="button" class="lesson-runner__back-link" @click="handleBackToLessons">
      ← Back to lessons
    </button>
    <h2 class="lesson-runner__title">{{ lesson.title }}</h2>
    <form @submit="handleSubmit">
      <fieldset
        v-for="(q, qi) in lesson.questions"
        :key="q._id || qi"
        class="lesson-question-box"
      >
        <h3 class="lesson-question">{{ q.prompt }}</h3>
        <label v-for="(opt, oi) in q.options" :key="oi" :for="`q${qi}_o${oi}`">
          <input
            :id="`q${qi}_o${oi}`"
            v-model="answers[qi]"
            type="radio"
            :name="`q${qi}`"
            :value="oi"
            required
          />
          <span>{{ opt }}</span>
        </label>
      </fieldset>
      <button type="submit">Submit answers</button>
    </form>
  </div>
</template>
