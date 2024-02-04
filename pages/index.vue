<script setup lang="ts">
const { data: data } = await useFetch("/api/explore/") as Record<string, any>;
const popular = data.value.preview[0].data;
</script>

<template>
  <section id="preview">
    <ComponentBanner :anime="popular[0]" />
    <div class="px-2 py-4 py-lg-5 px-xl-5 w-100">
      <div v-for="(d, i) of data.preview" :key="i" of data class="mb-5">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">{{ d.title }}</h3>
          <NuxtLink :to="d.route">
            <h6 class="mb-0 text-muted">Explore More</h6>
          </NuxtLink>
        </div>
        <div class="d-flex overflow-auto">
          <div v-for="(list, j) of d.data" :key="j" class="col-lg-2 col-sm-3 col-6 mb-3">
            <div :class="j === 0 ? 'me-1' : 'mx-1'">
              <NuxtLink :to="`/a/${list.attributes.slug}`">
                <img class="img-fluid mb-2" :src="list.attributes.posterImage.large" width="280">
                <h6 class="mb-1 text-white">{{ list.attributes.titles.en ? list.attributes.titles.en : list.attributes.titles.en_jp }} <span class="badge bg-secondary align-middle">{{ list.attributes.subtype }}</span></h6>
              </NuxtLink>
              <small class="text-muted d-block mb-1">{{ list.attributes.titles.en_jp ? list.attributes.titles.en_jp : list.attributes.canonicalTitle }}</small>
              <small class="d-block mb-1 text-primary">{{ formatDate(list.attributes.startDate) }}</small>
              <div class="d-flex align-items-center position-relative">
                <div class="stars d-flex align-items-center" style="height: 16px;">
                  <img class="position-absolute" src="/images/stars.webp" width="80">
                  <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-list.attributes.averageRating) + '% 0px 0px) '}">
                </div>
                <small class="ms-2 mb-0 text-white">{{ getRating(list.attributes.averageRating) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
