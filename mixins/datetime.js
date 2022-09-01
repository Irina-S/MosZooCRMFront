export default {
  methods: {
    parseDateFromExtended(datetime) {
      if (!datetime) {
        return null
      }
      return this.$dayjs(datetime).format('DD.MM.YYYY')
    },
    parseInvertedDateFromExtended(datetime) {
      if (!datetime) {
        return null
      }
      return this.$dayjs(datetime).format('YYYY-MM-DD')
    },
    parseTimeFromExtended(datetime, hasSeconds = true) {
      if (!datetime) {
        return null
      }
      if (hasSeconds) {
        return this.$dayjs(datetime).format('HH:mm:ss')
      }
      return this.$dayjs(datetime).format('HH:mm')
    },
    parseShortTimeFromExtended(datetime) {
      if (!datetime) {
        return null
      }
      return this.$dayjs(datetime).format('HH:mm')
    },
  },
}
