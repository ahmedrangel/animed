<script setup lang="ts">
const props = defineProps({
  animeId: { type: String, required: true },
  slug: { type: String, required: true },
});
</script>

<template>
  <nav id="anime-nav" class="nav justify-content-center gap-4">
    <NuxtLink class="nav-link px-1 py-0 text-white" aria-current="page" :to="`/a/${props.animeId}/${props.slug}`">
      <h5 class="py-2 mb-0">OVERVIEW</h5>
    </NuxtLink>
    <NuxtLink class="nav-link active px-1 py-0 text-white" :to="`/a/${props.animeId}/${props.slug}/characters`">
      <h5 class="py-2 mb-0">CHARACTERS</h5>
    </NuxtLink>
    <NuxtLink class="nav-link px-1 py-0 text-white disabled" :to="`/a/${props.animeId}/${props.slug}/episodes`">
      <h5 class="py-2 mb-0">EPISODES</h5>
    </NuxtLink>
  </nav>
</template>