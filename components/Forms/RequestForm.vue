<template>
  <div>
    <validation-observer v-slot="{ handleSubmit, valid, invalid }" ref="form">
      <v-form
        ref="form"
        class="request-form pa-8"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <h1 class="request-form__title mb-6 text-center">Подать заявку</h1>
        <h4
          class="
            request-form__subtitle
            mb-6
            font-weight-regular
            text--light text-center
          "
        >
          Пожалуйста, заполните данную форму для подачи заявки на вступление в
          наши сеции и клубы
        </h4>
        <div class="request-form__group">
          <div class="request-form__label mb-2">Название секции/клуба</div>
          <validation-provider v-slot="{ errors }" name="type" rules="required">
            <v-select
              v-model="form.type"
              :items="sections"
              :error-messages="errors"
              item-text="name"
              item-value="id"
              persistent-hint
              outlined
              class="custom-field"
            ></v-select>
          </validation-provider>
        </div>
        <div class="request-form__group">
          <div class="request-form__label mb-2">ФИО заявителя</div>
          <validation-provider
            v-slot="{ errors }"
            name="applicant_name"
            rules="required"
          >
            <v-text-field
              v-model="form.applicant_name"
              :error-messages="errors"
              placeholder="Введите полное имя"
              outlined
              class="custom-field"
            ></v-text-field>
          </validation-provider>
        </div>
        <div class="request-form__group">
          <div class="request-form__label mb-2">ФИО ребенка</div>
          <validation-provider
            v-slot="{ errors }"
            name="child_name"
            rules="required"
          >
            <v-text-field
              v-model="form.child_name"
              :error-messages="errors"
              placeholder="Введите полное имя"
              outlined
              class="custom-field"
            ></v-text-field>
          </validation-provider>
        </div>
        <div class="request-form__group">
          <div class="request-form__label mb-2">Дата рождения ребенка</div>
          <validation-provider
            v-slot="{ errors }"
            name="child_birthday"
            rules="required"
          >
            <v-text-field
              v-model="form.child_birthday"
              v-mask="'##.##.####'"
              :error-messages="errors"
              placeholder="дд.мм.гггг"
              prepend-inner-icon="mdi-calendar-month-outline"
              outlined
              class="custom-field request-form__date"
            >
            </v-text-field>
          </validation-provider>
        </div>
        <div v-if="form.type === 'kubz'" class="request-form__group">
          <div class="request-form__label mb-2">ФИО сопровождающего</div>
          <validation-provider
            v-slot="{ errors }"
            name="accompanynig_person"
            rules="required"
          >
            <v-text-field
              v-model="form.accompanynig_person"
              :error-messages="errors"
              placeholder="Введите полное имя"
              outlined
              class="custom-field"
            ></v-text-field>
          </validation-provider>
        </div>
        <div class="request-form__group">
          <div class="request-form__label mb-2">Электронная почта</div>
          <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required"
          >
            <v-text-field
              v-model="form.email"
              :error-messages="errors"
              placeholder="Введите адрес"
              outlined
              class="custom-field"
            ></v-text-field>
          </validation-provider>
        </div>
        <div class="request-form__group">
          <div class="request-form__label mb-2">Телефон</div>
          <validation-provider
            v-slot="{ errors }"
            name="phone"
            rules="required"
          >
            <v-text-field
              v-model="form.phone"
              v-mask="'+7 (###) ### ## ##'"
              :error-messages="
                isPhoneChange
                  ? 'Измените номер телефона и нажмите кнопку Отправить заявку'
                  : errors
              "
              placeholder="(000) 000 00 00"
              outlined
              class="custom-field request-form__phone"
            >
              <template v-if="!form.phone" #prepend-inner> +7 </template>
            </v-text-field>
          </validation-provider>
        </div>
        <div class="request-form__group mb-7">
          <div class="request-form__label mb-2">Загрузка файлов</div>

          <div class="request-form__file-hint text--light mb-3">
            Загрузите заполненные бланки <a href="#">Согласие на съемку</a> и
            <a href="#">Заявление стр.1 и стр.2</a> в формате
            PNG/JPG/JPEG/BMP/PDF (размер не более 10 Мб). Образец заполнения
            бланка Заявления стр.1 и стр.2 смотрите <a href="#">тут</a>.
          </div>
          <validation-provider rules="min_file_count:1">
            <CustomFileInput
              v-model="form.files"
              accept="image/png,image/jpeg,image/bmp,application/pdf"
            />
          </validation-provider>
        </div>
        <template v-if="form.type">
          <div>
            <validation-provider rules="required|is_truthy">
              <v-checkbox
                v-model="form.agreement_processing_personal_data"
                :true-value="1"
                :false-value="0"
                color="success"
                hide-details
                class="d-inline-flex mt-0 mb-4"
              >
                <template #label>
                  <div class="text--small ml-2">
                    Я даю
                    <a href="#"
                      >Согласие на обработку и распространение персональных
                      данных</a
                    >
                  </div>
                </template>
              </v-checkbox>
            </validation-provider>
          </div>
          <div>
            <validation-provider rules="required|is_truthy">
              <v-checkbox
                v-model="form.have_read_personal_data_processing_policy"
                :true-value="1"
                :false-value="0"
                color="success"
                hide-details
                class="d-inline-flex mt-0 mb-4"
              >
                <template #label>
                  <div class="text--small ml-2">
                    Я ознакомлен с
                    <a href="#"> Политикой обработки персональных данных</a>
                  </div>
                </template>
              </v-checkbox>
            </validation-provider>
          </div>
          <div v-for="(checkbox, idx) in checkboxes[form.type]" :key="idx">
            <validation-provider rules="required|is_truthy">
              <v-checkbox
                v-model="form[checkbox.model]"
                :true-value="1"
                :false-value="0"
                color="success"
                hide-details
                class="d-inline-flex mt-0 mb-4"
              >
                <template #label>
                  <div class="text--small ml-2" v-html="checkbox.label"></div>
                </template>
              </v-checkbox>
            </validation-provider>
          </div>
        </template>
        <div class="text--light mb-4">
          При положительном рассмотрении вашей заявки, вам придет уведомление о
          необходимости предоставить следующие документы:<br />
          1. Оригинал заполненного заявления установленной формы;<br />
          2. Копия Свидетельства о рождении участника (до 14 лет);<br />
          3. Копия паспотрта участника (с14 лет);<br />
          4. Копия паспорта Представителя (первый разворот, лист с регистрацией
          по месту жительства, лист с отметкой “Дети”;<br />
          5. Иные документы, подтверждающие полномочия законного представителя
          участника;<br />
          6. Медицинское заключение (медицинская справка) об отсутствии
          противопоказаний для занятий конным спортом по форме Т73 (для КДФ
          “Пони клуб”)
        </div>
        <!-- <div class="request-form__code mx-auto d-flex flex-column mb-6">
          <div class="text--small mb-2">Введите код с картинки</div>
          <img src="@/assets/images/codemock.png" alt="код" />
          <validation-provider rules="required">
            <input
              v-model="form.code"
              type="text"
              class="request-form__code-input px-2 mt-3"
            />
          </validation-provider>
        </div> -->
        <div class="d-flex justify-center">
          <CustomButton :disabled="invalid" :active="valid" type="submit"
            >Отправить заявку</CustomButton
          >
        </div>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import prepareParams from '@/mixins/prepareParams'
import CustomFileInput from '@/components/FormElements/CustomFileInput'
import CustomButton from '@/components/FormElements/CustomButton'

export default {
  name: 'RequestForm',
  components: { CustomFileInput, CustomButton },
  mixins: [prepareParams],
  layout: 'request',
  props: {
    isPhoneChange: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => {},
    },
    checkboxesData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      sections: [],
    }
  },
  computed: {
    form: {
      get() {
        return this.formData
      },
      set(value) {
        this.$emit('update:form-data', value)
      },
    },
    checkboxes: {
      get() {
        return this.checkboxesData
      },
      set(value) {
        this.$emit('update:checkboxes-data', value)
      },
    },
  },
  watch: {
    'form.type'(value) {
      if (value !== 'kubz') {
        delete this.form.accompanynig_person
      }
    },
  },
  async mounted() {
    const { data } = await this.$api.manuals.getApplicationsTypes()
    this.sections = data.models
    const types = this.sections.map((item) => item.id)
    if (types.includes(this.$route.query.type)) {
      this.form.type = this.$route.query.type
      return
    }
    this.form.type = this.sections[0].id
  },
  methods: {
    async onSubmit() {
      try {
        await this.$api.applications.validate({
          ...this.form,
          child_birthday: this.prepareDate(this.form.child_birthday),
          phone: this.preparePhone(this.form.phone),
        })
        this.$emit('validated')
      } catch (err) {
        this.$modal.show('error', { err })
        if (err.response?.status === 422) {
          // debugger

          this.$refs.form.setErrors(err.response.data.errors)
        }
        // debugger
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.request-form {
  background: #fff !important;

  &__title {
    font-family: 'ALS Story', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 1.5rem;
    line-height: 1;
  }

  &__subtitle {
    line-height: 1.18;
  }

  &__group {
    margin-bottom: 2px;
  }

  &__label {
    font-size: 0.875rem;
  }

  &__date {
    ::v-deep {
      .v-input__prepend-inner {
        padding-right: 18px;
      }

      .v-icon {
        color: $text-color !important;
      }
    }
  }

  &__phone {
    ::v-deep {
      .v-input__prepend-inner {
        margin-top: 19px;
        color: $text-color !important;
      }
    }
  }

  &__file-hint {
    font-size: 0.69rem;
    line-height: 1.18;
  }

  &__code {
    max-width: 160px;

    &-input {
      border: 0.5px solid #99a2ad;
      border-radius: 3px;
      max-width: 100%;
    }
  }

  ::v-deep {
    .v-messages__message {
      text-align: right;
    }
  }
}
</style>
