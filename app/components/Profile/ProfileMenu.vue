<script setup lang="ts">
const { user } = useUserSession();

const tabs = [
  {
    name: "Watchlist",
    route: `/u/${user.value?.username}`,
    enable: true
  },
  {
    name: "Settings",
    route: `/u/${user.value?.username}/settings`,
    enable: true
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
