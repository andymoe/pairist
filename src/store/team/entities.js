import { firebaseMutations, firebaseAction } from 'vuexfire'
import _ from 'lodash/fp'
import moment from 'moment'

import constants from '@/lib/constants'

export default {
  namespaced: true,

  state: {
    entities: [],
  },

  mutations: {
    setRef (state, ref) { state.ref = ref },
    ...firebaseMutations,
  },

  getters: {
    byKey (state) {
      return key =>
        _.find(e => e['.key'] === key)(state.entities)
    },
    all (state) {
      return state.entities
    },
    byType (state) {
      return type =>
        _.filter(e => e.type === type)(state.entities)
    },
    unassigned (_, getters) {
      return type =>
        getters.inLocation(constants.LOCATION.UNASSIGNED)(type)
    },
    out (_, getters) {
      return type =>
        getters.inLocation(constants.LOCATION.OUT)(type)
    },
    pm (_, getters) {
      return type =>
        getters.inLocation(constants.LOCATION.PM)(type)
    },
    inLocation (state, getters) {
      return location =>
        type =>
          _.filter(entity => entity.location === location)(getters.byType(type))
    },
  },

  actions: {
    setRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
      bindFirebaseRef('entities', ref)
      commit('setRef', ref.ref)
    }),

    save ({ state }, entity) {
      if (entity.name === '') { return }

      if (entity['.key']) {
        const key = entity['.key']
        delete entity['.key']

        state.ref.child(key).update(entity)
      } else {
        const entityToCreate = {
          ...entity,
          location: constants.LOCATION.UNASSIGNED,
          updatedAt: moment().valueOf(),
        }

        state.ref.push(entityToCreate)
      }
    },

    remove ({ dispatch, state }, key) {
      state.ref.child(key).remove()
      dispatch('lanes/clearEmpty', null, { root: true })
    },

    resetLocation ({ getters, dispatch, state }, key) {
      getters.all.filter(e => e.location === key).forEach(e => {
        dispatch('move', { key: e['.key'], location: constants.LOCATION.UNASSIGNED })
      })
      dispatch('lanes/clearEmpty', null, { root: true })
    },

    move ({ getters, state }, { key, location }) {
      const entity = getters.byKey(key)
      if (!entity) { return }

      if (entity.type !== 'person' && location === constants.LOCATION.OUT) {
        location = constants.LOCATION.UNASSIGNED
      }

      const payload = {
        location,
        updatedAt: moment().valueOf(),
      }

      state.ref.child(key).update(payload)
    },
  },
}
