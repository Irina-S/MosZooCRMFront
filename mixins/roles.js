import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['role']),

    isAdmin() {
      return this.role === 'admin'
    },
  },
}
