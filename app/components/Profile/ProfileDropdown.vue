<script setup lang="ts">
const { params } = useRoute("u-username");
const { username } = params;
const { clear, user, loggedIn } = useUserSession();
const logOut = () => {
  clear();
  navigateTo("/login", { external: true });
};
</script>

<template>
  <div v-if="loggedIn" class="mb-2 d-flex justify-content-end align-items-center">
    <button v-ripple class="d-flex align-items-center gap-1 btn bg-secondary dropdown-toggle border p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      <div class="d-flex align-items-center gap-1">
        <Icon name="ph:user-bold" />
        <span>{{ user?.username }}</span>
      </div>
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <ButtonComp v-ripple class="dropdown-item" icon="ph:sign-out-bold" @click="logOut">Logout</ButtonComp>
      </li>
    </ul>
  </div>
  <div v-else class="mb-0 d-flex justify-content-end align-items-center">
    <div class="bg-secondary d-flex justify-content-center align-items-center gap-1 rounded p-2">
      <Icon name="ph:user-bold" />
      <h6 class="fw-normal rounded mb-0">{{ username }}</h6>
    </div>
  </div>
</template>
