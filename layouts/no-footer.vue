<template>
  <div id="layout">
    <ComponentNavbar>
      <div class="col px-0">
        <Suspense>
          <slot />
        </Suspense>
      </div>
    </ComponentNavbar>
  </div>
</template>