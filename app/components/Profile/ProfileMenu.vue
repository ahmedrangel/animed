<script setup lang="ts">
const props = defineProps<{
  username: string;
  isMyPage?: boolean;
}>();

const tabs = [
  {
    name: "Watchlist",
    route: `/u/${props.username}`,
    enable: true
  },
  {
    name: "Settings",
    route: `/u/${props.username}/settings`,
    enable: props.isMyPage
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
