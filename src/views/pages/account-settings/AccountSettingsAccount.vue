<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { computed, onMounted, ref, watch } from "vue";

type ProfileForm = {
  nom: string;
  prenom: string;
  email: string;
  codeINE: string;
  niveauEtudes: string;
  secteurActivite: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  niveauFIE: string;
  promotion: string;
  parcoursOrigine: string;
  photoUrl: string;
};

const authStore = useAuthStore();
const toastStore = useToastStore();

// No file uploads: backend accepts only public URLs for `photoUrl`
const isSaving = ref(false);

const profileForm = ref<ProfileForm>({
  nom: "",
  prenom: "",
  email: "",
  codeINE: "",
  niveauEtudes: "",
  secteurActivite: "",
  telephone: "",
  adresse: "",
  codePostal: "",
  ville: "",
  niveauFIE: "",
  promotion: "",
  parcoursOrigine: "",
  photoUrl: "",
});

const fallbackText = (value: string) => value.trim() || "Non renseigne";

const urlRule = (v: string) => {
  if (!v) return true;
  try {
    const u = new URL(v);
    return (
      u.protocol === "http:" ||
      u.protocol === "https:" ||
      "URL invalide (http(s) requis)"
    );
  } catch (e) {
    return "URL invalide";
  }
};

const initials = computed(() => {
  const a = profileForm.value.prenom.trim().charAt(0);
  const b = profileForm.value.nom.trim().charAt(0);
  return `${a}${b}`.toUpperCase().trim();
});

const normalizedRole = computed(() =>
  (authStore.user?.role || "").toString().toUpperCase().replace("ROLE_", ""),
);

const isVaeCandidate = computed(() => normalizedRole.value.includes("VAE"));

const hydrateForm = () => {
  const user = authStore.user;
  profileForm.value = {
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    codeINE: user?.codeINE || "",
    niveauEtudes: user?.niveauEtudes || "",
    secteurActivite: user?.secteurActivite || "",
    telephone: user?.telephone || "",
    adresse: user?.adresse || "",
    codePostal: user?.codePostal || "",
    ville: user?.ville || "",
    niveauFIE: user?.niveauFIE || "",
    promotion: user?.promotion != null ? String(user.promotion) : "",
    parcoursOrigine: user?.parcoursOrigine || "",
    photoUrl: user?.photoUrl || "",
  };
};

watch(() => authStore.user, hydrateForm, { immediate: true, deep: true });

onMounted(async () => {
  await authStore.loadCompleteProfile();
});

const resetForm = () => {
  hydrateForm();
};

// removed file upload handler; use public URL in `photoUrl` instead

const resetAvatar = () => {
  profileForm.value.photoUrl = authStore.user?.photoUrl || "";
};

