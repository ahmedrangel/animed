<script setup lang="ts">
const props = defineProps<{
  animeId: string;
  slug: string;
  episodes?: boolean;
}>();

const tabs = [
  {
    name: "Overview",
    route: `/a/${props.animeId}/${props.slug}`,
    enable: true
  },
  {
    name: "Characters",
    route: `/a/${props.animeId}/${props.slug}/characters`,
    enable: true
  },
  {
    name: "Episodes",
    route: `/a/${props.animeId}/${props.slug}/episodes`,
    enable: props.episodes ? true : false
  }
];
</script>

<template>
  <nav id="anime-nav" class="nav justify-content-center gap-4">
    <template v-for="(tab, i) of tabs" :key="i">
      <NuxtLink v-if="tab.enable" v-ripple class="nav-link px-2 py-0 text-white rounded" aria-current="page" :to="tab.route" :title="tab.name">
        <h5 class="py-2 mb-0">{{ tab.name.toUpperCase() }}</h5>
      </NuxtLink>
    </template>
  </nav>
</template>
