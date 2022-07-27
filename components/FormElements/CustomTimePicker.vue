<template>
  <div>
    <v-text-field
      v-model="time"
      v-mask="'##:##'"
      dense
      outlined
      hide-details
      placeholder="00:00"
      prepend-inner-icon="mdi-clock"
      class="time-picker"
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
      <v-time-picker
        v-model="time"
        locale="ru-Ru"
        class="rounded-lg"
        @input="onTimeInput"
      ></v-time-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'CustomTimePicker',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      time: null,
      open: false,
      menuX: null,
      menuY: null,
    }
  },
  watch: {
    time(value) {
      this.$emit('input', value)
    },
  },
  methods: {
    toggleDatePicker() {
      const { x, y, height } = this.$el.getBoundingClientRect()
      this.menuX = x
      this.menuY = y + height
      this.open = !this.open
    },
    onTimeInput(value) {
      this.open = false
    },
  },
}
</script>

<style lang="scss" scoped>
.time-picker {
  ::v-deep {
    .v-input__slot {
      padding: 0 10px !important;
    }
  }
}
</style>
