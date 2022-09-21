// import dayjs from 'dayjs'
import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, length } from 'vee-validate/dist/rules'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

extend('required', { ...required, message: ' ' })
extend('length', { ...length, message: ' ' })

extend('is_truthy', {
  validate(value) {
    return !!value
  },
})
