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
  // remember removed per design
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
      // Redirection basée sur le rôle de l'utilisateur
      const targetRoute = authStore.user?.role === 'ADMIN' 
        ? '/admin' 
        : '/student/dashboard';
      await router.push(targetRoute);
    } catch (navigationError) {
      console.error("login navigation error", navigationError);
    }
  }
};
</script>

<template>
  <div class="auth-split-layout">
    <VRow no-gutters class="auth-split-row">
      <VCol cols="12" md="6" class="auth-left-panel d-none d-md-flex">
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

            <!-- 'Se souvenir de moi' removed -->

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
  flex-wrap: wrap;
}

.auth-left-panel {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: none;
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
  padding: 1rem;
  background: #fff;
  min-height: 100vh;
  width: 100%;
}

.auth-form-wrap {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.auth-form-wrap h3 {
  text-align: center;
  font-size: clamp(1.5rem, 5vw, 2rem);
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.auth-form-wrap p {
  text-align: center;
}

.auth-intro {
  min-height: auto;
  font-size: clamp(0.875rem, 3.5vw, 1rem);
  line-height: 1.5;
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
  margin-top: 0.5rem;
  text-decoration: none;
  color: #6b7280; /* gray-500 */
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-to-site:hover {
  color: #4f46e5;
}

.back-to-site-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: inherit;
  color: inherit;
}

.back-to-site-inner i {
  font-size: 1rem;
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
  flex-wrap: wrap;
  gap: 0.5rem;
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
  font-size: 0.875rem;
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

.auth-form-wrap .v-btn {
  height: 44px;
  font-size: 1rem;
}

/* Responsive adjustments for tablets */
@media (min-width: 768px) {
  .auth-right-panel {
    padding: 1.5rem 1.25rem;
  }

  .auth-form-wrap {
    gap: 2rem;
  }

  .auth-intro {
    min-height: 3rem;
  }

  .auth-form-wrap h3 {
    font-size: 2rem;
  }
}

/* Desktop layout with side image */
@media (min-width: 960px) {
  .auth-left-panel {
    display: flex;
    position: relative;
    min-height: 100vh;
    overflow: hidden;
  }

  .auth-right-panel {
    width: 50%;
    min-height: auto;
    padding: 1.5rem 1.25rem;
  }

  .auth-split-row {
    min-height: 100vh;
  }
}

/* Small mobile phones */
@media (max-width: 600px) {
  .auth-right-panel {
    padding: 2rem 2rem;
    min-height: auto;
  }

  .auth-form-wrap {
    gap: 1.25rem;
    padding: 0 1rem;
  }

  .auth-form-wrap h3 {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .auth-intro {
    min-height: auto;
    margin-bottom: 1rem;
  }

  .auth-form-wrap :deep(.v-text-field) {
    margin-bottom: 1rem !important;
  }

  .auth-form-wrap .v-btn {
    height: 40px;
    font-size: 0.95rem;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .auth-right-panel {
    padding: 1.5rem;
  }

  .auth-form-wrap {
    max-width: 100%;
    padding: 0 1rem;
  }

  .auth-intro {
    font-size: 0.875rem;
  }

  .back-to-site {
    font-size: 0.8rem;
  }
}
</style>
