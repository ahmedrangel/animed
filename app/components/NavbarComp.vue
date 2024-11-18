<script setup lang="ts">
import type { RouteNamedMap } from "vue-router/auto-routes";

const tabs: {
  name: string;
  icon: string;
  route: RouteNamedMap[keyof RouteNamedMap]["path"];
}[] = [
  {
    name: "Home",
    icon: "ph:house-bold",
    route: "/"
  },
  {
    name: "Categories",
    icon: "ph:squares-four-bold",
    route: "/c"
  },
  {
    name: "Airing Schedule",
    icon: "ph:calendar-dots-bold",
    route: "/schedule"
  },
  {
    name: "Search",
    icon: "ph:magnifying-glass-bold",
    route: "/search"
  }
];
</script>

<template>
  <div class="row m-0 flex-lg-row overflow-hidden min-vh-100">
    <div class="sidebar p-0 bg-dark d-lg-block d-none border-end col-1">
      <ul id="menu" class="nav flex-column justify-content-evenly align-items-center min-vh-100 position-fixed z-3">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
          <NuxtLink v-ripple :to="tab.route" class="nav-link p-2 text-body rounded" :title="tab.name">
            <h2 class="mb-0 d-flex align-items-center"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <slot />
    <nav class="navbar bg-dark d-lg-none d-block border-top w-100 position-fixed z-3 bottom-0">
      <ul id="menu" class="nav align-items-center justify-content-evenly">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
          <NuxtLink v-ripple :to="tab.route" class="nav-link p-2 text-body rounded" :title="tab.name">
            <h2 class="mb-0 d-flex align-items-center"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