const saveProfile = async () => {
  // Client-side validation to avoid server 400 for simple rules
  const nom = (profileForm.value.nom || "").trim();
  const prenom = (profileForm.value.prenom || "").trim();

  if (nom.length < 2 || nom.length > 100) {
    toastStore.addToast({
      message: "Le nom doit contenir entre 2 et 100 caractères.",
      type: "error",
    });
    return;
  }

  if (prenom.length < 2 || prenom.length > 100) {
    toastStore.addToast({
      message: "Le prénom doit contenir entre 2 et 100 caractères.",
      type: "error",
    });
    return;
  }

  isSaving.value = true;

  const result = await authStore.updateProfile({
    nom: nom,
    prenom: prenom,
    telephone: profileForm.value.telephone,
    adresse: profileForm.value.adresse,
    codePostal: profileForm.value.codePostal,
    ville: profileForm.value.ville,
    // Backend accepts only public URLs for `photoUrl`.
    photoUrl: profileForm.value.photoUrl || undefined,
  });

  if (result.success) {
    toastStore.addToast({
      message: "Profil mis a jour avec succes.",
      type: "success",
    });
    // If user provided a URL, it's now used; otherwise no photoUrl will be saved.
  } else {
    toastStore.addToast({
      message: authStore.error || "Impossible de mettre a jour le profil.",
      type: "error",
    });
  }

  isSaving.value = false;
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard class="profile-white-card" title="Profil Etudiant">
        <VCardText v-if="authStore.isProfileLoading" class="pt-6">
          <VSkeletonLoader type="article, article, article" />
        </VCardText>

        <VCardText v-else>
          <div class="d-flex align-center flex-wrap gap-4 mb-6">
            <VAvatar rounded="lg" size="96" color="primary" variant="tonal">
              <VImg v-if="profileForm.photoUrl" :src="profileForm.photoUrl" />
              <span v-else-if="initials" class="text-h6 font-weight-bold">{{
                initials
              }}</span>
              <VIcon v-else icon="bx-user" />
            </VAvatar>

            <div class="d-flex flex-column gap-2">
              <div class="text-subtitle-1 font-weight-medium">
                {{ fallbackText(`${profileForm.prenom} ${profileForm.nom}`) }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ fallbackText(authStore.mapRoleLabel(authStore.user?.role)) }}
              </div>
              <div class="d-flex flex-wrap gap-2 pt-1 align-items-center">
                <VTextField
                  v-model="profileForm.photoUrl"
                  label="URL de la photo"
                  placeholder="https://..."
                  :rules="[urlRule]"
                  class="flex-grow-1 me-4"
                  style="min-width: 420px"
                  density="comfortable"
                />
                <VBtn variant="tonal" color="secondary" @click="resetAvatar"
                  >Reinitialiser</VBtn
                >
              </div>
            </div>
          </div>

          <VForm class="mt-2" @submit.prevent="saveProfile">
            <VRow>
              <VCol cols="12">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  Infos Personnelles
                </div>
              </VCol>
              <VCol md="6" cols="12">
                <VTextField v-model="profileForm.prenom" label="Prenom" />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField v-model="profileForm.nom" label="Nom" />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="profileForm.email"
                  label="Email"
                  readonly
                />
              </VCol>
              <VCol v-if="!isVaeCandidate" md="6" cols="12">
                <VTextField
                  v-model="profileForm.codeINE"
                  label="Code INE"
                  readonly
                />
              </VCol>

              <VCol cols="12" class="pt-2">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  Adresse
                </div>
              </VCol>
              <VCol md="6" cols="12">
                <VTextField v-model="profileForm.telephone" label="Telephone" />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="profileForm.codePostal"
                  label="Code Postal"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField v-model="profileForm.ville" label="Ville" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="profileForm.adresse" label="Adresse" />
              </VCol>

              <VCol cols="12" class="pt-2">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  Scolarite
                </div>
              </VCol>

              <template v-if="!isVaeCandidate">
                <VCol md="4" cols="12">
                  <VTextField
                    v-model="profileForm.niveauFIE"
                    label="Niveau FIE"
                    readonly
                  />
                </VCol>
                <VCol md="4" cols="12">
                  <VTextField
                    v-model="profileForm.promotion"
                    label="Promotion"
                    readonly
                  />
                </VCol>
                <VCol md="4" cols="12">
                  <VTextField
                    v-model="profileForm.parcoursOrigine"
                    label="Parcours d'origine"
                    readonly
                  />
                </VCol>
              </template>

              <template v-else>
                <VCol md="6" cols="12">
                  <VTextField
                    v-model="profileForm.niveauEtudes"
                    label="Niveau d'etudes"
                    readonly
                  />
                </VCol>
                <VCol md="6" cols="12">
                  <VTextField
                    v-model="profileForm.secteurActivite"
                    label="Secteur d'activite"
                    readonly
                  />
                </VCol>
              </template>
            </VRow>

            <div class="d-flex flex-wrap gap-4 mt-4">
              <VBtn type="submit" :loading="isSaving" :disabled="isSaving"
                >Enregistrer</VBtn
              >
              <VBtn
                color="secondary"
                variant="tonal"
                :disabled="isSaving"
                @click="resetForm"
                >Reinitialiser</VBtn
              >
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.profile-white-card {
  background: #ffffff;
}
</style>
