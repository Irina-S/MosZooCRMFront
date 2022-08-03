<template>
  <validation-observer v-slot="{ handleSubmit }" ref="form">
    <form
      class="auth-form d-flex flex-column"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <h3
        class="font-weight-bold mb-4 mb-sm-8"
        :class="!$vuetify.breakpoint.xs ? 'text--enlarged' : ''"
      >
        Авторизация
      </h3>
      <h4
        class="text--light font-weight-regular mb-6 mb-sm-7"
        :class="!$vuetify.breakpoint.xs ? 'text--enlarged' : ''"
      >
        Авторизуйтесь для входа в систему
      </h4>

      <div class="mb-4 mb-sm-6">
        <validation-provider v-slot="{ errors }" name="email" mode="passive">
          <v-text-field
            v-model="form.email"
            label="Введите e-mail"
            :error-messages="errors"
            :dense="$vuetify.breakpoint.xs"
            persistent-hint
            hint="E-mail*"
            single-line
            outlined
            class="auth-form__field"
          ></v-text-field>
        </validation-provider>
      </div>

      <div class="mb-4 mb-sm-8">
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
            :dense="$vuetify.breakpoint.xs"
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
        <!-- <NuxtLink to="/" class="d-inline-block mt-4 text-decoration-none"
          >Забыли пароль?</NuxtLink
        > -->
      </div>

      <v-checkbox
        v-model="form.remember_me"
        label="Запомнить меня на этом устройстве"
        color="primary"
        hide-details
        class="auth-form__checkbox align-self-start mb-8 mb-sm-10 text--light"
      />

      <v-btn
        :disabled="loading"
        depressed
        large
        type="submit"
        color="primary"
        class="align-self-sm-start"
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
      loading: false,
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
        this.loading = true
        await this.$auth.loginWith('local', {
          data: this.form,
        })
        this.$router.push('/')
      } catch (err) {
        if (err.response?.status === 422) {
          this.$refs.form.setErrors(err.response.data.errors)
          return
        }
        this.$modal.show('error', { err })
      } finally {
        this.loading = false
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

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .auth-form {
    ::v-deep {
      .v-messages {
        font-size: 12px !important;
      }
    }

    &__checkbox {
      ::v-deep {
        .v-label {
          margin-top: 4px !important;
          font-size: 12px !important;
        }
      }
    }
  }
}
</style>
