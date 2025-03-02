<script setup lang="ts">
const { clear, user, loggedIn } = useUserSession();
if (user.value?.username || !loggedIn.value) navigateTo("/");

const form = useFormState({
  username: ""
});

const errorMessage = ref();
const showErrorMessage = ref(false);

const loadingLookup = ref(false);
const lookupUsername = async () => {
  const checkUser = await $fetch<{ success: boolean }>("/api/account", {
    query: { username: form.value.username }
  }).catch(e => e.data);
  if (!checkUser?.success) {
    errorMessage.value = checkUser?.data?.message;
    showErrorMessage.value = true;
    return false;
  }
  return true;
};

const patchAccount = async () => {
  const lookup = await lookupUsername();
  if (!lookup) return;

  const api = await $fetch<{ success: boolean }>("/api/account", {
    method: "PATCH",
    body: form.value
  }).catch(() => null);
  if (!api?.success) return console.warn("Failed to update account");
  navigateTo("/", { external: true });
};

const logOut = () => {
  clear();
  navigateTo("/login", { external: true });
};

watch(form, (value) => {
  form.value.username = fixUsername(value.username);
  if (form.value.username) {
    loadingLookup.value = true;
    showErrorMessage.value = false;
    errorMessage.value = null;
  }
}, { deep: true });

watchDebounced(form, async () => {
  if (form.value.username) {
    await lookupUsername();
    loadingLookup.value = false;
  }
}, { debounce: 1000, deep: true });
</script>

<template>
  <main>
    <section id="setup-profile" class="text-center container py-5">
      <h2 class="mb-3">Please, set your username to continue</h2>
      <form @submit.prevent="patchAccount">
        <div class="d-flex justify-content-center align-items-center bg-secondary w-100 mb-3">
          <h4 class="mb-0"><Icon name="ph:user-bold" class="mx-4" /></h4>
          <input v-model="form.username" type="text" class="w-100 py-3 border-0 bg-transparent" placeholder="Username">
          <h4 v-if="form.username" class="mb-0"><Icon :name=" loadingLookup ? 'line-md:loading-twotone-loop' : errorMessage ? 'ph:x-bold' : 'ph:check-bold'" class="mx-4" /></h4>
        </div>
        <Transition name="fadepage">
          <div v-if="showErrorMessage" class="alert alert-danger" role="alert">
            <div class="position-relative d-flex align-items-center justify-content-center h6 mb-0">
              <span>{{ errorMessage }}</span>
              <Icon name="ph:x-circle-bold" class="position-absolute end-0" role="button" @click="showErrorMessage = false" />
            </div>
          </div>
        </Transition>
        <div class="d-flex flex-column gap-3">
          <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-primary text-dark" type="submit" :disabled="!form.username || loadingLookup || errorMessage" title="Save" icon="ph:floppy-disk-bold">
            Save
          </ButtonComp>
          <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" class="bg-danger text-dark" title="Log Out" icon="ph:sign-out-bold" @click="logOut">
            Log Out
          </ButtonComp>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
@media only screen and (width >= 992px) {
  #setup-profile {
    width: 50%;
  }
}
</style>
