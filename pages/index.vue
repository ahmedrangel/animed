<script setup lang="js">
const { data: data } = await useFetch("/api/home");
const popular = data.value[0].data;
</script>

<template>
  <VideoModal id="verModal" :video="`https://youtube.com/embed/${popular[0].attributes.youtubeVideoId}`" />
  <div class="col px-0 pb-5">
    <div class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden border-bottom">
      <span id="blur" class="position-absolute top-0 w-100 h-100" :style="{ 'background-image': 'url(' + popular[0].attributes.coverImage.large + ')' }" />
      <span id="front" class="d-flex justify-content-center px-3 pt-5 pt-md-0 pt-lg-0">
        <img :src="popular[0].attributes.posterImage.large">
      </span>
      <div id="overlay" class="position-absolute w-100 top-0" />
      <div id="info" class="position-absolute">
        <h2 class="mb-1">{{ popular[0].attributes.canonicalTitle }}</h2>
        <h6 class="mb-1 text-muted  ">{{ popular[0].attributes.titles.en ? popular[0].attributes.titles.en : popular[0].attributes.canonicalTitle }}</h6>
        <div class="d-flex align-items-center position-relative mb-2">
          <div class="stars d-flex align-items-center" style="height: 25px;">
            <img class="position-absolute" src="/images/stars.webp" width="100">
            <img class="" src="/images/stars-filled.webp" width="100" :style="{'clip-path': 'inset(0px ' + (100-popular[0].attributes.averageRating) + '% 0px 0px) '}">
          </div>
          <span class="ms-2 mb-0 h6">{{ getRating(popular[0].attributes.averageRating) }}</span>
        </div>
        <h6 class="mb-2 fw-normal">{{ popular[0].attributes.synopsis }}</h6>
        <PrimeButton class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#verModal">
          <div class="d-flex justify-content-center align-items-center py-1 px-2">
            <Icon name="solar:play-bold" />&nbsp;&nbsp;
            <span class="h6 mb-0 fw-bold">Watch Trailer</span>
          </div>
        </PrimeButton>
      </div>
    </div>
    <div class="px-4 py-4 px-xl-5 w-100">
      <div v-for="(d, i) of data" :key="i" of data class="mt-4 mb-5">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">{{ d.title }}</h3>
          <h6 class="mb-0 text-muted">Explore More</h6>
        </div>
        <div class="d-flex overflow-auto">
          <div v-for="(list, j) of d.data" :key="j" class="col-lg-2 col-sm-3 col-6 mb-2">
            <div :class="j === 0 ? 'me-1' : 'mx-1'">
              <img class="img-fluid mb-2" :src="list.attributes.posterImage.large" width="280">
              <h6 class="mb-1">{{ list.attributes.titles.en ? list.attributes.titles.en : list.attributes.titles.en_jp }}</h6>
              <small class="text-muted d-block mb-1">{{ list.attributes.canonicalTitle }}</small>
              <div class="d-flex align-items-center position-relative">
                <div class="stars d-flex align-items-center" style="height: 16px;">
                  <img class="position-absolute" src="/images/stars.webp" width="80">
                  <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-list.attributes.averageRating) + '% 0px 0px) '}">
                </div>
                <small class="ms-2 mb-0">{{ getRating(list.attributes.averageRating) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
