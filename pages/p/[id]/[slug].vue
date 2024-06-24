<script setup lang="ts">
const { params } = useRoute();
const { id, slug } = params;
const { data: data, error } = await useFetch("/api/people/" + id, { retry: 0 }) as Record<string, any>;

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.statusMessage,
    fatal: true
  });
}

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
              <h4 class="mb-1 text-primary">{{ staff.name?.userPreferred }}</h4>
              <Icon v-if="staff.name?.native" name="ph:dot-outline-fill" />
              <h4 v-if="staff.name?.native" class="mb-1">{{ staff.name?.native }}</h4>
            </div>
            <h6 v-if="staff.name?.alternative" class="mb-1 text-muted">{{ staff.name?.alternative.join(", ") }}</h6>
          </div>
          <div id="details" class="pt-3 pb-4 d-flex align-items-start justify-content-center anime-row mx-0 flex-wrap px-0">
            <img id="cover" :src="staff?.image?.large" class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-2 img-fluid px-0" style="max-width: 230px;" :alt="staff.name.userPreferred" :title="staff.name.userPreferred" data-aos="fade-in">
            <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-10 pt-4 pt-md-0 px-0 ps-md-4">
              <div class="pb-4">
                <h2 class="text-white">Description</h2>
                <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0">
                  <h6 v-if="staff?.dateOfBirth?.year || staff?.dateOfBirth?.month || staff?.dateOfBirth?.day" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Birth:</span>&nbsp; {{ formatDate(staff?.dateOfBirth?.year, staff?.dateOfBirth?.month, staff?.dateOfBirth?.day) }}
                  </h6>
                  <h6 v-if="staff?.dateOfDeath?.year || staff?.dateOfDeath?.month || staff?.dateOfDeath?.day" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Death:</span>&nbsp; {{ formatDate(staff?.dateOfDeath?.year, staff?.dateOfDeath?.month, staff?.dateOfDeath?.day) }}
                  </h6>
                  <h6 v-if="staff?.age" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Age:</span>&nbsp; {{ staff.age }}
                  </h6>
                  <h6 v-if="staff?.gender" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Gender:</span>&nbsp; {{ staff.gender }}
                  </h6>
                  <h6 v-if="staff?.languageV2" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Language:</span>&nbsp; {{ staff.languageV2 }}
                  </h6>
                  <h6 v-if="staff?.yearsActive[0]" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Years Active:</span>&nbsp; {{ staff.yearsActive[0] }} - {{ staff.yearsActive[1] ? staff.yearsActive[1] : "Present" }}
                  </h6>
                  <h6 v-if="staff?.homeTown" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Hometown:</span>&nbsp; {{ staff.homeTown }}
                  </h6>
                  <h6 v-if="staff?.bloodType" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                    <span class="text-primary">Blood Type:</span>&nbsp; {{ staff.bloodType }}
                  </h6>
                </div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-if="staff.description" class="staff-description" v-html="fixStaffDescription(staff.description)" />
              </div>
            </div>
          </div>
          <hr class="my-4">
          <InfiniteStaffCharacters :data="staff" />
        </div>
      </div>
    </section>
  </main>
</template>
