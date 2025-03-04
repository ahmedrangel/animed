<script setup lang="ts">
const { params } = useRoute("u-username");
const { username } = params;
const { data: result, error } = await useFetch(`/api/account/${username}`);
const { clear, user, loggedIn } = useUserSession();
const logOut = () => {
  clear();
  navigateTo("/login", { external: true });
};

if (error.value && loggedIn.value && user.value?.username?.toLowerCase() === username.toLowerCase()) {
  clear();
  navigateTo("/login", { external: true });
}

if (error.value) {
  throw createError({
    statusCode: 404,
    message: `User not found: ${username}`,
    fatal: true
  });
}

const { data: userWatchlist } = await useFetch("/api/watchlist", {
  query: { userId: result.value?.id },
  key: `watchlist-${result.value?.id}`,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const currentUser = {
  loggedIn: user.value?.username?.toLocaleLowerCase() === username.toLowerCase() && String(result.value?.username).toLowerCase() === username.toLowerCase(),
  ...result.value
};
</script>

<template>
  <main>
    <section id="profile" class="text-center py-5">
      <h4 class="mb-3">{{ currentUser.username }}</h4>
      <h6>{{ userWatchlist }}</h6>
      <ButtonComp v-if="currentUser.loggedIn" v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-danger text-dark" @click="logOut">Logout</ButtonComp>
    </section>
  </main>
</template>

<style scoped>

</style>
