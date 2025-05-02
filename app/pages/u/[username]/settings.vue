<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
const { query } = useRoute();
const { params } = useRoute("u-username");
const { username } = params;

if (!user.value?.username || !loggedIn.value) navigateTo("/");
const { data: connections } = await useFetch("/api/account/connections");

const imported = ref(false);
const importing = ref(false);

const isMyPage = loggedIn.value && user.value?.username?.toLowerCase() === username.toLowerCase();

const isConnected = (id: string) => connections.value?.some(connection => connection.provider === id);
const disconnect = async (id: string) => {
  if (connections.value && connections.value.length <= 1 && !user.value?.password) return alert("You need at least one connection to your account.");
  const acceptedAlert = confirm("Are you sure you want to disconnect this account?");
  if (!acceptedAlert) return;
  const response = await $fetch("/api/account/connections", {
    method: "DELETE",
    query: { provider: id }
  }).catch(() => null);
  if (!response?.success) return console.warn("Failed to disconnect account");
  connections.value = connections.value?.filter(connection => connection.provider !== id);
};
const deleteAccount = async () => {
  const acceptedAlert = confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (!acceptedAlert) return;
  const response = await $fetch("/api/account", {
    method: "DELETE"
  }).catch(() => null);
  if (!response?.success) return console.warn("Failed to delete account");
  clear();
  navigateTo("/login", { external: true });
};

const importList = async () => {
  importing.value = true;
  const finished = await importMyAnimeList();
  if (!finished) {
    importing.value = false;
    return alert("Failed to import your list. Please try again later.");
  }
  importing.value = false;
  imported.value = true;
};
</script>

<template>
  <main>
    <section id="profile" class="text-start py-4">
      <div class="px-2 px-lg-5 px-xl-5 w-100 position-relative">
        <ProfileDropdown />
        <ProfileMenu :username="username" :is-my-page="isMyPage" />
        <div v-if="query?.error" class="pt-4">
          <div class="alert alert-danger" role="alert">
            <small v-if="query.error === 'connection_already_exists' && query.provider">[{{ query.provider }}] Connection already exists in another account.</small>
          </div>
        </div>
        <div class="d-flex flex-column align-items-start justify-content-center gap-2">
          <h5 class="m-0">Connections</h5>
          <div class="d-flex align-items-center justify-content-center w-100">
            <div class="connections">
              <div class="d-flex anime-row flex-wrap gx-0 gx-lg-3 gy-3 justify-content-center">
                <template v-for="(connection, i) in socialConnections" :key="i">
                  <div class="col-12 col-lg-6 text-center">
                    <ButtonComp v-if="!isConnected(connection.id)" v-ripple="{ color: 'rgba(0,0,0,0.4)' }" role="link" class="w-100 px-2 py-3 mb-1" :class="connection.class" :to="connection.to" :icon="connection.icon" external :disabled="connection.disabled">{{ isConnected(connection.id) ? "Disconnect" : "Connect" }} {{ connection.name }}</ButtonComp>
                    <ButtonComp v-else v-ripple="{ color: 'rgba(0,0,0,0.4)' }" role="link" class="w-100 px-2 py-3 mb-1" :class="connection.class" :icon="connection.icon" :disabled="connection.disabled" @click="disconnect(connection.id)">Disconnect {{ connection.name }}</ButtonComp>
                    <small v-if="isConnected(connection.id)" :style="{ color: watchStatus.COMPLETED.color }">Connected</small>
                    <small v-else class="text-muted">Not connected</small>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <h5 class="m-0">Import Watchlist from MyAnimeList</h5>
          <div class="d-flex align-items-center justify-content-center gap-2 mb-3">
            <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-info text-dark" :disabled="imported" @click="importList"><small>Start import</small></ButtonComp>
            <SpinnerLoading v-if="importing" size="1.5rem" />
            <Icon v-if="imported" name="ph:check" class="text-success" size="2rem" />
          </div>
          <h5 class="m-0">DANGER ZONE</h5>
          <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-danger text-dark" @click="deleteAccount"><small>Delete account</small></ButtonComp>
        </div>
      </div>
    </section>
  </main>
</template>
