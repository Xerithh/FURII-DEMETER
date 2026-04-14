<template>
  <VCard>
    <VCardItem>
      <div class="d-flex justify-space-between align-center">
        <VCardTitle>Gestion des Questions</VCardTitle>
        <div class="d-flex gap-2">
          <!-- Search -->
          <VTextField
            v-model="search"
            prepend-inner-icon="bx:search"
            placeholder="Rechercher par énoncé..."
            dense
            variant="outlined"
            class="search-field"
            clearable
            @click:clear="search = ''"
          />
          <!-- Add Button -->
          <VBtn color="primary" prepend-icon="bx:plus" @click="emitCreate">
            Ajouter
          </VBtn>
        </div>
      </div>
    </VCardItem>
    <VDivider />

    <!-- Filters Row -->
    <VCardText class="filters-row pa-4">
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <VSelect
            v-model="filterType"
            label="Filtrer par Type"
            :items="typeOptions"
            clearable
            dense
          />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VSelect
            v-model="filterDifficulte"
            label="Filtrer par Difficulté"
            :items="difficultOptions"
            clearable
            dense
          />
        </VCol>
        <VCol cols="12" md="6" class="d-flex align-center gap-2">
          <VBtn
            color="primary"
            variant="tonal"
            size="small"
            @click="applyFilters"
          >
            Appliquer Filtres
          </VBtn>
          <VBtn variant="tonal" size="small" @click="resetFilters">
            Réinitialiser
          </VBtn>
          <span class="text-caption text-medium-emphasis">
            {{ filteredQuestions.length }} question(s)
          </span>
        </VCol>
      </VRow>
    </VCardText>

    <VDivider />

    <!-- Table -->
    <VDataTable
      :headers="headers"
      :items="paginatedQuestions"
      :loading="loading"
      :items-per-page.sync="itemsPerPage"
      :page.sync="currentPage"
      class="elevation-1 data-table"
      density="comfortable"
      item-key="id"
    >
      <!-- Énoncé Column -->
      <template #item.enonce="{ item }">
        <span class="text-truncate" :title="item.enonce">
          {{ truncateText(item.enonce, 50) }}
        </span>
      </template>

      <!-- Type Column -->
      <template #item.type="{ item }">
        <VChip
          :color="getTypeColor(item.type)"
          variant="elevated"
          size="small"
          label
        >
          {{ getTypeLabel(item.type) }}
        </VChip>
      </template>

      <!-- Difficulté Column -->
      <template #item.difficulte="{ item }">
        <VChip
          :color="getDifficulteColor(item.difficulte)"
          variant="tonal"
          size="small"
          label
        >
          {{ item.difficulte }}
        </VChip>
      </template>

      <!-- Pondération Column -->
      <template #item.ponderation="{ item }">
        <span class="text-body-2">{{ item.ponderation }}</span>
      </template>

      <!-- Durée Column -->
      <template #item.dureeSecondes="{ item }">
        <span class="text-caption text-medium-emphasis">
          {{ item.dureeSecondes }}s
        </span>
      </template>

      <!-- Actif Column -->
      <template #item.actif="{ item }">
        <VSwitch
          :model-value="item.actif"
          @update:model-value="toggleActive(item, $event)"
          density="compact"
          hide-details
        />
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <VBtn
            icon="bx:edit"
            size="x-small"
            variant="text"
            color="info"
            @click="emitEdit(item)"
            title="Éditer"
          />
          <VMenu>
            <template #activator="{ props }">
              <VBtn
                icon="bx:dots-vertical-rounded"
                size="x-small"
                variant="text"
                v-bind="props"
              />
            </template>
            <VList min-width="200">
              <VListItem @click="emitViewDetail(item)">
                <template #prepend>
                  <VIcon icon="bx:info-circle" />
                </template>
                <VListItemTitle>Détails</VListItemTitle>
              </VListItem>
              <VDivider class="my-2" />
              <VListItem @click="emitDelete(item)">
                <template #prepend>
                  <VIcon icon="bx:trash" color="error" />
                </template>
                <VListItemTitle class="text-error">Supprimer</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </template>

      <!-- No data slot -->
      <template #no-data>
        <VEmptyState
          headline="Aucune question trouvée"
          text="Essayez de modifier vos filtres ou votre recherche"
        />
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup lang="ts">
import type {
  NiveauDifficulte,
  QuestionDTO,
  TypeQuestion,
} from "@/@admin/types/admin";
import { computed, ref } from "vue";

