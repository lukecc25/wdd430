<script setup>
const { isLoaded, userId } = useAuth();
const authedFetch = useAuthedFetch();

async function fetchHomeData() {
  let lessons = [];
  try {
    lessons = await $fetch('/api/lessons');
  } catch (err) {
    console.error('[home] /api/lessons failed:', err?.data?.message || err?.message || err);
  }

  let progress = {};

  if (import.meta.server) {
    const event = useRequestEvent();
    const { getClerkUserIdFromEvent } = await import('~~/server/lib/auth.js');
    const { getProgressByClerkUserId } = await import('~~/server/lib/lessonData.js');
    const clerkUserId = await getClerkUserIdFromEvent(event);
    if (clerkUserId) {
      progress = await getProgressByClerkUserId(clerkUserId);
    }
  } else if (userId.value) {
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

watch([isLoaded, userId], ([loaded, id]) => {
  if (loaded && id) refreshHome();
}, { immediate: true });
</script>

<template>
  <CookQuestApp
    :lessons="homeData?.lessons ?? []"
    :progress="homeData?.progress ?? {}"
  />
</template>
