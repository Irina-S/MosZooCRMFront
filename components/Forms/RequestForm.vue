<template>
  <div>
    <v-form class="request-form pa-8" @submit.prevent="onSubmit">
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
        <v-select
          :items="sectionTypes"
          v-model="form.type"
          persistent-hint
          outlined
          return-object
          class="custom-field"
        ></v-select>
      </div>
      <div class="request-form__group">
        <div class="request-form__label mb-2">ФИО заявителя</div>
        <v-text-field
          v-model="form.requesterName"
          placeholder="Введите полное имя"
          outlined
          class="custom-field"
        ></v-text-field>
      </div>
      <div class="request-form__group">
        <div class="request-form__label mb-2">ФИО ребенка</div>
        <v-text-field
          v-model="form.childName"
          placeholder="Введите полное имя"
          outlined
          class="custom-field"
        ></v-text-field>
      </div>
      <div class="request-form__group">
        <div class="request-form__label mb-2">Дата рождения ребенка</div>
        <v-text-field
          v-model="form.childBirthDate"
          v-mask="'##.##.####'"
          placeholder="дд.мм.гггг"
          prepend-inner-icon="mdi-calendar-month-outline"
          outlined
          class="custom-field request-form__date"
        >
        </v-text-field>
      </div>
      <div class="request-form__group">
        <div class="request-form__label mb-2">ФИО сопровождающего</div>
        <v-text-field
          v-model="form.maintainerName"
          placeholder="Введите полное имя"
          outlined
          class="custom-field"
        ></v-text-field>
      </div>
      <div class="request-form__group">
        <div class="request-form__label mb-2">Электронная почта</div>
        <v-text-field
          v-model="form.email"
          placeholder="Введите адрес"
          outlined
          class="custom-field"
        ></v-text-field>
      </div>
      <div class="request-form__group">
        <div class="request-form__label mb-2">Телефон</div>
        <v-text-field
          v-model="form.phone"
          v-mask="'+7 (###) ### ## ##'"
          placeholder="(000) 000 00 00"
          outlined
          class="custom-field request-form__phone"
        >
          <template v-if="!form.phone" #prepend-inner> +7 </template>
        </v-text-field>
      </div>
      <div class="request-form__group mb-7">
        <div class="request-form__label mb-2">Загрузка файлов</div>

        <div class="request-form__file-hint text--light mb-3">
          Загрузите заполненные бланки <a href="#">Согласие на съемку</a> и
          <a href="#">Заявление стр.1 и стр.2</a> в формате PNG/JPG/JPEG/BMP/PDF
          (размер не более 10 Мб). Образец заполнения бланка Заявления стр.1 и
          стр.2 смотрите <a href="#">тут</a>.
        </div>
        <CustomFileInput v-model="form.files" />
      </div>
      <template v-if="form.type">
        <v-checkbox
          v-for="(checkbox, idx) in checkboxes[form.type.type]"
          :key="idx"
          v-model="form[checkbox.name]"
          color="success"
          hide-details
          class="d-inline-flex mt-0 mb-4"
        >
          <template #label>
            <div v-html="checkbox.label" class="text--normal ml-2"></div>
          </template>
        </v-checkbox>
      </template>

      <div class="text--light mb-4">
        При положительном рассмотрении вашей заявки, вам придет уведомление о
        необходимости предоставить следующие документы:<br />
        1. Оригинал заполненного заявления установленной формы;<br />
        2. Копия Свидетельства о рождении участника (до 14 лет);<br />
        3. Копия паспотрта участника (с14 лет);<br />
        4. Копия паспорта Представителя (первый разворот, лист с регистрацией по
        месту жительства, лист с отметкой “Дети”;<br />
        5. Иные документы, подтверждающие полномочия законного представителя
        участника;<br />
        6. Медицинское заключение (медицинская справка) об отсутствии
        противопоказаний для занятий конным спортом по форме Т73 (для КДФ “Пони
        клуб”)
      </div>
      <div class="request-form__code mx-auto d-flex flex-column mb-6">
        <div class="mb-2">Введите код с картинки</div>
        <img src="@/assets/images/codemock.png" alt="код" />
        <input type="text" class="request-form__code-input px-2 mt-3" />
      </div>
      <div class="d-flex justify-center">
        <CustomButton type="submit">Отправить заявку</CustomButton>
      </div>
    </v-form>
  </div>
</template>

<script>
import CustomFileInput from '@/components/FormElements/CustomFileInput'
import CustomButton from '@/components/FormElements/CustomButton'

export default {
  name: 'RequestForm',
  components: { CustomFileInput, CustomButton },
  layout: 'request',
  data() {
    return {
      sectionTypes: [
        {
          value: 1,
          type: 'kubz',
          text: 'КЮБЗ',
        },
        {
          value: 2,
          type: 'poni',
          text: 'Пони-клуб',
        },
        {
          value: 3,
          type: 'colors',
          text: 'Краски мира',
        },
      ],
      checkboxes: {
        kubz: [
          {
            name: 'agreeProcessing',
            label: `Я даю <a href="#">Согласие на обработку и распространение персональных данных</a>`,
          },
          {
            name: 'agreePolicy',
            label: `Я ознакомлен с <a href="#"> Политикой обработки персональных данных</a>`,
          },
          {
            name: 'agreeKubzRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "КЮБЗ"</a>`,
          },
          {
            name: 'agreeCulture',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «КЮБЗ»</a>`,
          },
          {
            name: 'agreeInnerRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «КЮБЗ»</a>`,
          },
          {
            name: 'agreeSafetyRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «КЮБЗ» при экспедициях и в полевых условиях</a>`,
          },
          {
            name: 'agreeInnerRules2',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «КЮБЗ»</a>`,
          },
          {
            name: 'agreeRegulation',
            label: `Я ознакомлен с <a href="#">Уставом КДФ «КЮБЗ»</a>`,
          },
        ],
        poni: [
          {
            name: 'agreeProcessing',
            label: `Я даю <a href="#">Согласие на обработку и распространение персональных данных</a>`,
          },
          {
            name: 'agreePolicy',
            label: `Я ознакомлен с <a href="#"> Политикой обработки персональных данных</a>`,
          },
          {
            name: 'agreePoniRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "Пони-клуб"</a>`,
          },
          {
            name: 'agreePoniCulture',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «Пони клуб»</a>`,
          },
          {
            name: 'agreePoniInnerRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «Пони клуб»</a>`,
          },
          {
            name: 'agreePoniSafetyRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Пони клуб» </a>`,
          },
          {
            name: 'agreeTest',
            label: `Я ознакомлен и согласен с <a href="#">Вступительными испытаниями КДФ «Пони клуб»</a>`,
          },
        ],
        colors: [
          {
            name: 'agreeProcessing',
            label: `Я даю <a href="#">Согласие на обработку и распространение персональных данных</a>`,
          },
          {
            name: 'agreePolicy',
            label: `Я ознакомлен с <a href="#"> Политикой обработки персональных данных</a>`,
          },
          {
            name: 'agreeColorsRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "Краски мира"</a>`,
          },
          {
            name: 'agreeColorsCulture',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «Краски мира»</a>`,
          },
          {
            name: 'agreeColorsInnerRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «Краски мира»</a>`,
          },
          {
            name: 'agreeColorsSafetyRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Краски мира» при экспедиции в полевых условиях</a>`,
          },
          {
            name: 'agreeColorsSafetyRules2',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Краски мира» </a>`,
          },
          {
            name: 'agreeColorsRegulation',
            label: `Я ознакомлен и согласен с <a href="#">Уставом КДФ «Краски мира»</a>`,
          },
        ],
      },
      form: {
        type: null,
        requesterName: null,
        childName: null,
        childBirthDate: null,
        maintainerName: null,
        email: null,
        phone: null,
        files: [],
      },
    }
  },
  watch: {
    // 'form.type'() {
    //   for (const key in this.form) {
    //     if (key !== 'type') {
    //       this.form[key] = null
    //     }
    //   }
    // },
  },
  mounted() {
    this.form.type = this.sectionTypes[0]
  },
  methods: {
    onSubmit() {
      this.$emit('submitted', this.form.phone)
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
    font-size: 1.7rem;
    line-height: 1;
  }

  &__subtitle {
    font-size: 1.14rem;
    line-height: 1.18;
  }

  &__group {
    margin-bottom: 2px;
  }

  &__date {
    ::v-deep {
      .v-input__prepend-inner {
        padding-right: 18px;
      }

      .v-icon {
        color: $text-color;
      }
    }
  }

  &__phone {
    ::v-deep {
      .v-input__prepend-inner {
        margin-top: 19px;
      }
    }
  }

  &__file-hint {
    font-size: 0.8rem;
    line-height: 1.18;
  }

  &__code {
    max-width: 160px;

    &-input {
      border: 0.5px solid #99a2ad;
      border-radius: 3px;
    }
  }
}
</style>
