<template>
  <div>
    <v-text-field
      v-model="dateFormatted"
      v-mask="'##.##.####'"
      dense
      outlined
      hide-details
      placeholder="00.00.0000"
      prepend-inner-icon="mdi-calendar-month"
      class="date-picker"
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
        v-model="date"
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
    dateFormatted(value) {
      if (!value) {
        this.date = null
        return
      }
      const [day, month, year] = value.split('.')
      const tmpDate = [month, day, year].join('.')
      const datePrepared = this.$dayjs(tmpDate).format('YYYY-MM-DD')
      if (datePrepared !== 'Invalid Date') {
        this.date = datePrepared
      }
      const datetime = `${this.dateFormatted ?? ''} ${this.time ?? ''}`
      this.$emit('input', datetime)
    },
    date() {
      try {
        const datetime = `${this.dateFormatted ?? ''} ${this.time ?? ''}`

        this.$emit('input', datetime)
      } catch (error) {
        this.$emit('input', '')
      }
    },
  },
  methods: {
    toggleDatePicker() {
      const { x, y } = this.$el.getBoundingClientRect()
      this.menuX = x
      this.menuY = y + 340
      this.open = !this.open
    },
    onDateInput(value) {
      this.dateFormatted = this.$dayjs(value).format('DD.MM.YYYY')
    },
  },
}
</script>

<style lang="scss" scoped>
.date-picker {
  ::v-deep {
    .v-input__slot {
      padding: 0 10px !important;
    }
  }
}
</style>
