<template>
  <div>
    <validation-observer v-slot="{ handleSubmit, valid, invalid }" ref="form">
      <v-form
        ref="form"
        class="confirm-form px-5 py-10"
        @submit.prevent="handleSubmit(confirm)"
      >
        <h1 class="confirm-form__title text-center mb-6">
          Подтверждение номера телефона
        </h1>
        <div
          class="text-center mb-7"
          :class="showMainErrorMessge ? 'error--text' : ''"
        >
          <template v-if="showMainErrorMessge">
            Код подтверждения был введен не верно. <br />
            Введите корректный код в поле ниже, чтобы завершить отправку заявки:
          </template>
          <template v-else>
            Код подтверждения отправлен вам по sms на номер {{ phone }}.<br />
            Введите его в поле ниже, чтобы завершить отправку заявки:
          </template>
        </div>
        <validation-provider
          v-slot="{ errors }"
          name="code"
          :rules="`required|length:${CODE_LENGTH}`"
        >
          <v-text-field
            v-model="form.code"
            v-mask="'#####'"
            :error-messages="errors"
            outlined
            persistent-hint
            :hint="`Код состоит из ${CODE_LENGTH} цифр и действителен в течении 90 сек`"
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
        <div class="d-flex justify-center mb-4">
          <a v-if="canResendCode" href="#" @click.prevent="auth">
            Повторная отправка кода подтверждения
          </a>
          <span v-else class="text--light"
            >Повторная отправка кода подтверждения</span
          >
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
import prepareParams from '@/mixins/prepareParams'
import CustomButton from '@/components/FormElements/CustomButton'

const SMS_TIMEOUT = 90000
const CODE_LENGTH = 4

export default {
  components: { CustomButton },
  mixins: [prepareParams],
  props: {
    phone: {
      type: String,
      default: null,
    },
    childName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      CODE_LENGTH,
      canResendCode: false,
      smsTimerId: null,
      showMainErrorMessge: false,
      form: {
        code: null,
        session_id: null,
      },
    }
  },
  async mounted() {
    await this.auth()
  },
  methods: {
    async auth() {
      this.showMainErrorMessge = false
      this.$refs.form.reset()
      try {
        const { data } = await this.$api.auth.authBySms({
          phone: this.preparePhone(this.phone),
          child_name: this.childName,
        })
        this.form.session_id = data.session_id
        this.canResendCode = false
        this.smsTimerId = setTimeout(() => {
          this.canResendCode = true
        }, SMS_TIMEOUT)
      } catch (err) {
        if (err.response?.status === 422 && err.response.data.errors.phone) {
          this.$refs.form.setErrors({ code: err.response.data.errors.phone })
          clearTimeout(this.smsTimerId)
          return
        }
        this.$modal.show('error', { err })
      }
    },
    async confirm() {
      try {
        this.form.phone = this.preparePhone(this.phone)
        const { token } = await this.$api.auth.confirm(this.form)
        this.$auth.strategy.token.set(token)
        console.log(token)
        this.$emit('confirmed')
      } catch (err) {
        if (err.response?.status === 422) {
          this.showMainErrorMessge = true
          this.$refs.form.setErrors(err.response.data.errors)
          return
        }
        this.$modal.show('error', { err })
      }
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
    ::v-deep {
      .v-text-field__details {
        padding: 0;
      }

      .v-input__slot {
        max-width: 353px;
        margin: 0 auto 8px;
      }

      .v-messages__message {
        text-align: center;
        line-height: 1.4;
      }

      input {
        padding: 0 !important;
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
