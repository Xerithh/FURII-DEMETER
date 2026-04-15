<template>
  <div class="admin-questions">
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <PageHeader
              icon="bx-help-circle"
              title="Gestion des Questions"
              subtitle="Créez, modifiez et organisez la banque de questions."
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <div class="d-flex justify-space-between align-center mb-6">
      <div />
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
        <StatCard
          label="Total"
          :value="adminStore.questions.length"
          icon="bx-help-circle"
          color="primary"
          format="number"
        />
      </VCol>
      <VCol cols="6" sm="3">
        <StatCard
          label="Facile"
          :value="
            adminStore.questions.filter((q) => q.difficulte === 'FACILE').length
          "
          icon="bx-star"
          color="success"
          format="number"
        />
      </VCol>
      <VCol cols="6" sm="3">
        <StatCard
          label="Moyen"
          :value="
            adminStore.questions.filter((q) => q.difficulte === 'MOYEN').length
          "
          icon="bx-bar-chart-alt-2"
          color="warning"
          format="number"
        />
      </VCol>
      <VCol cols="6" sm="3">
        <StatCard
          label="Difficile"
          :value="
            adminStore.questions.filter((q) => q.difficulte === 'DIFFICILE')
              .length
          "
          icon="bx-flame"
          color="error"
          format="number"
        />
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
import StatCard from "@/@admin/components/cards/StatCard.vue";
import QuestionForm from "@/@admin/components/forms/QuestionForm.vue";
import QuestionsTable from "@/@admin/components/tables/QuestionsTable.vue";
import { useAdminStore } from "@/@admin/stores/admin";
import type { QuestionDTO } from "@/@admin/types/admin";
import PageHeader from "@/components/PageHeader.vue";
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
