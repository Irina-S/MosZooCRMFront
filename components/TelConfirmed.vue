<template>
  <div class="flex-grow-1 d-flex d-sm-block">
    <div class="confirmation flex-grow-1 pa-3 pa-sm-8">
      <div class="d-flex justify-end">
        <v-icon class="text--default" @click="$emit('close')">mdi-close</v-icon>
      </div>
      <h1 class="confirmation__title text-center my-8">
        Номер телефона успешно подтвержден
      </h1>
      <div class="confirmation__subtitle text-center">
        Ваша заявка отправлена. Уведомление об этом вы получите на ваш адрес
        электронной почты
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.confirmation {
  background: #fff;

  &__title {
    font-family: 'ALS Story', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 1.7rem;
    line-height: 1;
  }
}

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .confirmation {
    &__title {
      font-size: 16px;
    }

    &__subtitle {
      font-size: 10px;
    }
  }
}
</style>
