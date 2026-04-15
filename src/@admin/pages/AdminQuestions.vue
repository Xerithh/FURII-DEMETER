<template>
  <div class="admin-questions">
    <VBreadcrumbs :items="breadcrumbs" class="mb-6" />

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Gestion des Questions</h1>
      <VBtn
        color="primary"
        prepend-icon="bx:refresh"
        @click="refresh"
        :loading="adminStore.isQuestionsLoading"
      >
        Actualiser
      </VBtn>
    </div>

    <!-- Loading state -->
    <VProgressLinear
      v-if="adminStore.isQuestionsLoading"
      indeterminate
      class="mb-6"
    />
    <!-- Stats rapides -->
<VRow class="mb-6">
  <VCol cols="6" sm="3">
    <VCard>
      <VCardText class="text-center pa-3">
        <p class="text-h5 font-weight-bold text-primary mb-0">
          {{ adminStore.questions.length }}
        </p>
        <p class="text-xs text-disabled mb-0">Total</p>
      </VCardText>
    </VCard>
  </VCol>
  <VCol cols="6" sm="3">
    <VCard>
      <VCardText class="text-center pa-3">
        <p class="text-h5 font-weight-bold text-success mb-0">
          {{ adminStore.questions.filter(q => q.difficulte === 'FACILE').length }}
        </p>
        <p class="text-xs text-disabled mb-0">Facile</p>
      </VCardText>
    </VCard>
  </VCol>
  <VCol cols="6" sm="3">
    <VCard>
      <VCardText class="text-center pa-3">
        <p class="text-h5 font-weight-bold text-warning mb-0">
          {{ adminStore.questions.filter(q => q.difficulte === 'MOYEN').length }}
        </p>
        <p class="text-xs text-disabled mb-0">Moyen</p>
      </VCardText>
    </VCard>
  </VCol>
  <VCol cols="6" sm="3">
    <VCard>
      <VCardText class="text-center pa-3">
        <p class="text-h5 font-weight-bold text-error mb-0">
          {{ adminStore.questions.filter(q => q.difficulte === 'DIFFICILE').length }}
        </p>
        <p class="text-xs text-disabled mb-0">Difficile</p>
      </VCardText>
    </VCard>
  </VCol>
</VRow>

    <!-- Questions Table -->
    <QuestionsTable
      :questions="adminStore.questions"
      :loading="adminStore.isQuestionsLoading"
      @create="handleCreate"
      @edit="handleEdit"
      @view-detail="handleViewDetail"
      @delete="handleDelete"
      @toggle-active="handleToggleActive"
    />

    <!-- Question Form Dialog -->
    <QuestionForm
      :question="selectedQuestion"
      :open="showFormDialog"
      @close="closeForm"
      @submit="submitForm"
    />

    <!-- Confirm Delete Dialog -->
    <VDialog v-model="showConfirmDeleteDialog" max-width="400">
      <VCard>
        <VCardItem>
          <VCardTitle class="text-error">Confirmer la suppression</VCardTitle>
        </VCardItem>
        <VDivider />
        <VCardText class="pa-6">
          <p v-if="questionToDelete">
            Êtes-vous sûr de vouloir supprimer cette question ?
          </p>
          <p class="text-caption text-medium-emphasis">
            {{ questionToDelete?.enonce }}
          </p>
          <p class="text-caption text-medium-emphasis mt-2">
            Cette action est irréversible.
          </p>
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn text @click="showConfirmDeleteDialog = false">Annuler</VBtn>
          <VBtn color="error" @click="confirmDelete" :loading="isDeleting">
            Supprimer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Detail Dialog (TODO) -->
    <VDialog v-model="showDetailDialog" max-width="700">
      <VCard>
        <VCardItem>
          <VCardTitle>Détails Question</VCardTitle>
        </VCardItem>
        <VDivider />
        <VCardText class="pa-6">
          <p v-if="selectedQuestion" class="text-body-2">
            <strong>Énoncé:</strong> {{ selectedQuestion.enonce }} <br />
            <strong>Type:</strong> {{ selectedQuestion.type }} <br />
            <strong>Difficulté:</strong> {{ selectedQuestion.difficulte }}
            <br />
            <strong>Pondération:</strong> {{ selectedQuestion.ponderation }}
            <br />
            <strong>Durée:</strong> {{ selectedQuestion.dureeSecondes }}s <br />
            <strong>Actif:</strong> {{ selectedQuestion.actif ? "Oui" : "Non" }}
            <br />
            <strong>Créée:</strong>
            {{ formatDate(selectedQuestion.dateCreation) }}
          </p>
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn text @click="showDetailDialog = false">Fermer</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import QuestionForm from "@/@admin/components/forms/QuestionForm.vue";
import QuestionsTable from "@/@admin/components/tables/QuestionsTable.vue";
import { useAdminStore } from "@/@admin/stores/admin";
import type { QuestionDTO } from "@/@admin/types/admin";
import { useToastStore } from "@/stores/toast";
import { onMounted, ref } from "vue";

