<script setup>
import { ref, computed, watch } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { LESSON_QUERY, SUBMIT_ATTEMPT } from '../graphql/operations.js';

const props = defineProps({
  lessonId: { type: String, required: true },
});

const emit = defineEmits(['error', 'submitted', 'close']);

const answers = ref({});
const result = ref(null);
const phase = ref('intro');

const { result: lessonResult, error: lessonError, loading } = useQuery(
  LESSON_QUERY,
  () => ({ id: props.lessonId }),
  () => ({
    enabled: !!props.lessonId,
    fetchPolicy: 'network-only',
  })
);

const lesson = computed(() => lessonResult.value?.lesson);

const { mutate: submitAttempt } = useMutation(SUBMIT_ATTEMPT);

function introText(currentLesson) {
  const content = String(currentLesson?.lessonContent || '').trim();
  if (content) return content;
  return String(currentLesson?.description || '').trim();
}

function resetLessonState() {
  answers.value = {};
  result.value = null;
  phase.value = 'intro';
}

watch(
  () => props.lessonId,
  (id, prevId) => {
    if (id !== prevId) resetLessonState();
  }
);

watch(lesson, (data) => {
  if (data && !introText(data)) {
    phase.value = 'quiz';
  }
});

watch(lessonError, (err) => {
  if (!err) return;
  const msg = err.message || 'Unknown error';
  if (/failed to fetch|network error|load failed/i.test(msg)) {
    emit(
      'error',
      'Could not load lesson — is the GraphQL server running? Start it with: npm run dev:server (in Bakeoff3/server)'
    );
    return;
  }
  emit('error', `Could not load lesson: ${msg}`);
});

const perfect = computed(
  () => result.value && result.value.score === result.value.totalPossible
);

const percent = computed(() => {
  if (!result.value?.totalPossible) return 0;
  return Math.round((result.value.score / result.value.totalPossible) * 100);
});

function handleBackToLessons() {
  resetLessonState();
  emit('close');
}

function handleStartQuiz() {
  phase.value = 'quiz';
}

function handleRedoLesson() {
  result.value = null;
  answers.value = {};
  phase.value = introText(lesson.value) ? 'intro' : 'quiz';
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!lesson.value) return;

  const answerList = lesson.value.questions.map((_, qi) => {
    const val = answers.value[qi];
    return val === undefined ? -1 : Number(val);
  });

  try {
    const { data } = await submitAttempt({
      lessonId: props.lessonId,
      answers: answerList,
    });
    result.value = data.submitAttempt;
    emit('submitted');
  } catch (err) {
    emit('error', `Submit failed: ${err.message}`);
  }
}
</script>

<template>
  <div v-if="loading && !lesson" class="lesson-runner">
    <p class="muted">Loading lesson...</p>
  </div>

  <div v-else-if="result" class="lesson-runner">
    <h2 class="lesson-runner__title">{{ lesson?.title }}</h2>
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
          Q{{ i + 1 }}: {{ f.correct ? 'Correct' : 'Incorrect' }} (+{{ f.points }}) — {{ f.explanation }}
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

  <div v-else-if="lesson && phase === 'intro'" class="lesson-runner">
    <button type="button" class="lesson-runner__back-link" @click="handleBackToLessons">
      Back to lessons
    </button>
    <h2 class="lesson-runner__title">{{ lesson.title }}</h2>
    <div class="lesson-intro">
      <p class="lesson-intro__label">Before the quiz</p>
      <p
        v-for="(paragraph, index) in introText(lesson).split('\n\n')"
        :key="index"
        class="lesson-intro__text"
      >
        {{ paragraph }}
      </p>
    </div>
    <button type="button" class="lesson-intro__start" @click="handleStartQuiz">
      Start quiz
    </button>
  </div>

  <div v-else-if="lesson" class="lesson-runner">
    <button type="button" class="lesson-runner__back-link" @click="handleBackToLessons">
      Back to lessons
    </button>
    <h2 class="lesson-runner__title">{{ lesson.title }}</h2>
    <p class="muted lesson-quiz__hint">Quiz time — answer every question below.</p>
    <form @submit="handleSubmit">
      <fieldset
        v-for="(q, qi) in lesson.questions"
        :key="q.id || qi"
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
