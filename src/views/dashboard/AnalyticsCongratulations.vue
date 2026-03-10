<script setup>
import illustrationJohnDark from '@images/cards/illustration-john-dark.png'
import illustrationJohnLight from '@images/cards/illustration-john-light.png'
import { useTheme } from 'vuetify'

const { global } = useTheme()
const illustrationJohn = computed(() => global.name.value === 'dark' ? illustrationJohnDark : illustrationJohnLight)
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="6"
        order="2"
        order-sm="1"
      >
        <VCardItem class="pb-3">
          <VCardTitle class="text-primary">
            Bonjour ! Prêt à apprendre aujourd'hui ? 📚
          </VCardTitle>
        </VCardItem>

        <VCardText>
          Vous avez complété 12 modules sur 18 ce semestre !
          <br>
          8 nouvelles recommandations personnalisées vous attendent.
          <br>
          <div class="d-flex flex-wrap gap-3 mt-6">
            <VBtn
              variant="tonal"
              size="small"
            >
              Voir les Recommandations
            </VBtn>
            <VBtn
              variant="outlined"
              size="small"
              color="primary"
            >
              <VIcon
                icon="bx-brain"
                start
              />
              Lancer un Quiz Global
            </VBtn>
          </div>
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        sm="4"
        order="1"
        order-sm="2"
        class="text-center"
      >
        <img
          :src="illustrationJohn"
          :height="$vuetify.display.xs ? '150' : '182'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        >
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.125rem;
  inset-inline-end: 3.5rem;
}
</style>
