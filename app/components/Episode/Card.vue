<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true }
});

const ep = props.data as AnimeEpisodes;
</script>

<template>
  <div class="h-100">
    <a class="episode-card bg-secondary d-block rounded h-100 text-white overflow-hidden" :href="ep.url" data-aos="fade-in">
      <div class="bg-dark position-relative rounded-bottom-0 overflow-hidden">
        <img class="img-fluid rounded-bottom-0 scale-on-hover w-100" :src="ep.thumbnail" :alt="ep.title" :title="ep.title">
        <span class="position-absolute top-50 start-50 translate-middle mb-0 invisible pe-none text-white"><Icon name="ci:external-link" /></span>
      </div>
      <h6 class="p-3 m-0 fw-normal">
        <span class="text-primary">
          {{ fixEpisodeTitle(ep.title).episode }}
        </span>
        <span v-if="fixEpisodeTitle(ep.title).title">
          <span class="text-muted">&nbsp;-&nbsp;</span>
          <span>
            {{ fixEpisodeTitle(ep.title).title }}
          </span>
        </span>
      </h6>
    </a>
  </div>
</template>
