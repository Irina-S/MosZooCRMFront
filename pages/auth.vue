<template>
  <validation-observer v-slot="{ handleSubmit }" ref="form">
    <form
      class="auth-form d-flex flex-column"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <h3 class="text--enlarged font-weight-bold mb-8">Авторизация</h3>
      <h4 class="text--enlarged text--light font-weight-regular mb-7">
        Авторизуйтесь для входа в систему
      </h4>

      <div class="mb-6">
        <validation-provider v-slot="{ errors }" name="email" mode="passive">
          <v-text-field
            v-model="form.email"
            label="Введите e-mail"
            :error-messages="errors"
            persistent-hint
            hint="E-mail*"
            single-line
            outlined
            class="auth-form__field"
          ></v-text-field>
        </validation-provider>
      </div>

      <div class="mb-8">
        <validation-provider
          v-slot="{ errors }"
          name="password"
          vid="password"
          mode="passive"
        >
          <v-text-field
            v-model="form.password"
            label="Введите пароль"
            :error-messages="errors"
            persistent-hint
            hint="Пароль*"
            single-line
            outlined
            class="auth-form__field"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </validation-provider>
        <NuxtLink to="/" class="d-inline-block mt-4 text-decoration-none"
          >Забыли пароль?</NuxtLink
        >
      </div>

      <v-checkbox
        v-model="form.remember_me"
        label="Запомнить меня на этом устройстве"
        color="primary"
        hide-details
        class="auth-form__checkbox align-self-start mb-10 text--light"
      />

      <v-btn
        depressed
        large
        type="submit"
        color="primary"
        class="align-self-start"
      >
        Войти
      </v-btn>
    </form>
  </validation-observer>
</template>

<script>
export default {
  name: 'SignInPage',
  layout: 'auth',
  data() {
    return {
      form: {
        email: null,
        password: null,
        remember_me: false,
      },

      showPassword: false,
    }
  },
  head() {
    return {
      title: 'Вход',
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$auth.loginWith('local', {
          data: this.form,
        })
        this.$router.push('/')
      } catch (err) {
        if (err.response?.status === 422) {
          this.$refs.form.setErrors(err.response.data.errors)
        }
        this.$modal.show('error', { err })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.auth-form {
  &__field {
    ::v-deep {
      .v-input__slot {
        margin-bottom: 0 !important;
      }

      .v-input__control {
        flex-direction: column-reverse !important;
      }

      .v-text-field__details {
        min-height: 18px !important;
        overflow: visible !important;
        padding: 0 !important;
      }

      .v-messages {
        font-size: 18px !important;
        color: $text-color;

        &__message {
          line-height: 1 !important;
        }
      }
    }
  }

  &__checkbox {
    ::v-deep {
      .v-label {
        color: $text-color;
      }
    }
  }
}
</style>
