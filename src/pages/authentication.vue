<script setup>
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isLogin = computed(() => route.path === "/login");

const loginForm = reactive({
  email: "",
  password: "",
  remember: false,
});

const isPasswordVisible = ref(false);
const sideImage = "/images/auth-placeholder.jpg";

const handleLogin = async () => {
  const success = await authStore.login({
    email: loginForm.email,
    motDePasse: loginForm.password,
  });

  if (success) {
    toastStore.addToast({
      message: "Ravis de vous revoir ! Connexion en cours...",
      type: "success",
    });
    try {
      await router.push("/student/dashboard");
    } catch (navigationError) {
      console.error("login navigation error", navigationError);
    }
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
          <!-- Login Form -->
          <h3 class="text-h4 font-weight-bold mb-2">Connexion</h3>
          <p class="auth-intro text-body-1 text-medium-emphasis mb-8">
            Accedez a votre espace d'apprentissage personnalise.
          </p>

          <VForm @submit.prevent="handleLogin">
            <VTextField
              v-model="loginForm.email"
              autofocus
              label="Email"
              type="email"
              placeholder="prenom.nom@etudiant.isis.fr"
              class="mb-4"
            />

            <VTextField
              v-model="loginForm.password"
              label="Mot de passe"
              placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="password"
              :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
              class="mb-2"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />

            <div class="form-actions">
              <div class="fa-left">
                <VCheckbox
                  v-model="loginForm.remember"
                  label="Se souvenir de moi"
                />
              </div>
              <div class="fa-right" />
            </div>

            <VBtn
              block
              size="large"
              type="submit"
              class="mb-5"
              :loading="authStore.isLoading"
              >Connexion</VBtn
            >
            <div v-if="authStore.error" class="text-error text-center mb-4">
              {{ authStore.error }}
            </div>

            <p class="text-center text-body-1">
              Nouveau sur ISISU ?
              <RouterLink to="/register" class="text-primary ms-1"
                >Creer un compte</RouterLink
              >
            </p>
          </VForm>

          <RouterLink to="/" class="back-to-site" aria-label="Retour au site">
            <span class="back-to-site-inner">
              <i class="bx bx-globe"></i>
              <span>Retour au site</span>
            </span>
          </RouterLink>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
/* Layout basics */
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
  gap: 2rem;
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
  margin-bottom: 1rem;
  text-decoration: none;
  color: #6b7280; /* gray-500 */
}

.back-to-site-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: inherit;
}

.back-to-site-inner i {
  font-size: 1.05rem;
  line-height: 1;
}

/* Simple checkbox + link row: left checkbox, right link, simple gap */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 0;
  padding: 0;
}

.form-actions .fa-left {
  display: inline-flex;
  align-items: center;
}

.form-actions .fa-right {
  display: inline-flex;
  align-items: center;
}

.form-actions a {
  text-decoration: underline;
  white-space: nowrap;
}

.form-actions .v-checkbox {
  margin: 0;
}

/* Inputs and buttons take the wrapper width */
.auth-form-wrap .v-text-field,
.auth-form-wrap .v-field,
.auth-form-wrap .v-input,
.auth-form-wrap .v-btn {
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 959px) {
  .auth-left-panel,
  .auth-left-image {
    min-height: 260px;
  }
}
</style>
