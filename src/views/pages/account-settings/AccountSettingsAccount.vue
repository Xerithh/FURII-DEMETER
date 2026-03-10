<script setup>
import avatar1 from '@images/avatars/avatar-1.png'

const accountData = {
  avatarImg: avatar1,
  firstName: 'Sophie',
  lastName: 'Martin',
  org: 'Université Côte d\'Azur - Polytech Nice',
}

const refInputEl = ref()
const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

// only basic account fields are required for our project
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Détails du Profil">
        <VCardText class="d-flex">
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />

          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <span>Téléverser la photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              />

              <VBtn
                type="reset"
                color="error"
                variant="tonal"
                @click="resetAvatar"
              >
                Réinitialiser
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              JPG, GIF ou PNG autorisés. Taille maximale : 800 Ko
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <VForm class="mt-6">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.firstName" placeholder="Sophie" label="Prénom" />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.lastName" placeholder="Martin" label="Nom" />
              </VCol>

              <VCol cols="12" md="12">
                <VTextField v-model="accountDataLocal.org" label="Organisation" />
              </VCol>
            </VRow>

            <div class="d-flex flex-wrap gap-4 mt-4">
              <VBtn type="submit">Enregistrer</VBtn>
              <VBtn color="secondary" variant="tonal" type="reset" @click="resetForm">Réinitialiser</VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Désactiver le compte">
        <VCardText>
          <div>
            <VCheckbox v-model="isAccountDeactivated" label="Je confirme la désactivation de mon compte" />
          </div>

          <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-3">Désactiver le compte</VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
