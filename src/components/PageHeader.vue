<script setup>
defineProps({
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div class="page-header-wrapper">
    <div class="page-header-content">
      <div class="title-section">
        <VIcon
          v-if="icon"
          :icon="icon"
          size="28"
          color="primary"
          class="title-icon"
        />
        <h4 class="text-h4">{{ title }}</h4>
      </div>
      <p v-if="subtitle" class="text-body-1 text-medium-emphasis">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header-wrapper {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.page-header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1rem;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;

  h4 {
    margin: 0;
  }

  .title-icon {
    flex-shrink: 0;
  }
}

p {
  margin: 0;
  max-width: 600px;
}
</style>
