<script setup>
import { computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { LESSONS_QUERY, PROGRESS_QUERY } from '../graphql/operations.js';
import { useFirebaseAuth } from '../composables/useFirebaseAuth.js';
import { useClientMounted } from '../composables/useClientMounted.js';
import CookQuestApp from '../components/CookQuestApp.vue';

const { user, ready } = useFirebaseAuth();
const { isClientMounted } = useClientMounted();

const lessonsQuery = useQuery(LESSONS_QUERY, null, () => ({
  enabled: isClientMounted.value && ready.value,
  fetchPolicy: 'network-only',
}));

const progressQuery = useQuery(PROGRESS_QUERY, null, () => ({
  enabled: isClientMounted.value && ready.value && !!user.value,
  fetchPolicy: 'network-only',
}));

const lessons = computed(() => lessonsQuery.result.value?.lessons ?? []);

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
</script>

<template>
  <CookQuestApp
    :lessons="lessons"
    :progress="progress"
    :loading="!isClientMounted || !ready || lessonsQuery.loading.value"
    @refresh="refetchHome"
  />
</template>
