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
    parseTimeFromExtended(datetime) {
      if (!datetime) {
        return null
      }
      return this.$dayjs(datetime).format('HH:mm:ss')
    },
    parseShortTimeFromExtended(datetime) {
      if (!datetime) {
        return null
      }
      return this.$dayjs(datetime).format('HH:mm')
    },
  },
}
