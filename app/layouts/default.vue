<template>
  <div id="layout" class="col px-0 pb-5 mb-4 pb-lg-0 mb-lg-0">
    <div>
      <Suspense>
        <slot />
      </Suspense>
    </div>
    <FooterComp />
  </div>
</template>
