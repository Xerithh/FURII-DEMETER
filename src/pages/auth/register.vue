<script setup lang="ts">
import {
  RegisterFiePayload,
  RegisterVaePayload,
  useAuthStore,
} from "@/stores/auth";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref("FIE"); // 'FIE' or 'VAE'
const isPasswordVisible = ref(false);

const baseForm = reactive({
  nom: "",
  prenom: "",
  email: "",
  motDePasse: "",
  accepteCgu: false,
  consentementDonnees: false,
  consentementContact: false,
});

const fieForm = reactive({
  codeINE: "",
  niveauFIE: "FIE1",
  promotion: new Date().getFullYear() + 3,
  parcoursOrigine: "PREPA_ISIS",
});

const vaeForm = reactive({
  niveauEtudes: "BAC+2",
  secteurActivite: "NUMERIQUE",
});

// Dropdown options
const niveauxFIE = ["FIE1", "FIE2", "FIE3"];
const parcoursOptions = [
  "PREPA_ISIS",
  "PASS",
  "L2",
  "L3",
  "DUT",
  "BTS",
  "AUTRE",
];
const niveauxEtudes = ["BAC", "BAC+2", "BAC+3", "BAC+4", "BAC+5"];
const secteursActivite = [
  "SANTE",
  "NUMERIQUE",
  "INDUSTRIE",
  "COMMERCE",
  "AUTRE",
];

// Vuetify Rules
const requiredRule = (v: any) => !!v || "Ce champ est obligatoire";
const emailRule = (v: string) =>
  /.+@.+\..+/.test(v) || "L'e-mail doit être valide";
const passwordRule = (v: string) =>
  (v && v.length >= 8) || "Au moins 8 caractères requis";
const consentRule = (v: boolean) =>
  !!v || "Vous devez accepter ceci pour continuer";
const nameRule = (v: string) => {
  const s = (v || "").trim();
  return (
    (s.length >= 2 && s.length <= 100) ||
    "Doit contenir entre 2 et 100 caractères"
  );
};

// Validations form refs
const registerFormRef = ref();

const handleRegister = async () => {
  const { valid } = await registerFormRef.value.validate();
  if (!valid) return;

  let success = false;

  if (activeTab.value === "FIE") {
    const payload: RegisterFiePayload = {
      ...baseForm,
      ...fieForm,
    };
    success = await authStore.registerFie3(payload);
  } else {
    // map frontend-friendly niveau labels to backend enum values
    const niveauMapping: Record<string, string> = {
      BAC: "BAC",
      "BAC+2": "BAC_PLUS_2",
      "BAC+3": "BAC_PLUS_3",
      "BAC+4": "BAC_PLUS_4",
      // backend doesn't expose BAC+5 enum, map to AUTRE
      "BAC+5": "AUTRE",
    };

    const mappedNiveau =
      niveauMapping[vaeForm.niveauEtudes] || vaeForm.niveauEtudes;

    // map frontend-friendly secteur labels to backend enum values
    const secteurMapping: Record<string, string> = {
      SANTE: "SANTE",
      NUMERIQUE: "INFORMATIQUE",
      INDUSTRIE: "AUTRE",
      COMMERCE: "AUTRE",
      AUTRE: "AUTRE",
    };

    const mappedSecteur =
      secteurMapping[vaeForm.secteurActivite] || vaeForm.secteurActivite;

    const payload: RegisterVaePayload = {
      ...baseForm,
      ...vaeForm,
      niveauEtudes: mappedNiveau,
      secteurActivite: mappedSecteur,
    };
    // eslint-disable-next-line no-console
    success = await authStore.registerVae(payload);
  }

  if (success) {
    router.push("/auth/otp");
  }
};

const sideImage = "/images/auth-placeholder.jpg";
</script>

