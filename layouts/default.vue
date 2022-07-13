<template>
  <v-app>
    <v-app-bar class="header flex-grow-0 px-10 mb-3">
      <img src="~/assets/images/atom-logo.png" alt="лого" />
      <v-avatar color="primary" size="40">А</v-avatar>
    </v-app-bar>
    <div class="flex-grow-1 px-10">
      <Nuxt />
    </div>
    <Modal></Modal>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: 80px;
  background: none !important;
  box-shadow: none !important;

  ::v-deep {
    .v-toolbar__content {
      padding: 0 !important;
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
