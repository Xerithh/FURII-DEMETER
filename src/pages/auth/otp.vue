<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const otpCode = ref("");
const isResending = ref(false);
const sideImage = "/images/auth-placeholder.jpg";

const handleVerifyOtp = async () => {
  if (authStore.user?.email && otpCode.value.length === 6) {
    const success = await authStore.verifyOtp({
      email: authStore.user.email,
      code: otpCode.value,
    });

    if (success) {
      router.push("/login");
    }
  } else if (!authStore.user?.email) {
    router.push("/login");
  }
};

const handleResendOtp = async () => {
  if (authStore.user?.email) {
    isResending.value = true;
    await authStore.resendOtp({ email: authStore.user.email });
    isResending.value = false;
  }
};
</script>

<template>
  <div class="auth-split-layout">
    <VRow no-gutters class="auth-split-row">
      <VCol cols="12" md="6" class="auth-left-panel">
        <VImg :src="sideImage" cover class="auth-left-image" />
      </VCol>

      <VCol cols="12" md="6" class="auth-right-panel">
        <div class="auth-form-wrap">
          <h3 class="text-h4 font-weight-bold mb-2">Vérification</h3>
          <p class="auth-intro text-body-1 text-medium-emphasis mb-8">
            Veuillez entrer le code à 6 chiffres envoyé à
            {{ authStore.user?.email || "votre adresse e-mail" }}.
          </p>

          <VForm @submit.prevent="handleVerifyOtp">
            <VOtpInput
              v-model="otpCode"
              length="6"
              class="mb-6 custom-otp"
              variant="outlined"
              elevation="0"
              bg-color="transparent"
            />

            <VBtn
              block
              size="large"
              type="submit"
              class="mb-5"
              :loading="authStore.isLoading"
              :disabled="otpCode.length !== 6"
              elevation="0"
              color="primary"
            >
              Vérifier le code
            </VBtn>

            <div
              v-if="authStore.error"
              class="text-error text-center mb-4 text-body-2"
              style="color: #ef4444"
            >
              {{ authStore.error }}
            </div>

            <p class="text-center text-body-1 mt-4">
              Vous n'avez pas reçu le code ?
              <a
                href="javascript:void(0)"
                class="text-primary ms-1 text-decoration-none"
                @click.prevent="handleResendOtp"
              >
                {{ isResending ? "Envoi en cours..." : "Renvoyer" }}
              </a>
            </p>
          </VForm>

          <RouterLink to="/login" class="back-to-site mt-4" aria-label="Retour">
            <span class="back-to-site-inner">
              <i class="bx bx-arrow-back"></i>
              <span>Retour à la connexion</span>
            </span>
          </RouterLink>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
/* Layout basics from authentication.vue */
.auth-split-layout {
  min-height: 100vh;
  background: #f8fafc;
}

.auth-split-row {
  min-height: 100vh;
}

.auth-left-panel {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.auth-left-image {
  width: 100%;
  height: 100vh;
  min-height: 340px;
  object-fit: cover;
}

.auth-right-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.25rem;
  background: #fff;
}

.auth-form-wrap {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.auth-form-wrap h3,
.auth-form-wrap p {
  text-align: center;
}

.auth-intro {
  min-height: 3rem;
}

.auth-form-wrap :deep(form),
.auth-form-wrap :deep(.v-form) {
  width: 100%;
}

.back-to-site {
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: #6b7280;
}

.back-to-site-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: inherit;
}

/* Minimalist Shadcn-like overrides */
.auth-form-wrap :deep(.v-btn) {
  border-radius: 6px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
}

/* Custom OTP Input Minimalist */
.custom-otp {
  justify-content: space-between;
  gap: 8px;
}

.custom-otp :deep(.v-field) {
  border-radius: 8px;
}

.custom-otp :deep(.v-otp-input__content) {
  gap: 0.5rem;
}

.custom-otp :deep(.v-field__outline) {
  --v-field-border-opacity: 0.2;
}

@media (max-width: 959px) {
  .auth-left-panel,
  .auth-left-image {
    min-height: 260px;
  }
}
</style>