const adminStore = useAdminStore();
const toastStore = useToastStore();

// Dialog states
const showFormDialog = ref(false);
const showDetailDialog = ref(false);
const showConfirmDeleteDialog = ref(false);
const selectedQuestion = ref<QuestionDTO | null>(null);
const questionToDelete = ref<QuestionDTO | null>(null);
const isDeleting = ref(false);

const breadcrumbs = [
  {
    title: "Admin",
    href: "/admin",
    disabled: false,
  },
  {
    title: "Questions",
    disabled: true,
  },
];

onMounted(() => {
  adminStore.fetchQuestions();
});

const refresh = () => {
  adminStore.fetchQuestions();
};

// Action handlers
const handleCreate = () => {
  selectedQuestion.value = null;
  showFormDialog.value = true;
};

const handleEdit = (question: QuestionDTO) => {
  selectedQuestion.value = question;
  showFormDialog.value = true;
};

const handleViewDetail = (question: QuestionDTO) => {
  selectedQuestion.value = question;
  showDetailDialog.value = true;
};

const handleDelete = (question: QuestionDTO) => {
  questionToDelete.value = question;
  showConfirmDeleteDialog.value = true;
};

const handleToggleActive = async (question: QuestionDTO, active: boolean) => {
  try {
    await adminStore.toggleQuestion(question.id, active);
  } catch (error) {
    console.error("handleToggleActive error:", error);
  }
};

const confirmDelete = async () => {
  if (!questionToDelete.value) return;

  isDeleting.value = true;
  try {
    await adminStore.deleteQuestion(questionToDelete.value.id);
    showConfirmDeleteDialog.value = false;
    questionToDelete.value = null;
  } catch (error) {
    console.error("confirmDelete error:", error);
  } finally {
    isDeleting.value = false;
  }
};

const closeForm = () => {
  showFormDialog.value = false;
  selectedQuestion.value = null;
};

const submitForm = async (data: any) => {
  try {
    // Clean payload to match CreateQuestionDTO schema
    const cleanedData = {
      enonce: data.enonce,
      type: data.type,
      difficulte: data.difficulte,
      dureeSecondes: data.dureeSecondes,
      competenceIds: data.competenceIds || [],
      choix: data.choix.map((choice: any) => ({
        contenu: choice.contenu,
        estCorrect: choice.estCorrect,
        ordre: choice.ordre,
      })),
    };

    if (data.id) {
      // Edit existing question
      await adminStore.updateQuestion(data.id, cleanedData);
    } else {
      // Create new question
      await adminStore.createQuestion(cleanedData);
      // Refresh to ensure we have latest data from server
      await adminStore.fetchQuestions();
    }
    closeForm();
  } catch (error) {
    console.error("submitForm error:", error);
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>
