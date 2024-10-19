<script setup lang="ts">
// Must meet web manifest requirements for desktop
type UserChoice = Promise<{ outcome: "accepted" | "dismissed" }>;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<UserChoice>;
  userChoice: UserChoice;
}

const pwaEvent = ref<BeforeInstallPromptEvent | null>(null);
const pwaAvailable = ref(false);
const pwaStandalone = ref(false);

const pwaInstall = async () => {
  if (!pwaEvent.value) return;
  const result = await pwaEvent.value.prompt();
  const { outcome } = result || {};
  if (outcome === "accepted") pwaAvailable.value = false;
  pwaEvent.value = null;
};

onMounted(() => {
  // @ts-expect-error
  pwaStandalone.value = window?.matchMedia("(display-mode: standalone)")?.matches || window?.navigator?.standalone ? true : false;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    pwaEvent.value = e as BeforeInstallPromptEvent;
    pwaAvailable.value = true;
  });
});
</script>

<template>
  <div v-if="pwaAvailable && !pwaStandalone" @click="pwaInstall()">
    <slot />
  </div>
</template>
