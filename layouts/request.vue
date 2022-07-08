<template>
  <v-app class="request-page">
    <v-app-bar
      elevation="0"
      class="request-page__header flex-grow-0 d-flex align-center px-6"
    >
      <v-app-bar-nav-icon
        ><img src="@/assets/images/logo.png" alt="лого"
      /></v-app-bar-nav-icon>
    </v-app-bar>
    <div
      class="
        request-page__content
        flex-grow-1
        d-flex
        flex-column
        justify-center
        mx-auto
        mt-6
        mb-18
      "
    >
      <Nuxt />
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'RequestLayout',
}
</script>

<style lang="scss" scoped>
.request-page {
  background: linear-gradient(
    180deg,
    #01917f 0%,
    #044846 32.32%,
    #042f33 52.59%,
    #05282d 82.57%
  );

  &__header {
    height: 80px !important;
    background: #05282d !important;
  }

  &__content {
    width: 624px;
  }
}
</style>
