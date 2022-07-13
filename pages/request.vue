<template>
  <div>
    <RequestForm
      v-if="step === $options.steps.form"
      @submitted="
        switchStep($options.steps.confirm)
        phone = $event
      "
    />
    <TelConfirm
      v-else-if="step === $options.steps.confirm"
      :phone="phone"
      class="mt-9"
      @go-back="switchStep($options.steps.form)"
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
      phone: null,
    }
  },
  methods: {
    switchStep(step) {
      this.step = step
    },
  },
}
</script>
