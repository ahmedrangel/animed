<template>
  <div class="px-4 px-lg-5 py-5 w-100 border-top bg-dark">
    <div class="d-flex align-items-center mb-2">
      <img src="/images/animed.svg" class="pe-none" height="36" :title="SITE.domain">&nbsp;&nbsp;
      <h5 class="mb-0">{{ SITE.domain.toUpperCase() }}</h5>
    </div>
    <div class="text-muted mb-2">
      <div class="d-flex align-items-center mb-2">
        <h6 class="mb-0 fw-normal">Data provided by&nbsp;</h6>
        <NuxtLink target="_blank" to="https://anilist.co">
          <img src="/images/anilist-logo.svg" class="pe-none" height="40" title="AniList">
        </NuxtLink>
      </div>
      <h6 class="mb-0 fw-normal">This project uses the AniList API but is not endorsed or certified by AniList.&nbsp;</h6>
    </div>
    <div class="d-flex align-items-center gap-2">
      <NuxtLink target="_blank" :to="SITE.github" title="GitHub Repository">
        <h2 class="mb-0 text-muted">
          <Icon name="simple-icons:github" />
        </h2>
      </NuxtLink>
      <InstallPWA>
        <NuxtLink>
          <h2 role="button" class="mb-0 text-muted" title="Install PWA">
            <Icon name="mdi:monitor-arrow-down-variant" />
          </h2>
        </NuxtLink>
      </InstallPWA>
    </div>
  </div>
</template>
