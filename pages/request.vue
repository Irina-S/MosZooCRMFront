<template>
  <div class="flex-grow-1 flex-sm-grow-0 d-flex flex-column">
    <RequestForm
      v-if="step === $options.steps.form"
      :form-data.sync="form"
      :checkboxes-data="checkboxes"
      :is-phone-change="changePhone"
      class="flex-grow-1 flex-sm-grow-0"
      @validated="onValidationSuccess"
    />
    <TelConfirm
      v-else-if="step === $options.steps.confirm"
      :phone="form.phone"
      :child-name="form.child_name"
      class="flex-grow-1 flex-sm-grow-0 mt-sm-9"
      @go-back="switchStep($options.steps.form)"
      @change-phone="onPhoneChange"
      @confirmed="onConfirm"
    />
    <TelConfirmed
      v-else-if="step === $options.steps.completed"
      class="mt-sm-n15"
      @close="switchStep($options.steps.form)"
    />
  </div>
</template>

<script>
import RequestForm from '@/components/Forms/RequestForm'
import TelConfirm from '@/components/Forms/TelConfirm'
import TelConfirmed from '@/components/TelConfirmed'
import prepareParams from '@/mixins/prepareParams'
import checkboxes from '@/mixins/checkboxes'

export default {
  name: 'RequestPage',
  auth: false,
  components: { RequestForm, TelConfirm, TelConfirmed },
  mixins: [prepareParams, checkboxes],
  layout: 'request',
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
        accompanynig_person: null,
        files: [],
        agreement_processing_personal_data: 0,
        have_read_personal_data_processing_policy: 0,
        have_read_regulations_on_kfd: 0,
        agree_with_internal_regulatoions: 0,
        agree_with_safety_regulations: 0,
        agree_with_entrance_tests_kfd: 0,
        have_read_charter_of_kfd: 0,
        agree_expedition_rules: 0,
      },
    }
  },
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
        const params = {
          ...this.form,
          phone: this.preparePhone(this.form.phone),
        }
        if (['kubz', 'kraski_mira'].includes(this.form.type)) {
          delete params.agree_with_entrance_tests_kfd
        }
        if (['pony_club'].includes(this.form.type)) {
          delete params.have_read_charter_of_kfd
        }
        if (['kraski_mira'].includes(this.form.type)) {
          delete params.agree_with_safety_regulations
          delete params.have_read_charter_of_kfd
        }
        if (!['kubz'].includes(this.form.type)) {
          delete params.agree_expedition_rules
        }
        await this.$api.applications.create(params)
        this.switchStep(this.$options.steps.completed)
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
  },
}
</script>