<template>
  <div class="auth-split-layout">
    <VRow no-gutters class="auth-split-row">
      <VCol cols="12" md="6" class="auth-left-panel d-none d-md-flex">
        <VImg :src="sideImage" cover class="auth-left-image" />
      </VCol>

      <VCol cols="12" md="6" class="auth-right-panel py-8">
        <div class="auth-form-wrap">
          <h3 class="text-h4 font-weight-bold mb-2">Inscription</h3>
          <p class="auth-intro text-body-1 text-medium-emphasis mb-6">
            Renseignez vos informations pour créer votre profil d'apprentissage.
          </p>

          <VBtnToggle
            v-model="activeTab"
            mandatory
            class="mb-8 w-100 minimalist-toggle"
            color="primary"
            variant="outlined"
            divided
          >
            <VBtn value="FIE" class="flex-grow-1" elevation="0"
              >Étudiant ISIS (FIE)</VBtn
            >
            <VBtn value="VAE" class="flex-grow-1" elevation="0"
              >Candidat VAE</VBtn
            >
          </VBtnToggle>

          <VForm
            ref="registerFormRef"
            @submit.prevent="handleRegister"
            class="w-100 text-start"
          >
            <VRow>
              <VCol cols="12" md="6" class="pb-0">
                <div class="text-caption mb-1 font-weight-medium">Prénom</div>
                <VTextField
                  v-model="baseForm.prenom"
                  :rules="[requiredRule, nameRule]"
                  placeholder="Jean"
                  variant="outlined"
                  class="mb-4 minimalist-input"
                  density="comfortable"
                />
              </VCol>
              <VCol cols="12" md="6" class="pb-0">
                <div class="text-caption mb-1 font-weight-medium">Nom</div>
                <VTextField
                  v-model="baseForm.nom"
                  :rules="[requiredRule, nameRule]"
                  placeholder="Dupont"
                  variant="outlined"
                  class="mb-4 minimalist-input"
                  density="comfortable"
                />
              </VCol>
            </VRow>

            <div class="text-caption mb-1 font-weight-medium">Email</div>
            <VTextField
              v-model="baseForm.email"
              :rules="[requiredRule, emailRule]"
              placeholder="jean.dupont@etudiant.isis.fr"
              type="email"
              variant="outlined"
              class="mb-4 minimalist-input"
              density="comfortable"
            />

            <div class="text-caption mb-1 font-weight-medium">Mot de passe</div>
            <VTextField
              v-model="baseForm.motDePasse"
              :rules="[requiredRule, passwordRule]"
              placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              variant="outlined"
              class="mb-6 minimalist-input"
              density="comfortable"
            />

            <div v-if="activeTab === 'FIE'">
              <VDivider class="mb-4" />
              <div class="text-subtitle-2 mb-3">Informations de scolarité</div>
              <div class="text-caption mb-1 font-weight-medium">Code INE</div>
              <VTextField
                v-model="fieForm.codeINE"
                :rules="[requiredRule]"
                placeholder="Ex: 1234567890X"
                variant="outlined"
                class="mb-4 minimalist-input"
                density="comfortable"
              />

              <VRow>
                <VCol cols="12" md="4" class="pb-0">
                  <div class="text-caption mb-1 font-weight-medium">Niveau</div>
                  <VSelect
                    v-model="fieForm.niveauFIE"
                    :items="niveauxFIE"
                    :rules="[requiredRule]"
                    variant="outlined"
                    class="mb-4 minimalist-select"
                    density="comfortable"
                  />
                </VCol>
                <VCol cols="12" md="4" class="pb-0">
                  <div class="text-caption mb-1 font-weight-medium">
                    Promotion
                  </div>
                  <VTextField
                    v-model.number="fieForm.promotion"
                    type="number"
                    :rules="[requiredRule]"
                    variant="outlined"
                    class="mb-4 minimalist-input"
                    density="comfortable"
                  />
                </VCol>
                <VCol cols="12" md="4" class="pb-0">
                  <div class="text-caption mb-1 font-weight-medium">
                    Origine
                  </div>
                  <VSelect
                    v-model="fieForm.parcoursOrigine"
                    :items="parcoursOptions"
                    :rules="[requiredRule]"
                    variant="outlined"
                    class="mb-4 minimalist-select"
                    density="comfortable"
                  />
                </VCol>
              </VRow>
            </div>

            <div v-else>
              <VDivider class="mb-4" />
              <div class="text-subtitle-2 mb-3">
                Informations professionnelles
              </div>
              <VRow>
                <VCol cols="12" md="6" class="pb-0">
                  <div class="text-caption mb-1 font-weight-medium">
                    Niveau d'études
                  </div>
                  <VSelect
                    v-model="vaeForm.niveauEtudes"
                    :items="niveauxEtudes"
                    :rules="[requiredRule]"
                    variant="outlined"
                    class="mb-4 minimalist-select"
                    density="comfortable"
                  />
                </VCol>
                <VCol cols="12" md="6" class="pb-0">
                  <div class="text-caption mb-1 font-weight-medium">
                    Secteur
                  </div>
                  <VSelect
                    v-model="vaeForm.secteurActivite"
                    :items="secteursActivite"
                    :rules="[requiredRule]"
                    variant="outlined"
                    class="mb-4 minimalist-select"
                    density="comfortable"
                  />
                </VCol>
              </VRow>
            </div>

            <VDivider class="mb-4" />

            <div class="consent-group mb-6">
              <VCheckbox
                v-model="baseForm.accepteCgu"
                :rules="[consentRule]"
                density="compact"
                hide-details="auto"
                class="minimalist-checkbox"
              >
                <template #label>
                  <span class="text-body-2 text-high-emphasis ms-2"
                    >J'accepte les
                    <RouterLink
                      :to="{ name: 'terms' }"
                      class="text-primary text-decoration-none"
                      >Conditions Générales d'Utilisation</RouterLink
                    >
                    *</span
                  >
                </template>
              </VCheckbox>

              <VCheckbox
                v-model="baseForm.consentementDonnees"
                :rules="[consentRule]"
                density="compact"
                hide-details="auto"
                class="minimalist-checkbox"
              >
                <template #label>
                  <span class="text-body-2 text-high-emphasis ms-2"
                    >Je consens au traitement de mes données *</span
                  >
                </template>
              </VCheckbox>

              <VCheckbox
                v-model="baseForm.consentementContact"
                density="compact"
                hide-details
                class="minimalist-checkbox"
              >
                <template #label>
                  <span class="text-body-2 text-high-emphasis ms-2"
                    >J'accepte d'être contacté(e) pour le suivi de ma
                    formation</span
                  >
                </template>
              </VCheckbox>
            </div>

            <VBtn
              block
              size="large"
              type="submit"
              color="primary"
              :loading="authStore.isLoading"
              :disabled="authStore.isLoading"
              elevation="0"
              class="mb-4 minimalist-btn"
            >
              S'inscrire
            </VBtn>

            <div
              v-if="authStore.error"
              class="text-error text-center mb-4 text-body-2"
              style="color: #ef4444"
            >
              {{ authStore.error }}
            </div>

            <p class="text-center text-body-1 mt-4">
              Vous avez déjà un compte ?
              <RouterLink
                to="/login"
                class="text-primary ms-1 text-decoration-none"
                >Se connecter</RouterLink
              >
            </p>

            <p class="text-center text-body-2 text-medium-emphasis mt-2 mb-0">
              <RouterLink
                :to="{ name: 'privacy' }"
                class="text-primary text-decoration-none"
                >Confidentialité</RouterLink
              >
              ·
              <RouterLink
                :to="{ name: 'terms' }"
                class="text-primary text-decoration-none"
                >Conditions</RouterLink
              >
              ·
              <RouterLink
                :to="{ name: 'support' }"
                class="text-primary text-decoration-none"
                >Support</RouterLink
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
/* Layout basics aligned with login */
.auth-split-layout {
  min-height: 100vh;
  background: #f8fafc;
}

