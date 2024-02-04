<script setup lang="ts">
const tabs = [
  {
    icon: "ph:house-bold",
    route: "/"
  },
  {
    icon: "ph:squares-four-bold",
    route: "/c"
  },
  {
    icon: "ph:magnifying-glass-bold",
    route: "/search"
  }
];
</script>

<template>
  <div class="row m-0 flex-nowrap">
    <div class="sidebar p-0 bg-dark d-md-block d-none text-white border-end">
      <ul id="menu" class="nav flex-column justify-content-evenly align-items-center text-white min-vh-100 position-fixed z-1">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
          <NuxtLink :to="tab.route" class="nav-link align-middle p-0 text-white">
            <h2 class="mb-0"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
      <div class="sidebar min-vh-100 invisible" />
    </div>
    <nav class="navbar fixed-bottom bg-dark d-md-none d-block text-white border-top w-100">
      <ul id="menu" class="nav align-items-center justify-content-evenly">
        <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
          <NuxtLink :to="tab.route" class="nav-link align-middle px-0 text-white">
            <h2 class="mb-0"><Icon :name="tab.icon" /></h2>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
  </div>
</template>
