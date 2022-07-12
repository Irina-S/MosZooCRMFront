<template>
  <v-app class="auth-page">
    <div class="flex-grow-1 d-flex justify-content">
      <div class="auth-page__left">
        <img src="~/assets/images/atom-logo.png" alt="лого" class="mb-14" />
        <Nuxt />
      </div>
      <div class="auth-page__right">
        <div class="d-flex flex-column align-center mb-16">
          <span class="auth-page__welcome font-weight-bold mb-4"
            >Добро пожаловать в</span
          >
          <img src="~/assets/images/atom-logo-white.svg" alt="Атом" />
        </div>
        <img
          class="auth-page__img"
          src="~assets/images/carbon_collaborate.svg"
          alt="collaborate"
        />
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'AuthLayout',
}
</script>

<style lang="scss">
.auth-page {
  &__left {
    min-height: 100%;
    max-width: 580px;
    flex: 45% 0 0;
    padding: 34px 50px;
  }

  &__right {
    min-height: 100%;
    flex: auto 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 168px 0;
    background: $button-color-primary;
  }

  &__welcome {
    font-size: 36px;
    line-height: 42px;
    color: #fff;
    opacity: 0.5;
    user-select: none;
  }

  &__img {
    max-width: 307px;
  }
}
</style>
