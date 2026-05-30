<script setup>
const { isLoaded, userId } = useAuth();
const authedFetch = useAuthedFetch();

async function fetchHomeData() {
  let lessons = [];
  let progress = {};

  try {
    if (userId.value) {
      lessons = await authedFetch('/api/lessons');
    } else {
      lessons = await $fetch('/api/lessons');
    }
  } catch (err) {
    console.error('[home] /api/lessons failed:', err?.data?.message || err?.message || err);
  }

  if (userId.value) {
    try {
      const data = await authedFetch('/api/lessons/progress');
      progress = data.progress || {};
    } catch {
      // keep empty progress
    }
  }

  return {
    lessons: normalizeLessons(lessons),
    progress,
  };
}

const { data: homeData, refresh: refreshHome } = await useAsyncData('home', fetchHomeData, {
  default: () => ({ lessons: [], progress: {} }),
});

watch(isLoaded, (loaded) => {
  if (loaded) refreshHome();
}, { immediate: true });
</script>

<template>
  <CookQuestApp
    :lessons="homeData?.lessons ?? []"
    :progress="homeData?.progress ?? {}"
  />
</template>
