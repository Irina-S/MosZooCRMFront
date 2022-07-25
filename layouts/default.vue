<template>
  <v-app>
    <v-app-bar class="header flex-grow-0 px-10 mb-3">
      <img src="~/assets/images/atom-logo.png" alt="лого" />
      <v-avatar color="primary" size="40" class="avatar">{{
        name[0].toUpperCase()
      }}</v-avatar>
    </v-app-bar>
    <div class="flex-grow-1 px-10">
      <Nuxt />
    </div>
    <Modal></Modal>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',
  data() {
    return {}
  },
  computed: {
    ...mapGetters('user', ['name']),
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

.avatar {
  box-shadow: 0 4px 4px rgba(191, 184, 206, 0.5),
    2px 2px 15px rgba(191, 184, 206, 0.5);
}
</style>
