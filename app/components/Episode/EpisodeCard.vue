<script setup lang="ts">
defineProps({
  data: { type: Object as () => AnimeEpisodes, required: true }
});
</script>

<template>
  <div class="h-100">
    <a class="episode-card bg-secondary d-block rounded h-100 text-white overflow-hidden" :href="data.url" data-aos="fade-in">
      <div class="bg-dark position-relative rounded-bottom-0 overflow-hidden">
        <img class="img-fluid rounded-bottom-0 scale-on-hover w-100" :src="data.thumbnail" :alt="data.title" :title="data.title">
        <span class="position-absolute top-50 start-50 translate-middle mb-0 invisible pe-none text-white"><Icon name="ci:external-link" /></span>
      </div>
      <h6 class="p-3 m-0 fw-normal">
        <span class="text-primary">
          {{ fixEpisodeTitle(data.title).episode }}
        </span>
        <span v-if="fixEpisodeTitle(data.title).title">
          <span class="text-muted">&nbsp;-&nbsp;</span>
          <span>
            {{ fixEpisodeTitle(data.title).title }}
          </span>
        </span>
      </h6>
    </a>
  </div>
</template>
