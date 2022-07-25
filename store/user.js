export const state = () => {
  return {}
}

export const getters = {
  user(state, getters, rootState, rootGetters) {
    return rootState.auth.user
  },
  role(state, getters) {
    return getters.user?.role
  },
  name(state, getters) {
    return getters.user?.name
  },
}
