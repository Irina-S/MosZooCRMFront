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
      if (!this.value) {
        this.date = ''
        this.dateFormatted = ''
        return
      }
      this.date = this.value
      this.dateFormatted = this.$dayjs(this.value).format('DD.MM.YYYY')
    },
  },
  methods: {
    toggleDatePicker() {
      const { x, y, height } = this.$el.getBoundingClientRect()
      this.menuX = x
      this.menuY = y + height
      this.open = !this.open
    },
    onDateInput(value) {
      this.$emit('input', value)
      this.open = !this.open
    },
    onDateFormattedInput(value) {
      const fullDatePattern = /^\d{2}\.\d{2}\.\d{4}$/
      if (!value) {
        this.$emit('input', null)
      }
      if (fullDatePattern.test(value)) {
        const [day, month, year] = value.split('.')
        const tmpDate = [month, day, year].join('.')
        const datePrepared = this.$dayjs(tmpDate).format('YYYY-MM-DD')
        this.$emit('input', datePrepared)
      }
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
        margin-top: 2px !important;
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
