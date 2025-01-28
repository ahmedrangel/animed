<script setup lang="ts">
const { params } = useRoute("p-id");
const { id } = params;
const { data: data }: { data: Ref<{ id: number, slug: string }> } = await useFetch("/api/character/" + id + "/slug");
const slug = fixSlug(data.value?.slug);
if (!slug) {
  throw createError({
    statusCode: 404,
    message: `Character not found: '${id}'`,
    fatal: true
  });
}
navigateTo(`/ch/${id}/${slug}`, { redirectCode: 301 });
</script>

<template>
  <main />
</template>
