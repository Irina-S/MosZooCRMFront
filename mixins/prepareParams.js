export default {
  methods: {
    prepareDate(date) {
      if (!date) return
      const [day, month, year] = date.split('.')
      return [year, month, day].join('-')
    },
    preparePhone(phone) {
      if (!phone) return
      return phone.replace(/\D+/g, '').slice(1)
    },
    prepareDateTime(date, time) {
      if (!(date && time)) {
        return null
      }
      const locaDateTime = `${date} ${time}:00`
      const mskDateTime = this.$dayjs(locaDateTime)
        .tz('Europe/Moscow')
        .format('YYYY-MM-DD HH:mm:ss')
      return mskDateTime
    },
  },
}
