import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['role']),

    isAdmin() {
      return this.role === 'admin'
    },

    isModerator() {
      return this.role === 'moderator'
    },
  },
}
