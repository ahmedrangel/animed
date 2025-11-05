<script setup lang="ts">
const { params } = useRoute("p-id");
const { id } = params;

onMounted(async () => {
  const character = await getCharacter({ id: Number(id) }).catch(() => null);
  if (!character) {
    throw createError({
      statusCode: 404,
      message: `Character not found: '${id}'`,
      fatal: true
    });
  }
  navigateTo(`/ch/${id}/${character.slug}`, { redirectCode: 301 });
});
</script>

<template>
  <main />
</template>
