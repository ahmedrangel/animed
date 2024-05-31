<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
});

const ep = props.data;
</script>

<template>
  <a class="episode-card" :href="ep.url">
    <div class="bg-secondary text-white rounded">
      <div class="bg-dark overflow-hidden position-relative rounded rounded-bottom-0">
        <img class="img-fluid rounded rounded-bottom-0 scale-on-hover w-100" :src="ep.thumbnail" :alt="ep.title" :title="ep.title">
        <span class="position-absolute top-50 start-50 translate-middle mb-0 invisible pe-none text-white"><Icon name="ci:external-link" /></span>
      </div>
      <h6 class="p-3 m-0 fw-normal">
        <span class="text-primary">
          {{ fixEpisodeTitle(ep.title).episode }}
        </span>
        <span class="text-muted">&nbsp;-&nbsp;</span>
        <span>
          {{ fixEpisodeTitle(ep.title).title }}
        </span>
      </h6>
    </div>
  </a>
</template>