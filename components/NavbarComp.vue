<script setup lang="ts">
const tabs = [
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
    name: "Search",
    icon: "ph:magnifying-glass-bold",
    route: "/search"
  }
];
</script>

<template>
  <div class="row m-0 flex-nowrap">
    <div class="sidebar p-0 bg-dark d-lg-block d-none border-end">
      <ul id="menu" class="nav flex-column justify-content-evenly align-items-center min-vh-100 position-fixed z-1">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
          <NuxtLink :to="tab.route" class="nav-link align-middle p-2 text-body" :title="tab.name">
            <h2 class="mb-0"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
      <div class="sidebar min-vh-100 invisible" />
    </div>
    <nav class="navbar fixed-bottom bg-dark d-lg-none d-block border-top w-100">
      <ul id="menu" class="nav align-items-center justify-content-evenly">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
          <NuxtLink :to="tab.route" class="nav-link align-middle p-2 text-body" :title="tab.name">
            <h2 class="mb-0"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
  </div>
</template>
