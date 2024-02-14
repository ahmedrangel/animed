<template>
  <div id="layout">
    <ComponentNavbar>
      <div class="col px-0">
        <Suspense>
          <main>
            <slot />
          </main>
        </Suspense>
      </div>
    </ComponentNavbar>
  </div>
</template>