<script setup lang="ts">
const { params } = useRoute("p-id-slug");
const { id, slug } = params;

const character = ref<any>();
const seoTitle = ref<string>(SITE.name);
const seoDescription = ref<string>();
const seoImage = ref<string>();
const loading = ref<boolean>(true);

onMounted(async () => {
  character.value = await getCharacter({ id: Number(id), slug });
  if (!character.value) {
    throw createError({
      statusCode: 404,
      message: `Character not found: '${slug}'`,
      fatal: true
    });
  }
  loading.value = false;
  seoTitle.value = character.value.name.userPreferred + " | " + SITE.name;
  seoDescription.value = character.value.name.userPreferred;
  seoImage.value = character.value.image.large;
});

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  // Open Graph
  ogType: "website",
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: SITE.url + `/ch/${id}/${slug}`,
  ogImage: seoImage,
  // Twitter
  twitterCard: "summary",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
});

useHead({
  link: [{ rel: "canonical", href: SITE.url + `/ch/${id}/${slug}` }]
});
</script>

<template>
  <main>
    <section id="character-page">
      <TransitionGroup name="fade">
        <SpinnerFullScreenLoading v-if="loading" />
        <div v-if="character" class="col px-0 pb-5">
          <div class="px-2 pt-4 pt-lg-5 px-lg-5 px-xl-5 w-100">
            <div class="pt-4 px-0">
              <div class="d-flex align-items-center gap-2">
                <h4 class="mb-1 text-primary">{{ character.name?.userPreferred }}</h4>
                <Icon v-if="character.name?.native" name="ph:dot-outline-fill" />
                <h4 v-if="character.name?.native" class="mb-1">{{ character.name?.native }}</h4>
              </div>
              <h6 v-if="character.name?.alternative" class="mb-1 text-muted">{{ character.name?.alternative.join(", ") }}</h6>
            </div>
            <div id="details" class="pt-3 pb-4 d-flex align-items-start justify-content-center anime-row mx-0 flex-wrap px-0">
              <img id="cover" :src="character?.image?.large" class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-2 img-fluid px-0" style="max-width: 230px;" :alt="character.name.userPreferred" :title="character.name.userPreferred" data-aos="fade-in">
              <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-10 pt-4 pt-md-0 px-0 ps-md-4">
                <div class="pb-4">
                  <h2 class="text-white">Description</h2>
                  <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0">
                    <h6 v-if="character?.dateOfBirth?.year || character?.dateOfBirth?.month || character?.dateOfBirth?.day" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                      <span class="text-primary">Birthday:</span>&nbsp; {{ formatDate(character?.dateOfBirth?.year, character?.dateOfBirth?.month, character?.dateOfBirth?.day) }}
                    </h6>
                    <h6 v-if="character?.age" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                      <span class="text-primary">Age:</span>&nbsp; {{ character.age }}
                    </h6>
                    <h6 v-if="character?.gender" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                      <span class="text-primary">Gender:</span>&nbsp; {{ character.gender }}
                    </h6>
                    <h6 v-if="character?.bloodType" class="mb-2 col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                      <span class="text-primary">Blood Type:</span>&nbsp; {{ character.bloodType }}
                    </h6>
                  </div>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-if="character.description" class="staff-description" v-html="fixStaffDescription(character.description)" />
                </div>
              </div>
            </div>
            <InfiniteCharacterMedias :character-id="character.id" />
          </div>
        </div>
      </TransitionGroup>
    </section>
  </main>
</template>
