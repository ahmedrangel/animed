<template>
  <div id="layout" class="col px-0">
    <Suspense>
      <div>
        <main>
          <slot />
        </main>
      </div>
    </Suspense>
  </div>
</template>