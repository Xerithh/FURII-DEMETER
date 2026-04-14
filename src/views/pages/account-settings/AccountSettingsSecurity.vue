<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";

const authStore = useAuthStore();
const toastStore = useToastStore();

const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isSaving = ref(false);

const passwordRequirements = [
  "Au moins 8 caractères - plus c'est long, mieux c'est",
  "Au moins une lettre minuscule",
  "Au moins un chiffre ou un symbole",
];

const validatePasswords = () => {
  if (!currentPassword.value) {
    return "Entrez votre mot de passe actuel";
  }
  if (!newPassword.value || newPassword.value.length < 8) {
    return "Le nouveau mot de passe doit contenir au moins 8 caractères";
  }
  if (newPassword.value !== confirmPassword.value) {
    return "La confirmation ne correspond pas au nouveau mot de passe";
  }
  return null;
};

const savePassword = async () => {
  const err = validatePasswords();
  if (err) {
    toastStore.addToast({ message: err, type: "error" });
    return;
  }

  isSaving.value = true;
  const res = await authStore.changePassword({
    ancienMotDePasse: currentPassword.value,
    nouveauMotDePasse: newPassword.value,
    confirmationMotDePasse: confirmPassword.value,
  });

  if (res.success) {
    toastStore.addToast({
      message: "Mot de passe mis à jour.",
      type: "success",
    });
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } else {
    toastStore.addToast({
      message:
        authStore.error ||
        res.message ||
        "Erreur lors du changement de mot de passe",
      type: "error",
    });
  }

  isSaving.value = false;
};
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Changer le mot de passe">
        <VForm>
          <VCardText>
            <!-- 👉 Current Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible ? 'bx-hide' : 'bx-show'
                  "
                  label="Mot de passe actuel"
                  placeholder="············"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'bx-hide' : 'bx-show'
                  "
                  label="Nouveau mot de passe"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'
                  "
                  label="Confirmer le nouveau mot de passe"
                  placeholder="············"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              Exigences du mot de passe :
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon size="7" icon="bxs-circle" class="me-3" />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn :loading="isSaving" :disabled="isSaving" @click="savePassword"
              >Enregistrer les modifications</VBtn
            >

            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
              @click="
                () => {
                  currentPassword = '';
                  newPassword = '';
                  confirmPassword = '';
                }
              "
            >
              Réinitialiser
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
