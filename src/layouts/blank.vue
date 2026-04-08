<template>
  <div
    class="layout-wrapper layout-blank"
    data-allow-mismatch
  >
    <RouterView />
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
  min-height: 100vh;
  display: flex;
}
</style>
