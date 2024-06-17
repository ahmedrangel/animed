<template>
  <div class="px-2 px-xl-5 py-5 w-100 border-top">
    <div class="d-flex align-items-center mb-2">
      <img src="/images/animed.svg" class="pe-none" height="40" :title="SITE.domain">&nbsp;&nbsp;
      <h5 class="mb-0">{{ SITE.domain.toUpperCase() }}</h5>
    </div>
    <div class="text-muted mb-2">
      <div class="d-flex align-items-center mb-2">
        <h6 class="mb-0 fw-normal">Data provided by&nbsp;</h6>
        <a target="_blank" href="https://anilist.co">
          <img src="/images/anilist-logo.svg" class="pe-none" height="40" title="AniList">
        </a>
      </div>
      <h6 class="mb-0 fw-normal">This project uses the AniList API but is not endorsed or certified by AniList.&nbsp;</h6>
    </div>
    <a target="_blank" :href="SITE.github" class="d-inline-flex" title="GitHub Repository">
      <h2 class="mb-0 text-muted">
        <Icon name="simple-icons:github" />
      </h2>
    </a>
  </div>
</template>