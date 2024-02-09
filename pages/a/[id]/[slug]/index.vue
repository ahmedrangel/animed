<script setup lang="ts">
const { params } = useRoute();
const { id, slug } = params;
const { data: data } = await useFetch("/api/anime/" + id) as Record<string, any>;
const _slug = fixSlug(data.value.title.romaji);
const anime = data.value;
const externalLinks = anime.externalLinks
  .filter((e: { site: string; }) => !e?.site.toLocaleLowerCase().includes("youtube"))
  .sort((a: Record<string, string>, b: Record<string, string>) => {
    return a?.site === "Official Site" ? -1 : b?.site === "Official Site" ? 1 : 0;
  });
if (slug !== _slug) {
  throw createError({
    statusCode: 404,
    message: `Anime not found: '${slug}'`,
    fatal: true
  });
}
</script>

<template>
  <section id="anime-page">
    <div class="col px-0 pb-5">
      <ComponentBanner2 v-if="anime" :anime="anime" />
      <div class="px-2 py-4 py-lg-5 px-lg-5 px-xl-5 w-100">
        <nav id="anime-nav" class="nav justify-content-center gap-4">
          <NuxtLink class="nav-link active px-1 py-0 text-white" aria-current="page" :to="slug">
            <h5 class="py-2 mb-0">OVERVIEW</h5>
          </NuxtLink>
          <NuxtLink class="nav-link px-1 py-0 text-white disabled" :to="slug + '/characters'">
            <h5 class="py-2 mb-0">CHARACTERS</h5>
          </NuxtLink>
          <NuxtLink class="nav-link px-1 py-0 text-white disabled" :to="slug + '/episodes'">
            <h5 class="py-2 mb-0">EPISODES</h5>
          </NuxtLink>
        </nav>
        <div class="pt-4 px-0 px-xl-4">
          <h4 class="mb-1 text-primary">{{ anime.title.romaji }} <span class="badge bg-secondary align-middle">{{ anime.format }}</span></h4>
          <h6 v-if="anime.title.english" class="mb-1">{{ anime.title.english }}</h6>
          <h6 v-if="anime.title.native" class="mb-1">{{ anime.title.native }}</h6>
          <div class="d-flex align-items-center position-relative">
            <div class="stars d-flex align-items-center" style="height: 25px;">
              <img class="position-absolute" src="/images/stars.webp" width="100" style="opacity: 0.5">
              <img src="/images/stars-filled.webp" width="100" :style="{'clip-path': 'inset(0px ' + (100-anime.averageScore) + '% 0px 0px) '}">
            </div>
            <small class="ms-2 mb-0 text-white">{{ getRating(anime.averageScore) }}</small>
          </div>
        </div>
        <div id="details" class="py-3 d-flex align-items-start anime-row mx-0 flex-wrap px-xl-4 g-xl-5">
          <img id="cover" :src="anime?.coverImage?.extraLarge" class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 img-fluid px-0" style="max-width: 400px;">
          <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-9 pt-4 pt-md-0 px-0 ps-md-4">
            <div v-if="anime.description" class="pb-4">
              <h2 class="text-white">Description</h2>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <h6 class="mb-0 fw-normal" v-html="anime.description" />
            </div>
            <div class="d-flex justify-content-start align-items-start anime-row flex-wrap m-0">
              <h6 v-if="anime.status" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                <span class="text-primary">Status:</span>&nbsp;&nbsp; {{ anime.status.toLowerCase() }}
              </h6>
              <h6 v-if="anime.startDate?.year" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                <span class="text-primary">Release Date:</span>&nbsp;&nbsp; {{ anime.startDate.year ? formatDate(anime.startDate.year, anime.startDate.month, anime.startDate.day) : "TBA" }}
              </h6>
              <h6 v-if="anime.endDate?.year" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                <span class="text-primary">End Date:</span>&nbsp;&nbsp; {{ anime.endDate?.year ? formatDate(anime.endDate.year, anime.endDate.month, anime.endDate.day) : "TBA" }}
              </h6>
              <h6 v-if="anime.episodes" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                <span class="text-primary">Episodes:</span>&nbsp;&nbsp; {{ anime.episodes }}
              </h6>
              <h6 v-if="anime.duration" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                <span class="text-primary">Episode Duration:</span>&nbsp;&nbsp; {{ anime.duration }} mins
              </h6>
              <h6 v-if="anime.season" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                <span class="text-primary">Season:</span>&nbsp;&nbsp; {{ anime.season.toLowerCase() }} {{ anime.seasonYear }}
              </h6>
              <h6 v-if="anime.source" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0 text-capitalize">
                <span class="text-primary">Source:</span>&nbsp;&nbsp; {{ anime.source.toLowerCase().replace(/_/g, " ") }}
              </h6>
              <h6 v-if="getStudios(anime.studios)" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                <span class="text-primary">Studios:</span>&nbsp;&nbsp; {{ getStudios(anime.studios) }}
              </h6>
              <h6 v-if="getProducers(anime.studios)" class="mb-2 fw-normal col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-0 p-0">
                <span class="text-primary">Producers:</span>&nbsp;&nbsp; {{ getProducers(anime.studios) }}
              </h6>
            </div>
            <div v-if="anime.genres">
              <h6 class="mb-2 fw-normal">
                <span class="text-primary">Genres:</span>&nbsp;
                <span v-for="(genre, i) of anime.genres" :key="i">
                  <span class="badge bg-secondary align-middle mx-1 fw-normal">{{ genre }}</span>
                </span>
              </h6>
            </div>
            <div v-if="externalLinks" class="py-2 mb-2">
              <h6 class="text-primary">External Links:</h6>
              <div class="d-flex flex-wrap gap-2 align-items-end">
                <div v-for="(site, i) of externalLinks" :key="i">
                  <a :href="site.url" target="_blank" class="d-block p-2 rounded" :style="{'background-color': site.color ? site.color : 'var(--bs-secondary)'}">
                    <Icon v-if="!site.icon" name="ph:globe-simple-bold" class="text-white" style="font-size: 32px;" />
                    <img v-else :src="site.icon" style="width: 30px;">
                  </a>
                </div>
              </div>
            </div>
            <div v-if="anime?.trailer?.site === 'youtube'">
              <div class="col-12 col-lg-12 col-xl-6">
                <h6 class="text-primary">Trailer:</h6>
                <div class="ratio ratio-16x9">
                  <iframe id="embed" width="1280" height="720" :src="'https://youtube.com/embed/' + anime.trailer.id" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope;" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="anime?.characters?.edges[0]" id="characters">
          <h2 class="text-white mb-4">Characters</h2>
          <div class="d-flex justify-content-start align-items-start anime-row flex-wrap gx-4 gy-2">
            <div v-for="(c, i) of anime.characters.edges" :key="i" class="col-12 col-lg-6 col-xl-6 col-xxl-4 mb-3">
              <div class="d-flex align-items-start anime-row flex-wrap row-cols-auto g-2 bg-secondary">
                <div class="col ps-0 mt-0" style="max-width: 100px;">
                  <img :src="c.node.image.large" class="img-fluid rounded-start" style="max-height: 90px;">
                </div>
                <div class="col text-start me-auto mt-0 py-1">
                  <small class="d-block text-primary">{{ c.node?.name.userPreferred }}</small>
                  <small class="text-capitalize">{{ c.role.toLowerCase() }}</small>
                </div>
                <div class="col text-end mt-0 py-1">
                  <small class="d-block">{{ c.voiceActors[0]?.name.userPreferred }}</small>
                  <small class="text-capitalize text-muted">{{ c.voiceActors[0]?.languageV2 }}</small>
                </div>
                <div class="col pe-0 mt-0">
                  <img :src="c.voiceActors[0]?.image.large" class="img-fluid rounded-start" style="max-height: 90px;">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