interface Props {
  questions: QuestionDTO[];
  loading?: boolean;
}

interface Emits {
  (e: "create"): void;
  (e: "edit", question: QuestionDTO): void;
  (e: "view-detail", question: QuestionDTO): void;
  (e: "delete", question: QuestionDTO): void;
  (e: "toggle-active", question: QuestionDTO, active: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  questions: () => [],
});

const emit = defineEmits<Emits>();

// State
const search = ref("");
const filterType = ref<TypeQuestion | null>(null);
const filterDifficulte = ref<NiveauDifficulte | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Options
const typeOptions = [
  { title: "QCM Simple", value: "QCM_SIMPLE" },
  { title: "QCM Multiple", value: "QCM_MULTIPLE" },
  { title: "Vrai/Faux", value: "VRAI_FAUX" },
  { title: "Réponse Libre", value: "REPONSE_LIBRE" },
];

const difficultOptions = [
  { title: "Facile", value: "FACILE" },
  { title: "Moyen", value: "MOYEN" },
  { title: "Difficile", value: "DIFFICILE" },
];

// Table Headers
const headers = [
  { title: "Énoncé", key: "enonce", width: "300px" },
  { title: "Type", key: "type", width: "120px" },
  { title: "Difficulté", key: "difficulte", width: "100px" },
  { title: "Pondération", key: "ponderation", align: "center", width: "80px" },
  { title: "Durée", key: "dureeSecondes", align: "center", width: "70px" },
  { title: "Actif", key: "actif", align: "center", width: "70px" },
  { title: "", key: "actions", align: "end", sortable: false, width: "80px" },
];

// Filtered & Paginated Data
const filteredQuestions = computed(() => {
  return props.questions.filter((question) => {
    // Search filter
    const searchLower = search.value.toLowerCase();
    const matchesSearch =
      !searchLower || question.enonce.toLowerCase().includes(searchLower);

    // Type filter
    const matchesType = !filterType.value || question.type === filterType.value;

    // Difficulté filter
    const matchesDifficulte =
      !filterDifficulte.value || question.difficulte === filterDifficulte.value;

    return matchesSearch && matchesType && matchesDifficulte;
  });
});

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredQuestions.value.slice(start, end);
});

// Helper Functions
const getTypeColor = (type: TypeQuestion) => {
  const colors: Record<TypeQuestion, string> = {
    QCM_SIMPLE: "blue",
    QCM_MULTIPLE: "purple",
    VRAI_FAUX: "teal",
    REPONSE_LIBRE: "orange",
  };
  return colors[type] || "grey";
};

const getTypeLabel = (type: TypeQuestion) => {
  const labels: Record<TypeQuestion, string> = {
    QCM_SIMPLE: "QCM Simple",
    QCM_MULTIPLE: "QCM Multiple",
    VRAI_FAUX: "Vrai/Faux",
    REPONSE_LIBRE: "Libre",
  };
  return labels[type] || type;
};

const getDifficulteColor = (difficulte: NiveauDifficulte) => {
  const colors: Record<NiveauDifficulte, string> = {
    FACILE: "success",
    MOYEN: "warning",
    DIFFICILE: "error",
  };
  return colors[difficulte] || "grey";
};

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const applyFilters = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  search.value = "";
  filterType.value = null;
  filterDifficulte.value = null;
  currentPage.value = 1;
};

const toggleActive = (question: QuestionDTO, active: boolean) => {
  emit("toggle-active", question, active);
};

// Emits
const emitCreate = () => {
  emit("create");
};

const emitEdit = (question: QuestionDTO) => {
  emit("edit", question);
};

const emitViewDetail = (question: QuestionDTO) => {
  emit("view-detail", question);
};

const emitDelete = (question: QuestionDTO) => {
  emit("delete", question);
};
</script>

<style scoped lang="scss">
.filters-row {
  background-color: rgba(0, 0, 0, 0.02);
}

.search-field {
  max-width: 250px;
}
</style>
