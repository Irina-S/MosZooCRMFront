<template>
  <div>
    <validation-observer v-slot="{ handleSubmit, valid, invalid }" ref="form">
      <v-form
        class="confirm-form px-10 py-10"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <h1 class="confirm-form__title text-center mb-6">
          Подтверждение номера телефона
        </h1>
        <div class="text-center mb-7">
          Код подтверждения отправлен вам по sms на номер {{ phone }}. Введите
          его в поле ниже, чтобы завершить отправку заявки:
        </div>
        <validation-provider rules="required|length:5">
          <v-text-field
            v-model="form.code"
            v-mask="'#####'"
            outlined
            persistent-hint
            hint="Код состоит из 5 цифр и действителен в течении 90 сек "
            class="custom-field confirm-form__code mx-auto mb-8"
          ></v-text-field>
        </validation-provider>
        <div class="d-flex justify-center mb-6">
          <CustomButton
            :disabled="invalid"
            :active="valid"
            type="submit"
            class="mr-8"
            >Отправить</CustomButton
          >
          <CustomButton @click="$emit('go-back')">Отменить</CustomButton>
        </div>
        <div class="text-center text--light mb-4">
          Повторная отправка кода подтверждения
        </div>
        <div class="d-flex justify-center">
          <a href="#" @click.prevent="$emit('change-phone')"
            >Изменить номер телефона</a
          >
        </div>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import CustomButton from '@/components/FormElements/CustomButton'
export default {
  components: { CustomButton },
  props: {
    phone: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        code: null,
      },
    }
  },
  methods: {
    onSubmit() {
      this.$emit('confirmed')
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm-form {
  background: #fff;

  &__title {
    font-family: 'ALS Story', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 1.7rem;
    line-height: 1;
    text-align: center;
  }

  &__code {
    max-width: 353px;

    ::v-deep {
      .v-text-field__details {
        padding: 0;
      }

      .v-messages__message {
        text-align: center;
      }

      input {
        text-align: center;
        font-family: 'ALS Story', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 32px;
        line-height: 130%;
        letter-spacing: 0.175em;
      }
    }
  }
}
</style>
