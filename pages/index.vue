<script setup lang="js">
const { data: t } = await useFetch("/api/token");
const { data: p } = await useFetch("/api/popular?token=" + t.value.access_token);
const { data: n } = await useFetch("/api/newly_added?token=" + t.value.access_token);
const { data: s } = await useFetch("/api/simulcasts?token=" + t.value.access_token);
const popular = p.value.data;
const newly_added = n.value.data;
const simulcasts = s.value.data;
const simulcasts_title = s.value.title;
</script>

<template>
  <main>
    <div class="container-fluid">
      <NavbarSide>
        <div class="col px-0 pb-5">
          <div class="banner p-0 position-relative d-flex justify-content-end align-items-center p-0 w-100 overflow-hidden">
            <img id="blur" class="position-absolute top-0 w-100 h-100" :src="popular[0].images.poster_wide[0][0].source" style="filter: blur(.7rem); z-index: -1;">
            <img id="front" class="px-3 pe-lg-5" :src="popular[0].images.poster_wide[0].find(e => e.width === 1200).source">
            <div id="overlay" class="position-absolute w-100 top-0" />
            <div id="info" class="position-absolute">
              <h2 class="mb-1">{{ popular[0].title }}</h2>
              <div class="d-flex align-items-center position-relative mb-2">
                <div class="stars d-flex align-items-center" style="height: 25px;">
                  <img class="position-absolute" src="/images/stars.webp" width="100">
                  <img class="" src="/images/stars-filled.webp" width="100" :style="{'clip-path': 'inset(0px ' + getRating(popular[0].rating.average) + '% 0px 0px) '}">
                </div>
                <span class="ms-2 mb-0 h6">{{ popular[0].rating.average }} · ({{ formatRating(popular[0].rating.total) }}) · {{ popular[0].series_metadata.season_count }} Seasons</span>
              </div>
              <h6 class="mb-0 fw-normal">{{ popular[0].description }}</h6>
            </div>
          </div>
          <div class="px-1 py-4 px-xl-5 w-100">
            <div class="mt-4 mb-5">
              <h3 class="mb-3">Most Popular</h3>
              <div class="d-flex overflow-scroll">
                <div v-for="(pop, i) of popular" :key="i" class="col-2 mb-2">
                  <div :class="i === 0 ? 'me-1' : 'mx-1'">
                    <img class="img-fluid mb-2" :src="pop.images.poster_tall[0].find(e => e.width === 480).source" width="280">
                    <h6>{{ pop.title }}</h6>
                    <div class="d-flex align-items-center position-relative">
                      <div class="stars d-flex align-items-center" style="height: 16px;">
                        <img class="position-absolute" src="/images/stars.webp" width="80">
                        <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + getRating(pop.rating.average) + '% 0px 0px) '}">
                      </div>
                      <small class="ms-2 mb-0">{{ pop.rating.average }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-5">
              <h3 class="mb-3">Newly Added</h3>
              <div class="d-flex overflow-scroll">
                <div v-for="(nw, i) of newly_added" :key="i" class="col-2 mb-2">
                  <div :class="i === 0 ? 'me-1' : 'mx-1'">
                    <img class="img-fluid mb-2" :src="nw.images.poster_tall[0].find(e => e.width === 480).source" width="280">
                    <h6>{{ nw.title }}</h6>
                    <div class="d-flex align-items-center position-relative">
                      <div class="stars d-flex align-items-center" style="height: 16px;">
                        <img class="position-absolute" src="/images/stars.webp" width="80">
                        <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + getRating(nw.rating.average) + '% 0px 0px) '}">
                      </div>
                      <small class="ms-2 mb-0">{{ nw.rating.average }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-5">
              <h3 class="mb-3">Simulcasts: {{ simulcasts_title }}</h3>
              <div class="d-flex overflow-scroll">
                <div v-for="(sc, i) of simulcasts" :key="i" class="col-2 mb-2">
                  <div :class="i === 0 ? 'me-1' : 'mx-1'">
                    <img class="img-fluid mb-2" :src="sc.images.poster_tall[0].find(e => e.width === 480).source" width="280">
                    <h6>{{ sc.title }}</h6>
                    <div class="d-flex align-items-center position-relative">
                      <div class="stars d-flex align-items-center" style="height: 16px;">
                        <img class="position-absolute" src="/images/stars.webp" width="80">
                        <img class="" src="/images/stars-filled.webp" width="80" :style="{'clip-path': 'inset(0px ' + getRating(sc.rating.average) + '% 0px 0px) '}">
                      </div>
                      <small class="ms-2 mb-0">{{ sc.rating.average }}</small>
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
