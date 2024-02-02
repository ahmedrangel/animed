<script setup lang="js">
//const { data: t } = await useFetch("/api/token");
const { data: p } = await useFetch("/api/popular");
const { data: a } = await useFetch("/api/airing");
const { data: r } = await useFetch("/api/rated");
const popular = p.value.data;
const airing = a.value.data;
const rated = r.value.data;
</script>

<template>
  <main>
    <VideoModal id="verModal" :video="`https://youtube.com/embed/${popular[0].attributes.youtubeVideoId}`" />
    <div class="container-fluid">
      <NavbarSide>
        <div class="col px-0 pb-5">
          <div class="banner p-0 position-relative d-flex align-items-center p-0 w-100 overflow-hidden">
            <img id="blur" class="position-absolute top-0 h-100" :src="popular[0].attributes.coverImage.large" style="z-index: -1;">
            <img id="front" class="px-3 pt-5 pt-md-0 pt-lg-0" :src="popular[0].attributes.posterImage.large">
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
          <div class="px-1 py-4 px-xl-5 w-100">
            <div class="mt-4 mb-5">
              <h3 class="mb-3">Trending</h3>
              <div class="d-flex overflow-scroll">
                <div v-for="(pop, i) of popular" :key="i" class="col-lg-2 col-sm-3 col-6 mb-2">
                  <div :class="i === 0 ? 'me-1' : 'mx-1'">
                    <img class="img-fluid mb-2" :src="pop.attributes.posterImage.large" width="280">
                    <h6 class="mb-1">{{ pop.attributes.titles.en ? pop.attributes.titles.en : pop.attributes.titles.en_jp }}</h6>
                    <small class="text-muted d-block mb-1">{{ pop.attributes.canonicalTitle }}</small>
                    <div class="d-flex align-items-center position-relative">
                      <div class="stars d-flex align-items-center" style="height: 16px;">
                        <img class="position-absolute" src="/images/stars.webp" width="80">
                        <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-pop.attributes.averageRating) + '% 0px 0px) '}">
                      </div>
                      <small class="ms-2 mb-0">{{ getRating(pop.attributes.averageRating) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 mb-5">
              <h3 class="mb-3">Top Airing</h3>
              <div class="d-flex overflow-scroll">
                <div v-for="(air, i) of airing" :key="i" class="col-lg-2 col-sm-3 col-6 mb-2">
                  <div :class="i === 0 ? 'me-1' : 'mx-1'">
                    <img class="img-fluid mb-2" :src="air.attributes.posterImage.large" width="280">
                    <h6 class="mb-1">{{ air.attributes.titles.en ? air.attributes.titles.en : air.attributes.titles.en_jp }}</h6>
                    <small class="text-muted d-block mb-1">{{ air.attributes.canonicalTitle }}</small>
                    <div class="d-flex align-items-center position-relative">
                      <div class="stars d-flex align-items-center" style="height: 16px;">
                        <img class="position-absolute" src="/images/stars.webp" width="80">
                        <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-air.attributes.averageRating) + '% 0px 0px) '}">
                      </div>
                      <small class="ms-2 mb-0">{{ getRating(air.attributes.averageRating) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 mb-5">
              <h3 class="mb-3">Top Rated</h3>
              <div class="d-flex overflow-scroll">
                <div v-for="(ra, i) of rated" :key="i" class="col-lg-2 col-sm-3 col-6 mb-2">
                  <div :class="i === 0 ? 'me-1' : 'mx-1'">
                    <img class="img-fluid mb-2" :src="ra.attributes.posterImage.large" width="280">
                    <h6 class="mb-1">{{ ra.attributes.titles.en ? ra.attributes.titles.en : ra.attributes.titles.en_jp }}</h6>
                    <small class="text-muted d-block mb-1">{{ ra.attributes.canonicalTitle }}</small>
                    <div class="d-flex align-items-center position-relative">
                      <div class="stars d-flex align-items-center" style="height: 16px;">
                        <img class="position-absolute" src="/images/stars.webp" width="80">
                        <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + (100-ra.attributes.averageRating) + '% 0px 0px) '}">
                      </div>
                      <small class="ms-2 mb-0">{{ getRating(ra.attributes.averageRating) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavbarSide>
    </div>
  </main>
</template>
