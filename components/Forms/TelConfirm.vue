<template>
  <div class="d-flex flex-column">
    <validation-observer
      v-slot="{ handleSubmit, valid, invalid }"
      ref="form"
      class="flex-grow-1 d-flex"
    >
      <v-form
        ref="form"
        class="confirm-form d-flex flex-column d-sm-block pt-5 px-3 pb-6 px-sm-8 py-sm-10"
        @submit.prevent="handleSubmit(confirm)"
      >
        <h1 class="confirm-form__title text-center mb-4 mb-sm-6">
          Подтверждение номера телефона
        </h1>
        <div
          class="confirm-form__subtitle text-center mb-7"
          :class="showMainErrorMessge ? 'error--text' : ''"
        >
          <template v-if="showMainErrorMessge">
            Код подтверждения был введен неверно. <br />
            Введите корректный код в поле ниже, чтобы завершить отправку заявки:
          </template>
          <template v-else-if="canResendCode">
            Время для введения кода истекло. Запросите повторную отправку кода
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
            :dense="$vuetify.breakpoint.xs"
            outlined
            persistent-hint
            :hint="
              codeSeconds
                ? `Код состоит из ${CODE_LENGTH} цифр и действителен в течении ${codeSeconds} сек`
                : 'Время для введения кода истекло. Запросите повторную отправку кода'
            "
            class="custom-field confirm-form__code mx-auto mb-6 mb-sm-8"
          ></v-text-field>
        </validation-provider>
        <div
          class="d-flex justify-center order-6 order-sm-4 mt-auto mt-sm-0 mb-2 mb-sm-6"
        >
          <CustomButton
            :disabled="invalid"
            :active="valid"
            type="submit"
            class="flex-grow-1 flex-grow-sm-0 mr-3 mr-sm-8"
            >Отправить</CustomButton
          >
          <CustomButton
            class="flex-grow-1 flex-grow-sm-0"
            @click="$emit('go-back')"
            >Отменить</CustomButton
          >
        </div>
        <div class="d-flex justify-center mb-2 mb-sm-4">
          <a v-if="canResendCode" href="#" @click.prevent="auth">
            Повторная отправка кода подтверждения
          </a>
          <span v-else class="text-center text--light"
            >Повторная отправка кода подтверждения доступна через
            {{ smsSeconds }} сек</span
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

const SMS_INTERVAL = 1000
const SMS_SECONDS = 60
const CODE_LENGTH = 4
const CODE_SECONDS = 90

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
      smsIntervalId: null,
      codeIntervalId: null,
      smsSeconds: SMS_SECONDS,
      codeSeconds: CODE_SECONDS,
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
      this.smsSeconds = SMS_SECONDS
      this.codeSeconds = CODE_SECONDS
      try {
        const { data } = await this.$api.auth.authBySms({
          phone: this.preparePhone(this.phone),
          child_name: this.childName,
        })
        this.form.session_id = data.session_id
        this.canResendCode = false
        this.smsIntervalId = setInterval(() => {
          this.smsSeconds--
          if (!this.smsSeconds) {
            this.canResendCode = true
            clearInterval(this.smsIntervalId)
          }
        }, SMS_INTERVAL)
        this.codeIntervalId = setInterval(() => {
          this.codeSeconds--
          if (this.codeSeconds === 0) {
            clearInterval(this.codeIntervalId)
          }
        }, SMS_INTERVAL)
      } catch (err) {
        if (err.response?.status === 422 && err.response.data.errors.phone) {
          this.$refs.form.setErrors({ code: err.response.data.errors.phone })
          clearTimeout(this.smsIntervalId)
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

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .confirm-form {
    background: #fff;

    &__title {
      font-size: 16px;
    }

    &__subtitle {
      font-size: 10px;
    }

    &__code {
      ::v-deep {
        .v-messages__message {
          font-size: 11px;
        }

        .v-input__slot {
          max-width: 170px;
        }

        input {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
