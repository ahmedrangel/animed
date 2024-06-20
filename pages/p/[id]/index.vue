<script setup lang="ts">
const { params } = useRoute();
const { id } = params;
const { data: data } = await useFetch("/api/people/" + id + "/slug") as Record<string, any>;
const slug = fixSlug(data.value?.slug);
if (!slug) {
  throw createError({
    statusCode: 404,
    message: `People not found: '${id}'`,
    fatal: true
  });
}
navigateTo(`/p/${id}/${slug}`, { redirectCode: 301, replace: false });
</script>
