<script setup lang="ts">
const { params } = useRoute("u-username");
const { username } = params;
const { data: result, error } = await useFetch(`/api/account/${username}`);
if (error.value) {
  throw createError({
    statusCode: 404,
    message: `User not found: ${username}`,
    fatal: true
  });
}
const { clear, user } = useUserSession();
const currentUser = {
  loggedIn: user.value?.username?.toLocaleLowerCase() === username.toLowerCase() && String(result.value?.username).toLowerCase() === username.toLowerCase(),
  ...result.value
};

const logOut = () => {
  clear();
  navigateTo("/login", { external: true });
};
</script>

<template>
  <main>
    <section id="profile" class="text-center py-5">
      <h4 class="mb-3">{{ currentUser.username }}</h4>
      <ButtonComp v-if="currentUser.loggedIn" v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-danger text-dark" @click="logOut">Logout</ButtonComp>
    </section>
  </main>
</template>

<style scoped>

</style>
