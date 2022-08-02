import { generateSimpleMutations } from '@/utils/state'

export const state = () => {
  return { sections: [], statuses: [], moderators: [], groups: [] }
}

export const mutations = {
  ...generateSimpleMutations(Object.keys(state())),
  ADD_MODERATORS(state, payload) {
    state.moderators = [...state.moderators, ...payload]
  },
  ADD_GROUPS(state, payload) {
    state.groups = [...state.groups, ...payload]
  },
}
