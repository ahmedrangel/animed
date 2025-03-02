<script setup lang="ts">
const { params } = useRoute("u-username");
const { username } = params;
const { clear, loggedIn, user } = useUserSession();
if (!loggedIn.value) navigateTo("/");
const sameUser = user.value?.username === username;
</script>

<template>
  <main>
    <section id="profile" class="text-center py-5">
      <h4 class="mb-3">{{ username }}</h4>
      <ButtonComp v-if="sameUser" role="link" to="/" class="bg-danger text-dark" @click="clear">Logout</ButtonComp>
    </section>
  </main>
</template>
