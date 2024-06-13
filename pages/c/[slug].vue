<script setup lang="ts">
const { params } = useRoute();
const { slug } = params;

const exists = categories.find((c) => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}
const { data: data } = await useFetch("/api/explore?slug=" + slug) as Record<string, any>;
const newlies = data.value.preview.newly.media;
const animes_with_banner = newlies.filter((el: Record<string, string>) => el.bannerImage);

const random_anime = useState(`random-anime-${slug}`, () => {
  return animes_with_banner.length ? getRandomObject(animes_with_banner) : getRandomObject(newlies);
});

onBeforeUnmount(() => {
  random_anime.value = animes_with_banner.length ? getRandomObject(animes_with_banner) : getRandomObject(newlies);
});

useSeoMeta({
  title: data.value.category + " | Categories | " + SITE.name,
  // Open Graph
  ogType: "website",
  ogTitle: data.value.category + " | Categories | " + SITE.name,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/c/${slug}`,
  ogImage: SITE.url + SITE.og_card,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: data.value.category + " | Categories | " + SITE.name,
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/${slug}` }]
});

const upcoming = ref();
const loading = ref();

onMounted(async() => {
  const cat_title = categories.find((c) => fixSlug(c.name) === slug)?.name || null;
  const cat_type = categories.find((c) => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: [cat_title], slug } : { tags: [cat_title], slug } : null;
  loading.value = true;
  upcoming.value = { preview: await getUpcoming(option) };
  loading.value = false;
});
</script>

<template>
  <main>
    <section id="preview">
      <ComponentBanner :anime="random_anime" />
      <ComponentPreviewList :data="data" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <ComponentPreviewList v-if="upcoming" :data="upcoming" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <ComponentLoadingSpinner v-if="loading" />
    </section>
  </main>
</template>
