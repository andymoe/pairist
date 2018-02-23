import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Lane from '@/components/team/Lane'
import LaneList from '@/components/team/LaneList'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('LaneList', () => {
  let getters
  let store

  beforeEach(() => {
    getters = {
      all: jest.fn(),
    }
    store = new Vuex.Store({
      state: {},
      modules: {
        lanes: {
          namespaced: true,
          getters,
        },
      },
    })
  })

  it('renders with no exceptions', () => {
    shallow(LaneList, { store, localVue })
  })

  it('renders new-lane as last lane with no divider', () => {
    const wrapper = shallow(LaneList, { store, localVue })

    const lane = wrapper.find(Lane)
    expect(lane.exists()).toBe(true)
    expect(lane.vm.divider).toBe(false)
    expect(lane.vm.lane).toEqual({ '.key': 'new-lane' })
  })
})
