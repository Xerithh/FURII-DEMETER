<template>
  <VContainer class="py-12 px-6">
    <VRow justify="center">
      <VCol cols="12" md="10" lg="8">
        <div class="text-center mb-10">
          <h1 class="text-h3 font-weight-bold text-primary mb-4">
            Contacter notre support
          </h1>
          <p
            class="text-h6 text-medium-emphasis mx-auto"
            style="max-width: 800px; line-height: 1.6"
          >
            Une difficulté ? Une question technique ou pédagogique ? Notre
            équipe est prête à vous assister au plus vite.
          </p>
        </div>

        <VCard elevation="2" class="pa-8 pb-10">
          <VCardText
            class="text-body-1 text-center"
            style="line-height: 1.8; color: var(--v-theme-on-surface)"
          >
            <VIcon
              icon="bx-envelope"
              size="80"
              color="primary"
              class="mb-6 opacity-80"
            />

            <h2 class="text-h5 font-weight-bold mb-4 text-primary">
              Comment pouvons-nous aider ?
            </h2>

            <p class="mb-10 text-body-1 mx-auto" style="max-width: 600px">
              Que ce soit pour un problème de connexion au compte, pour ajuster
              vos modules recommandés, ou si un quiz ne fonctionne pas
              correctement, n'hésitez pas à nous envoyer un mail.
            </p>

            <VBtn
              size="x-large"
              color="primary"
              variant="elevated"
              class="font-weight-bold px-8 mb-6"
              href="mailto:support@isisu.test"
            >
              Envoyer un message au support
            </VBtn>

            <p class="text-body-2 text-medium-emphasis mt-6 mb-0">
              Notre équipe s'engage à vous répondre sous 48 heures ouvrées.<br />
              Heures d'ouverture du support : Lundi - Vendredi, 9h à 18h.
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
// Page de contact / support
</script>
