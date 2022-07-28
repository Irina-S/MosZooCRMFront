import { keyBy } from 'lodash-es'

export default {
  data() {
    return {
      sections: [],
      statuses: [],
      moderators: {
        items: [],
        page: 1,
      },
      groups: {
        items: [],
        page: 1,
      },
    }
  },
  computed: {
    statusesById() {
      return keyBy(this.statuses, (status) => status.id.toUpperCase())
    },
  },
  methods: {
    async getSections() {
      try {
        const { data } = await this.$api.manuals.getApplicationsTypes()
        this.sections = data.models
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getStatuses() {
      try {
        const { data } = await this.$api.manuals.getStatuses()
        this.statuses = data.models
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getModerators() {
      try {
        const { data } = await this.$api.manuals.getModerators({
          page: this.moderators.page,
        })
        if (this.moderators.page === 1) {
          this.moderators.items = []
        }
        this.moderators.items.push(...data.models)
        if (data.meta.total > this.moderators.items.length) {
          this.moderators.page++
          setTimeout(this.getModerators, 0)
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getGroups() {
      try {
        const { data } = await this.$api.groups.getList({
          page: this.groups.page,
        })
        if (this.groups.page === 1) {
          this.groups.items = []
        }
        this.groups.items.push(...data.models)
        if (data.meta.total > this.groups.items.length) {
          this.groups.page++
          setTimeout(this.getGroups, 0)
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
  },
}
