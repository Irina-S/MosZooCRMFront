<template>
  <div>
    <RequestForm
      v-if="step === $options.steps.form"
      :formData.sync="form"
      :checkboxesData="checkboxes"
      :is-phone-change="changePhone"
      @submitted="onSubmit"
    />
    <TelConfirm
      v-else-if="step === $options.steps.confirm"
      :phone="form.phone"
      class="mt-9"
      @go-back="switchStep($options.steps.form)"
      @change-phone="onPhoneChange"
      @confirmed="switchStep($options.steps.completed)"
    />
    <TelConfirmed
      v-else-if="step === $options.steps.completed"
      class="mt-n15"
    />
  </div>
</template>

<script>
import RequestForm from '@/components/Forms/RequestForm'
import TelConfirm from '@/components/Forms/TelConfirm'
import TelConfirmed from '@/components/TelConfirmed'

export default {
  name: 'RequestPage',
  layout: 'request',
  components: { RequestForm, TelConfirm, TelConfirmed },
  head() {
    return {
      title: 'Подать заявку',
    }
  },
  steps: {
    form: 'form',
    confirm: 'confirm',
    completed: 'completed',
  },
  data() {
    return {
      step: 'form',
      changePhone: false,
      form: {
        type: null,
        requesterName: null,
        childName: null,
        childBirthDate: null,
        maintainerName: null,
        email: null,
        phone: null,
        files: [],
        code: null,
      },
      checkboxes: {
        kubz: [
          {
            name: 'agreeProcessing',
            label: `Я даю <a href="#">Согласие на обработку и распространение персональных данных</a>`,
            value: false,
          },
          {
            name: 'agreePolicy',
            label: `Я ознакомлен с <a href="#"> Политикой обработки персональных данных</a>`,
            value: false,
          },
          {
            name: 'agreeKubzRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "КЮБЗ"</a>`,
            value: false,
          },
          {
            name: 'agreeCulture',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «КЮБЗ»</a>`,
            value: false,
          },
          {
            name: 'agreeInnerRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «КЮБЗ»</a>`,
            value: false,
          },
          {
            name: 'agreeSafetyRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «КЮБЗ» при экспедициях и в полевых условиях</a>`,
            value: false,
          },
          {
            name: 'agreeInnerRules2',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «КЮБЗ»</a>`,
            value: false,
          },
          {
            name: 'agreeRegulation',
            label: `Я ознакомлен с <a href="#">Уставом КДФ «КЮБЗ»</a>`,
            value: false,
          },
        ],
        poni: [
          {
            name: 'agreeProcessing',
            label: `Я даю <a href="#">Согласие на обработку и распространение персональных данных</a>`,
            value: false,
          },
          {
            name: 'agreePolicy',
            label: `Я ознакомлен с <a href="#"> Политикой обработки персональных данных</a>`,
            value: false,
          },
          {
            name: 'agreePoniRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "Пони-клуб"</a>`,
            value: false,
          },
          {
            name: 'agreePoniCulture',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «Пони клуб»</a>`,
            value: false,
          },
          {
            name: 'agreePoniInnerRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «Пони клуб»</a>`,
            value: false,
          },
          {
            name: 'agreePoniSafetyRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Пони клуб» </a>`,
            value: false,
          },
          {
            name: 'agreeTest',
            label: `Я ознакомлен и согласен с <a href="#">Вступительными испытаниями КДФ «Пони клуб»</a>`,
            value: false,
          },
        ],
        colors: [
          {
            name: 'agreeProcessing',
            label: `Я даю <a href="#">Согласие на обработку и распространение персональных данных</a>`,
            value: false,
          },
          {
            name: 'agreePolicy',
            label: `Я ознакомлен с <a href="#"> Политикой обработки персональных данных</a>`,
            value: false,
          },
          {
            name: 'agreeColorsRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "Краски мира"</a>`,
            value: false,
          },
          {
            name: 'agreeColorsCulture',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «Краски мира»</a>`,
            value: false,
          },
          {
            name: 'agreeColorsInnerRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «Краски мира»</a>`,
            value: false,
          },
          {
            name: 'agreeColorsSafetyRules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Краски мира» при экспедиции в полевых условиях</a>`,
            value: false,
          },
          {
            name: 'agreeColorsSafetyRules2',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Краски мира» </a>`,
            value: false,
          },
          {
            name: 'agreeColorsRegulation',
            label: `Я ознакомлен и согласен с <a href="#">Уставом КДФ «Краски мира»</a>`,
            value: false,
          },
        ],
      },
    }
  },
  methods: {
    switchStep(step) {
      this.step = step
    },
    onSubmit() {
      this.switchStep(this.$options.steps.confirm)
      this.changePhone = false
    },
    onPhoneChange() {
      this.changePhone = true
      this.switchStep(this.$options.steps.form)
    },
  },
}
</script>
