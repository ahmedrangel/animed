<script setup lang="ts">
const { params } = useRoute();
const { id, slug } = params;
const { data: data } = await useFetch("/api/people/" + id) as Record<string, any>;

const _slug = fixSlug(data.value.name.userPreferred);
if (String(slug).toLowerCase() !== _slug) {
  throw createError({
    statusCode: 404,
    message: `People not found: '${slug}'`,
    fatal: true
  });
}

const staff = data.value;

useSeoMeta({
  title: staff.name.userPreferred + " | " + SITE.name,
  description: staff.name.userPreferred,
  // Open Graph
  ogType: "website",
  ogTitle: staff.name.userPreferred + " | " + SITE.name,
  ogDescription: staff.name.userPreferred,
  ogSiteName: SITE.name,
  ogUrl: SITE.url + `/p/${id}/${slug}`,
  ogImage: staff.image.large,
  // Twitter
  twitterCard: "summary",
  twitterTitle: staff.name.userPreferred + " | " + SITE.name,
  twitterDescription: staff.name.userPreferred
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/p/${id}/${slug}` }]
});
</script>

<template>
  <main>
    <section id="people-page">
      <div class="col px-0 pb-5">
        <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
          <div class="pt-4 px-0">
            <div class="d-flex align-items-center gap-2">
              <h4 class="mb-1 text-primary">{{ staff.name.userPreferred }}</h4>
              <Icon v-if="staff.name.native" name="ph:dot-outline-fill" />
              <h4 v-if="staff.name.native" class="mb-1">{{ staff.name.native }}</h4>
            </div>
            <h6 v-if="staff.name.alternative" class="mb-1 text-muted">{{ staff.name.alternative.join(", ") }}</h6>
          </div>
          <div id="details" class="pt-3 pb-4 d-flex align-items-start justify-content-center anime-row mx-0 flex-wrap px-0">
            <img id="cover" :src="staff?.image?.large" class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-2 img-fluid px-0" style="max-width: 300px;" :alt="staff.name.userPreferred" :title="staff.name.userPreferred">
            <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-10 pt-4 pt-md-0 px-0 ps-md-4">
              <div v-if="staff.description" class="pb-4">
                <h2 class="text-white">Description</h2>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <h6 class="mb-0 fw-normal" v-html="fixStaffDescription(staff.description)" />
              </div>
              <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0">
                <!--
                <h6 v-if="anime.status" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                  <span class="text-primary">Status:</span>&nbsp; {{ anime.status.toLowerCase() }}
                </h6>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>