<script setup>
const notifications = ref([
  {
    type: 'Nouveaux modules recommandés',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'Rappels d\'évaluations',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'Progression et badges',
    email: true,
    browser: true,
    app: false,
  },
  {
    type: 'Nouveaux messages du forum',
    email: false,
    browser: true,
    app: false,
  },
  {
    type: 'Mises à jour du parcours',
    email: true,
    browser: true,
    app: true,
  },
])

const selectedNotification = ref('Uniquement quand je suis en ligne')
</script>

<template>
  <VCard title="Préférences de Notifications">
    <VCardText>
      Activez les permissions de votre navigateur pour recevoir les notifications.
      <a href="javascript:void(0)">Demander l'autorisation</a>
    </VCardText>

    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th scope="col">
            Type
          </th>
          <th scope="col">
            EMAIL
          </th>
          <th scope="col">
            NAVIGATEUR
          </th>
          <th scope="col">
            APP
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="notif in notifications"
          :key="notif.type"
        >
          <td>
            {{ notif.type }}
          </td>
          <td>
            <VCheckbox v-model="notif.email" />
          </td>
          <td>
            <VCheckbox v-model="notif.browser" />
          </td>
          <td>
            <VCheckbox v-model="notif.app" />
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCard>
</template>

<style lang="scss" scoped>
.v-table {
  th {
    text-align: start !important;
  }
}
</style>