.auth-split-row {
  min-height: auto;
  flex-wrap: wrap;
  min-height: 100vh;
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
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  background: #fff;
  width: 100%;
  min-height: 100vh;
  padding-top: 1.5rem;
  overflow-y: auto;
  padding-bottom: 2rem;
}

.auth-form-wrap {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.auth-form-wrap h3 {
  text-align: center;
  font-size: clamp(1.5rem, 5vw, 2rem);
  line-height: 1.2;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.auth-form-wrap p.auth-intro {
  text-align: center;
  font-size: clamp(0.875rem, 3.5vw, 1rem);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.auth-intro {
  min-height: auto;
}

/* Shadcn-like styling overrides */
.minimalist-input :deep(.v-field),
.minimalist-select :deep(.v-field) {
  border-radius: 6px;
  background-color: transparent !important;
  box-shadow: none !important;
}

.minimalist-input :deep(.v-field__outline),
.minimalist-select :deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}

.minimalist-input :deep(.v-field--focused .v-field__outline),
.minimalist-select :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
}

.minimalist-btn {
  border-radius: 6px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  height: 44px;
  font-size: 1rem;
}

.minimalist-toggle {
  border-radius: 8px;
  background: transparent;
  border-color: rgba(var(--v-theme-on-surface), 0.12);
  width: 100%;
  margin-bottom: 1.5rem;
}

.minimalist-toggle :deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  height: 40px !important;
  font-size: 0.95rem;
}

