<template>
  <div>
    <RequestForm
      v-if="step === $options.steps.form"
      :form-data.sync="form"
      :checkboxes-data="checkboxes"
      :is-phone-change="changePhone"
      @validated="onValidationSuccess"
    />
    <TelConfirm
      v-else-if="step === $options.steps.confirm"
      :phone="form.phone"
      :child-name="form.child_name"
      class="mt-9"
      @go-back="switchStep($options.steps.form)"
      @change-phone="onPhoneChange"
      @confirmed="onConfirm"
    />
    <TelConfirmed
      v-else-if="step === $options.steps.completed"
      class="mt-n15"
      @close="switchStep($options.steps.form)"
    />
  </div>
</template>

<script>
import prepareParams from '@/mixins/prepareParams'
import RequestForm from '@/components/Forms/RequestForm'
import TelConfirm from '@/components/Forms/TelConfirm'
import TelConfirmed from '@/components/TelConfirmed'

export default {
  name: 'RequestPage',
  auth: false,
  components: { RequestForm, TelConfirm, TelConfirmed },
  mixins: [prepareParams],
  layout: 'request',
  head() {
    return {
      title: 'Подать заявку',
    }
  },
  data() {
    return {
      step: 'form',
      changePhone: false,
      form: {
        type: 'kubz',
        applicant_name: null,
        child_name: null,
        child_birthday: null,
        email: null,
        agreement_processing_personal_data: 0,
        have_read_personal_data_processing_policy: 0,
        agree_with_rules: 0,
        have_read_regulations_on_kfd: 0,
        agree_with_internal_regulatoions: 0,
        agree_with_safety_regulations: 0,
        agree_with_entrance_tests_kfd: 0,
        have_read_charter_of_kfd: 0,
      },
      checkboxes: {
        kubz: [
          {
            model: 'agree_with_rules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "КЮБЗ"</a>`,
          },
          {
            model: 'have_read_regulations_on_kfd',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «КЮБЗ»</a>`,
          },
          {
            model: 'agree_with_internal_regulatoions',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «КЮБЗ»</a>`,
          },
          // {
          //   model: 'agree_with_safety_regulations',
          //   label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «КЮБЗ» при экспедициях и в полевых условиях</a>`,
          // },
          {
            model: 'agree_with_safety_regulations',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «КЮБЗ»</a>`,
          },
          {
            model: 'agree_with_entrance_tests_kfd',
            label: `Я ознакомлен и согласен с <a href="#">Вступительными испытаниями КДФ «КЮБЗ»</a>`,
          },
          {
            model: 'have_read_charter_of_kfd',
            label: `Я ознакомлен с <a href="#">Уставом КДФ «КЮБЗ»</a>`,
          },
        ],
        pony_club: [
          {
            model: 'agree_with_rules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "Пони-клуб"</a>`,
          },
          {
            model: 'have_read_regulations_on_kfd',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «Пони клуб»</a>`,
          },
          {
            model: 'agree_with_internal_regulatoions',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «Пони клуб»</a>`,
          },
          {
            model: 'agree_with_safety_regulations',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Пони клуб» </a>`,
          },
          {
            model: 'agree_with_entrance_tests_kfd',
            label: `Я ознакомлен и согласен с <a href="#">Вступительными испытаниями КДФ «Пони клуб»</a>`,
          },
          {
            model: 'have_read_charter_of_kfd',
            label: `Я ознакомлен с <a href="#">Уставом КДФ «Пони клуб»</a>`,
          },
        ],
        kraski_mira: [
          {
            model: 'agree_with_rules',
            label: `Я ознакомлен и согласен с <a href="#">Правилами и положениями КДФ "Краски мира"</a>`,
          },
          {
            model: 'have_read_regulations_on_kfd',
            label: `Я ознакомлен с <a href="#">Положением о культурно-досуговом формировании КДФ «Краски мира»</a>`,
          },
          {
            model: 'agree_with_internal_regulatoions',
            label: `Я ознакомлен и согласен с <a href="#">Правилами внутреннего распорядка КДФ «Краски мира»</a>`,
          },
          // {
          //   model: 'agree_with_safety_regulations',
          //   label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Краски мира» при экспедиции в полевых условиях</a>`,
          // },
          {
            model: 'agree_with_safety_regulations',
            label: `Я ознакомлен и согласен с <a href="#">Правилами техники безопасности участника КДФ «Краски мира» </a>`,
          },
          {
            model: 'agree_with_entrance_tests_kfd',
            label: `Я ознакомлен и согласен с <a href="#">Вступительными испытаниями КДФ «Краски мира»</a>`,
          },
          {
            model: 'have_read_charter_of_kfd',
            label: `Я ознакомлен и согласен с <a href="#">Уставом КДФ «Краски мира»</a>`,
          },
        ],
      },
    }
  },
  steps: {
    form: 'form',
    confirm: 'confirm',
    completed: 'completed',
  },
  methods: {
    switchStep(step) {
      this.step = step
    },
    onValidationSuccess() {
      this.switchStep(this.$options.steps.confirm)
      this.changePhone = false
    },
    onPhoneChange() {
      this.changePhone = true
      this.switchStep(this.$options.steps.form)
    },
    async onConfirm() {
      try {
        await this.$api.applications.create({
          ...this.form,
          child_birthday: this.prepareDate(this.form.child_birthday),
          phone: this.preparePhone(this.form.phone),
        })
        this.switchStep(this.$options.steps.completed)
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
  },
}
</script>
