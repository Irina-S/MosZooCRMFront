<template>
  <v-app class="auth-page">
    <div class="flex-grow-1 d-flex justify-content">
      <div class="auth-page__left">
        <CustomChip class="font-weight-bold mb-14"
          ><span class="text--enlarged">АдминАтом</span></CustomChip
        >
        <Nuxt />
      </div>
      <div class="auth-page__right">
        <h1 class="auth-page__welcome">
          Добро пожаловать в
          <br />
          АдминАтом
        </h1>
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
import CustomChip from '@/components/FormElements/CustomChip'

export default {
  name: 'AuthLayout',
  components: { CustomChip },
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
    background: $button-color-success;
  }

  &__welcome {
    margin-bottom: 70px;
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 42px;
    text-align: center;
    color: #fff;
    opacity: 0.5;
    user-select: none;
  }

  &__img {
    max-width: 307px;
  }
}
</style>