.minimalist-checkbox {
  margin-top: -4px;
}

.minimalist-checkbox :deep(.v-selection-control) {
  align-items: flex-start;
}

.minimalist-checkbox :deep(.v-selection-control__wrapper) {
  margin-top: -2px;
}

.consent-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.back-to-site {
  display: block;
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  text-decoration: none;
  color: #6b7280;
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

/* Responsive adjustments for tablets */
@media (min-width: 768px) {
  .auth-right-panel {
    padding: 2rem 1.25rem;
    padding-bottom: 2rem;
    align-items: center;
    min-height: auto;
  }

  .auth-form-wrap h3 {
    font-size: 2rem;
  }

  .minimalist-btn {
    height: 48px;
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
    padding: 2rem 1.25rem;
    align-items: center;
  }

  .auth-split-row {
    min-height: 100vh;
  }
}

/* Small mobile phones */
@media (max-width: 600px) {
  .auth-right-panel {
    padding: 2rem 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1.5rem;
    min-height: auto;
  }

  .auth-form-wrap {
    gap: 0;
    padding: 0 1rem;
  }

  .auth-form-wrap h3 {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .auth-form-wrap p.auth-intro {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .minimalist-toggle {
    margin-bottom: 1rem;
  }

  .minimalist-toggle :deep(.v-btn) {
    font-size: 0.85rem;
    height: 36px !important;
  }

  .auth-form-wrap :deep(.v-text-field),
  .auth-form-wrap :deep(.v-select),
  .auth-form-wrap :deep(.text-caption) {
    font-size: 0.875rem;
  }

  .auth-form-wrap :deep(.v-row) {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .auth-form-wrap :deep(.v-col) {
    padding: 0 !important;
    margin-bottom: 0.75rem;
  }

  .auth-form-wrap :deep(.v-divider) {
    margin: 1rem 0 !important;
  }

  .text-subtitle-2 {
    font-size: 0.875rem;
  }

  .minimalist-btn {
    height: 40px;
    font-size: 0.95rem;
  }

  .consent-group {
    gap: 10px;
    margin-bottom: 1rem;
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

  .auth-form-wrap h3 {
    font-size: 1.375rem;
  }

  .auth-intro {
    font-size: 0.8125rem;
  }

  .text-caption {
    font-size: 0.75rem;
  }

  .text-subtitle-2 {
    font-size: 0.8125rem;
  }

  .minimalist-toggle :deep(.v-btn) {
    font-size: 0.8rem;
    padding: 0 0.5rem !important;
  }

  .back-to-site {
    font-size: 0.8rem;
  }

  .back-to-site-inner {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .back-to-site {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
}

@media (max-width: 959px) {
  .auth-right-panel {
    align-items: flex-start;
  }
}
</style>
