<template>
  <div id="layout">
    <ComponentNavbar>
      <div class="col px-0 pb-5 mb-4 pb-lg-0 mb-lg-0">
        <Suspense>
          <div>
            <main>
              <slot />
            </main>
            <ComponentFooter />
          </div>
        </Suspense>
      </div>
    </ComponentNavbar>
  </div>
</template>
