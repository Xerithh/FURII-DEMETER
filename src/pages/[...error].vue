<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      title="Page non trouvée"
      description="La page que vous recherchez n'existe pas."
    />

    <VBtn @click="goBack" class="mb-12"> Retour </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <img
        src="/images/svg/undraw_page-not-found.svg"
        alt="Page non trouvée"
        class="mx-auto"
        style="max-width: 400px; width: 100%"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
