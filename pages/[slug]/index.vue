<script setup lang="js">
const { params } = useRoute();
const { slug } = params;
const { data: data } = await useFetch("/api/anime/" + slug);
const anime = data.value.data[0];
</script>

<template>
  <div class="col px-0 pb-5">
    <ComponentBanner :anime="anime" />
  </div>
</template>
