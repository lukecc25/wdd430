<script setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { CREATE_LESSON } from '../graphql/operations.js';

const emit = defineEmits(['created', 'cancel', 'error']);

const { mutate: createLesson } = useMutation(CREATE_LESSON);
const saving = ref(false);

const form = ref({
  title: '',
  description: '',
  lessonContent: '',
  difficulty: 'beginner',
  visibility: 'private',
  questions: [emptyQuestion()],
});

function emptyQuestion() {
  return {
    prompt: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
  };
}

function addQuestion() {
  if (form.value.questions.length >= 5) return;
  form.value.questions.push(emptyQuestion());
}

function removeQuestion(index) {
  if (form.value.questions.length <= 1) return;
  form.value.questions.splice(index, 1);
}

async function handleSubmit(event) {
  event.preventDefault();
  saving.value = true;

  try {
    const { data } = await createLesson({
      input: {
        title: form.value.title,
        description: form.value.description,
        lessonContent: form.value.lessonContent,
        difficulty: form.value.difficulty,
        visibility: form.value.visibility,
        questions: form.value.questions.map((q) => ({
          prompt: q.prompt,
          options: q.options,
          correctIndex: Number(q.correctIndex),
          explanation: q.explanation,
        })),
      },
    });
    emit('created', data.createLesson);
  } catch (err) {
    emit('error', err.message || 'Could not save lesson');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="test-creator">
    <button type="button" class="lesson-runner__back-link" @click="emit('cancel')">
      ← Back to lessons
    </button>
    <h2 class="lesson-runner__title">Create your own lesson</h2>
    <p class="test-creator__intro">
      Build a custom quiz. Keep it private for yourself or share it with everyone on CookQuest.
    </p>

    <form class="test-creator__form" @submit="handleSubmit">
      <label class="test-creator__field">
        <span>Title</span>
        <input v-model="form.title" type="text" required maxlength="120" />
      </label>

      <label class="test-creator__field">
        <span>Short description (shown on lesson card)</span>
        <textarea v-model="form.description" rows="2" maxlength="300" />
      </label>

      <label class="test-creator__field">
        <span>Lesson before the quiz (optional)</span>
        <textarea
          v-model="form.lessonContent"
          rows="4"
          maxlength="1200"
          placeholder="Teach a little before the questions. Use blank lines between paragraphs."
        />
      </label>

      <div class="test-creator__row">
        <label class="test-creator__field">
          <span>Difficulty</span>
          <select v-model="form.difficulty">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <fieldset class="test-creator__visibility">
          <legend>Who can see this lesson?</legend>
          <label>
            <input v-model="form.visibility" type="radio" value="private" />
            <span>Private — only you</span>
          </label>
          <label>
            <input v-model="form.visibility" type="radio" value="public" />
            <span>Share with site — everyone signed in</span>
          </label>
        </fieldset>
      </div>

      <div
        v-for="(question, qi) in form.questions"
        :key="qi"
        class="lesson-question-box"
      >
        <div class="test-creator__question-head">
          <h3 class="lesson-question">Question {{ qi + 1 }}</h3>
          <button
            v-if="form.questions.length > 1"
            type="button"
            class="test-creator__remove"
            @click="removeQuestion(qi)"
          >
            Remove
          </button>
        </div>

        <label class="test-creator__field">
          <span>Prompt</span>
          <input v-model="question.prompt" type="text" required />
        </label>

        <div class="test-creator__options">
          <label
            v-for="(_, oi) in question.options"
            :key="oi"
            class="test-creator__option"
          >
            <input
              v-model="question.correctIndex"
              type="radio"
              :name="`correct-${qi}`"
              :value="oi"
            />
            <input
              v-model="question.options[oi]"
              type="text"
              required
              :placeholder="`Option ${oi + 1}`"
            />
          </label>
        </div>

        <label class="test-creator__field">
          <span>Explanation (optional)</span>
          <input v-model="question.explanation" type="text" />
        </label>
      </div>

      <div class="test-creator__actions">
        <button
          v-if="form.questions.length < 5"
          type="button"
          class="test-creator__secondary"
          @click="addQuestion"
        >
          + Add question
        </button>
        <button type="submit" class="test-creator__submit" :disabled="saving">
          {{
            saving
              ? 'Saving…'
              : form.visibility === 'public'
                ? 'Publish lesson'
                : 'Save private lesson'
          }}
        </button>
      </div>
    </form>
  </div>
</template>
