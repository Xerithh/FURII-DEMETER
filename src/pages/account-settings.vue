<script setup>
import AccountSettingsAccount from "@/views/pages/account-settings/AccountSettingsAccount.vue";
import AccountSettingsSecurity from "@/views/pages/account-settings/AccountSettingsSecurity.vue";
import { useTheme } from "vuetify";

const route = useRoute();
const activeTab = ref(route.query.tab || route.params.tab || "account");
const theme = useTheme();
const AUTO_DARK_MODE_SESSION_KEY = "isisu:auto-dark-mode";

const autoDarkMode = ref(false);

const applyAutoDarkMode = () => {
  if (!autoDarkMode.value) return;

  theme.global.name.value = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
};

const onSystemThemeChange = () => {
  applyAutoDarkMode();
};

// Keep activeTab in sync with route query/params (so links like ?tab=settings work)
watch(
  () => route.query.tab,
  (val) => {
    if (val) activeTab.value = val;
  },
);
watch(
  () => route.params.tab,
  (val) => {
    if (val) activeTab.value = val;
  },
);

// tabs
const tabs = [
  {
    title: "Profil",
    icon: "bx-user",
    tab: "account",
  },
  {
    title: "Sécurité",
    icon: "bx-lock-open",
    tab: "security",
  },
  {
    title: "Paramètres",
    icon: "bx-cog",
    tab: "settings",
  },
];

onMounted(() => {
  autoDarkMode.value =
    sessionStorage.getItem(AUTO_DARK_MODE_SESSION_KEY) === "true";
  applyAutoDarkMode();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", onSystemThemeChange);
});

onBeforeUnmount(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", onSystemThemeChange);
});

watch(autoDarkMode, (value) => {
  sessionStorage.setItem(AUTO_DARK_MODE_SESSION_KEY, String(value));
  applyAutoDarkMode();
});
</script>

<template>
  <div>
    <VTabs v-model="activeTab" show-arrows class="v-tabs-pill">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition">
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Settings -->
      <VWindowItem value="settings">
        <VCard title="Paramètres Généraux">
          <VCardText>
            <VForm>
              <VRow>
                <VCol cols="12">
                  <VSwitch
                    v-model="autoDarkMode"
                    label="Mode sombre automatique"
                  />
                </VCol>
              </VRow>
              <div class="d-flex flex-wrap gap-4 mt-4">
                <VBtn type="submit"> Enregistrer </VBtn>
                <VBtn color="secondary" variant="tonal" type="reset">
                  Réinitialiser
                </VBtn>
              </div>
            </VForm>
          </VCardText>
        </VCard>
      </VWindowItem>
    </VWindow>
  </div>
</template>
