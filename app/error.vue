<script setup>
const { statusCode, statusMessage, message } = useError().value;
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="bg-body p-5 rounded-3 shadow">
      <h1>Error <span class="text-primary">{{ statusCode }}</span></h1>
      <h5>{{ "error_occurred" }}: {{ message || statusMessage }}</h5>
      <p>{{ "go_back" }}: <NuxtLink to="/" class="text-decoration-underline">link</NuxtLink></p>
    </div>
  </div>
</template>
