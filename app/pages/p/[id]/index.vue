<script setup lang="ts">
const { params } = useRoute("p-id");
const { id } = params;

onMounted(async () => {
  const staff = await getStaff({ id: Number(id) });
  if (!staff) {
    throw createError({
      statusCode: 404,
      message: `People not found: '${id}'`,
      fatal: true
    });
  }
  navigateTo(`/p/${id}/${staff.slug}`, { redirectCode: 301 });
});
</script>

<template>
  <main />
</template>
