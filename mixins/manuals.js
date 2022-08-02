import { keyBy } from 'lodash-es'
import { mapState } from 'vuex'

export default {
  computed: {
    statusesById() {
      return keyBy(this.statuses, (status) => status.id.toUpperCase())
    },
    ...mapState('manuals', ['sections', 'statuses', 'moderators', 'groups']),
  },
  methods: {
    async getSections() {
      if (this.sections.length) {
        return
      }
      try {
        const { data } = await this.$api.manuals.getApplicationsTypes()
        this.$store.commit('manuals/SET_SECTIONS', data.models)
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getStatuses() {
      if (this.statuses.length) {
        return
      }
      try {
        const { data } = await this.$api.manuals.getStatuses()
        this.$store.commit('manuals/SET_STATUSES', data.models)
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getModerators(page = 1) {
      if (this.moderators.length && page === 1) {
        return
      }
      try {
        const { data } = await this.$api.manuals.getModerators({
          page,
        })
        if (data.meta.current_page === 1) {
          this.$store.commit('manuals/SET_MODERATORS', [])
        }
        this.$store.commit('manuals/ADD_MODERATORS', data.models)
        if (data.meta.total > this.moderators.length) {
          setTimeout(() => {
            this.getModerators(data.meta.current_page + 1)
          }, 0)
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getGroups(page = 1) {
      if (this.groups.length && page === 1) {
        return
      }
      try {
        const { data } = await this.$api.groups.getList({
          page,
        })
        if (data.meta.current_page === 1) {
          this.$store.commit('manuals/SET_GROUPS', [])
        }
        this.$store.commit('manuals/ADD_GROUPS', data.models)
        if (data.meta.total > this.groups.length) {
          setTimeout(() => {
            this.getGroups(data.meta.current_page + 1)
          }, 0)
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
  },
}
