<script setup lang="ts">
const tabs = [
  {
    icon: "ph:house-bold",
    route: "/"
  }
];
</script>

<template>
  <div class="row m-0 flex-nowrap">
    <div class="sidebar p-0 bg-dark d-md-block d-none text-white border-end">
      <div class="nav d-flex align-items-center justify-content-center text-white min-vh-100 position-fixed z-1">
        <ul id="menu" class="nav justify-content-center align-items-center">
          <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
            <NuxtLink :to="tab.route" class="nav-link align-middle px-0 text-white">
              <h2 class="mb-0"><Icon :name="tab.icon" /></h2>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="sidebar min-vh-100 invisible" />
    </div>
    <nav class="navbar fixed-bottom bg-dark d-md-none d-block text-white border-top">
      <div class="d-flex align-items-center justify-content-center">
        <ul id="menu" class="nav align-items-center">
          <li v-for="(tab, i) of tabs" :key="i" class="nav-item">
            <NuxtLink :to="tab.route" class="nav-link align-middle px-0 text-white">
              <h2 class="mb-0"><Icon :name="tab.icon" /></h2>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
    <slot />
  </div>
</template>
