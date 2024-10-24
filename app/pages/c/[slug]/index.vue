<script setup lang="ts">
const { params } = useRoute("c-slug");
const { slug } = params;

if (slug === "all") navigateTo("/", { redirectCode: 301 });

const exists = categories.find(c => fixSlug(c.name) === slug) || null;

if (!exists) {
  throw createError({
    statusCode: 404,
    message: `Category not found: '${slug}'`,
    fatal: true
  });
}

const { data: data, error }: { data: Ref<AnimePreviewList>, error: Ref<FetchError> } = await useFetch("/api/explore?slug=" + slug);

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.statusMessage,
    fatal: true
  });
}

const newlies = data.value?.preview.newly?.media || data.value.preview?.trending?.media || data.value.preview?.newly?.media as Anime[];
const animesWithBanner = newlies?.filter(el => el.bannerImage) || newlies;

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
  twitterTitle: data.value.category + " | Categories | " + SITE.name
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/c/${slug}` }]
});

const upcoming: Ref<AnimePreviewList | undefined> = ref();
const loading: Ref<boolean> = ref(false);

onMounted(async () => {
  const cat_title = categories.find(c => fixSlug(c.name) === slug)!.name;
  const cat_type = categories.find(c => fixSlug(c.name) === slug)?.type;
  const option = cat_type === "genre" ? { genres: [cat_title] } : { tags: [cat_title] };
  loading.value = true;
  upcoming.value = {
    preview: {
      upcoming: {
        ...(await getUpcoming({ ...option, slug, perPage: 12 })).data,
        route: `/c/${slug}/upcoming`
      }
    }
  };
  loading.value = false;
});
</script>

<template>
  <main>
    <section v-if="exists && data" id="preview">
      <BannerDetailed :anime="animesWithBanner" />
      <AnimePreviewList :data="data" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <AnimePreviewList v-if="upcoming" :data="upcoming" class="px-2 pt-4 pt-lg-5 px-xl-5 w-100" />
      <SpinnerLoading v-if="loading" />
    </section>
  </main>
</template>
