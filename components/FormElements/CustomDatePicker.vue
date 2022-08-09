<template>
  <div>
    <v-text-field
      v-model="dateFormatted"
      v-mask="'##.##.####'"
      :dense="!isRequest || $attrs.dense"
      :error-messages="$attrs['error-messages']"
      outlined
      :hide-details="$attrs['hide-details']"
      placeholder="дд.мм.гггг"
      prepend-inner-icon="mdi-calendar-month"
      class="date-picker"
      :class="isRequest ? 'custom-field' : ''"
      @input="onDateFormattedInput"
      @click:prepend-inner="toggleDatePicker"
    />
    <v-menu
      v-model="open"
      :close-on-content-click="false"
      transition="scale-transition"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <v-date-picker
        :value="date"
        locale="ru-Ru"
        :first-day-of-week="1"
        class="rounded-lg"
        @input="onDateInput"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'CustomDatePicker',
  props: {
    value: {
      type: String,
      default: '',
    },
    isRequest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: null,
      dateFormatted: null,
      open: false,
      menuX: null,
      menuY: null,
    }
  },
  watch: {
    value() {
      console.log('value', this.value)
      this.parseValue()
    },
  },
  mounted() {
    this.parseValue()
  },
  methods: {
    parseValue() {
      if (!this.value) {
        this.date = ''
        this.dateFormatted = ''
        return
      }
      this.date = this.value
      this.dateFormatted = this.$dayjs(this.value).format('DD.MM.YYYY')
    },
    toggleDatePicker() {
      const menuWidth = 290
      const menuHeight = 390
      const { x, y, height } = this.$el.getBoundingClientRect()
      if (window.innerWidth - x < menuWidth + 100) {
        this.menuX = (window.innerWidth - menuWidth) / 2
        this.menuY = (window.innerHeight - menuHeight) / 2
      } else {
        this.menuX = x
        this.menuY = y + height
      }
      this.open = !this.open
    },
    onDateInput(value) {
      this.$emit('input', value)
      this.open = !this.open
    },
    onDateFormattedInput(value) {
      console.log('date formated input')
      const fullDatePattern = /^\d{2}\.\d{2}\.\d{4}$/
      if (!value) {
        console.log('emit null')
        this.$emit('input', null)
      }
      if (fullDatePattern.test(value)) {
        console.log(value)
        const [day, month, year] = value.split('.')
        const tmpDate = [year, month, day].join('-')
        console.log(tmpDate)
        const datePrepared = this.$dayjs(tmpDate).format('YYYY-MM-DD')
        console.log('emit', datePrepared)
        const result = datePrepared !== 'Invalid Date' ? datePrepared : tmpDate
        console.log('emit', result)
        this.$emit('input', result)
      }
      console.log('no emit')
    },
  },
}
</script>

<style lang="scss" scoped>
.date-picker {
  ::v-deep {
    .v-input__prepend-inner {
      padding-right: 10px;
    }
  }

  &.custom-field {
    ::v-deep {
      .v-icon {
        color: $text-color !important;
      }
    }
  }

  &.v-input--dense {
    ::v-deep {
      .v-input__icon--prepend-inner {
        margin-top: 0 !important;
      }

      .v-input__prepend-inner {
        padding-right: 4px;
      }
    }

    &.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) {
      ::v-deep {
        .v-input__control > .v-input__slot,
        .v-text-field.v-text-field--enclosed .v-text-field__details {
          padding: 0 10px !important;
        }
      }
    }

    &.custom-field.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
      > .v-input__control
      > .v-input__slot {
      ::v-deep {
        .v-input__slot {
          padding: 0 10px !important;
        }
      }
    }
  }
}
</style>
