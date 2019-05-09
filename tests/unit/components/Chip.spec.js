import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Chip from '@/components/team/Chip'

const localVue = createLocalVue()

localVue.use(Vuex)
Vue.use(Vuetify)

describe('Chip', () => {
  let store
  let getters

  beforeEach(() => {
    getters = {
      canWrite: jest.fn().mockReturnValue(true),
    }
    store = new Vuex.Store({
      state: {},
      modules: {
        entities: {
          namespaced: true,
        },
      },
      getters,
    })
  })

  it('renders with no exceptions', () => {
    shallowMount(Chip, { store,
      localVue,
      propsData: {
        entity: { id: 'p1', name: 'Bart' },
        chipClass: 'chip',
      },
    })
  })
})
