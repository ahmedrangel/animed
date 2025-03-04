<script setup lang="ts">
const { user, loggedIn } = useUserSession();
if (!loggedIn.value) navigateTo("/login");
if (user.value?.username) navigateTo(`/u/${user.value.username}`);
</script>

<template>
  <main />
</template>
