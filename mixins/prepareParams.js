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
      return `${date} ${time}:00`
    },
  },
}
