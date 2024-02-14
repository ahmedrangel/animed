<template>
  <div id="layout">
    <ComponentNavbar>
      <div class="col px-0 pb-5 mb-4 pb-lg-0 mb-lg-0">
        <Suspense>
          <slot />
        </Suspense>
        <ComponentFooter />
      </div>
    </ComponentNavbar>
  </div>
</template>
