<script setup lang="ts">
import type { RouteNamedMap } from "vue-router/auto-routes";

const { loggedIn, user } = useUserSession();

const tabs: ComputedRef<{
  name: string;
  icon: string;
  route: RouteNamedMap[keyof RouteNamedMap]["path"] | `/u/${string}`;
}[]> = computed(() => ([
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
  },
  {
    name: loggedIn.value ? "Profile" : "Login",
    icon: "ph:user-circle-bold",
    route: loggedIn.value && user.value ? `/u/${user.value.username}` : "/login"
  }
]));
</script>

<template>
  <div class="row m-0 flex-lg-row overflow-hidden min-vh-100">
    <div class="sidebar p-0 d-lg-block d-none col-1">
      <ul id="menu" class="nav flex-column justify-content-evenly align-items-center min-vh-100 position-fixed z-3">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item w-100 d-flex flex-grow-1">
          <NuxtLink v-ripple :to="tab.route" class="nav-link p-0 text-body d-flex justify-content-center align-items-center w-100 border-end bg-dark" :title="tab.name">
            <h2 class="mb-0 d-flex align-items-center"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <slot />
    <nav class="navbar d-lg-none d-block w-100 position-fixed z-3 bottom-0 p-0">
      <ul id="menu" class="nav align-items-center justify-content-evenly">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item flex-fill">
          <NuxtLink v-ripple :to="tab.route" class="nav-link py-3 px-0 text-body border-top bg-dark" :title="tab.name">
            <h2 class="mb-0 d-flex align-items-center justify-content-center"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.nav-link:hover {
  background-color: var(--bs-secondary)!important;
}
.nav-link.router-link-active {
  background-color: var(--bs-body-bg)!important;
}
</style>
