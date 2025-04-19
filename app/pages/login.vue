<script setup lang="ts">
const form = useFormState({
  username: "",
  password: ""
});

watch(form, (value) => {
  form.value.username = fixUsername(value.username);
}, { deep: true });
</script>

<template>
  <main>
    <section id="login">
      <h3 class="px-4 py-4 mb-0 bg-dark border-bottom">Login</h3>
      <div class="container-md text-align-center py-5 px-2">
        <div class="d-flex flex-column align-items-center justify-content-center mb-3">
          <div class="alert alert-warning" role="alert">
            <small>The login feature is currently in development</small>
          </div>
          <div class="user-input d-flex justify-content-center align-items-center bg-secondary mb-3">
            <h4 class="mb-0"><Icon name="ph:user-bold" class="mx-4" /></h4>
            <input v-model="form.username" type="text" class="w-100 py-3 border-0 bg-transparent" placeholder="Username">
          </div>
          <div class="user-input d-flex justify-content-center align-items-center bg-secondary mb-3">
            <h4 class="mb-0"><Icon name="ph:password-bold" class="mx-4" /></h4>
            <input type="password" class="w-100 py-3 border-0 bg-transparent" placeholder="Password">
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-center w-100">
          <div class="connections">
            <div class="d-flex anime-row flex-wrap gx-0 gx-lg-3 gy-3 justify-content-center">
              <template v-for="(connection, i) in socialConnections" :key="i">
                <div class="col-12 col-lg-6">
                  <ButtonComp v-ripple="{ color: 'rgba(0,0,0,0.4)' }" role="link" class="w-100 px-2 py-3" :class="connection.class" :to="connection.to" :icon="connection.icon" external :disabled="connection.disabled">Continue with {{ connection.name }}</ButtonComp>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
