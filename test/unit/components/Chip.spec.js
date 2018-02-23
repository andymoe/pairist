import { shallow, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'
import ContextMenu from '@/components/ContextMenu'
import Chip from '@/components/team/Chip'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Chip', () => {
  let actions
  let store
  let getters

  beforeEach(() => {
    getters = {
      canWrite: jest.fn().mockReturnValue(true),
    }
    actions = {
      remove: jest.fn(),
    }
    store = new Vuex.Store({
      state: {},
      modules: {
        entities: {
          namespaced: true,
          actions,
        },
      },
      getters,
    })
  })

  it('renders with no exceptions', () => {
    shallow(Chip, { store,
      localVue,
      propsData: {
        chip: { '.key': 'p1', 'name': 'Bart' },
        chipClass: 'chip',
      },
    })
  })

  it('shows a chips name', () => {
    const wrapper = shallow(Chip, { store,
      localVue,
      propsData: {
        chip: { '.key': 'p1', 'name': 'Lisa' },
        chipClass: 'chip',
      },
    })

    expect(wrapper.find('span').text()).toContain('Lisa')
  })

  it('shows a context menu on right click if can write', async () => {
    const wrapper = shallow(Chip, { store,
      localVue,
      propsData: {
        chip: { '.key': 'p', 'name': 'Chip' },
        chipClass: 'chip',
      },
    })

    const menu = wrapper.find(ContextMenu)
    const open = wrapper.vm.$refs.menu.open = jest.fn()
    expect(menu.exists()).toBeTruthy()
    wrapper.find('.chip').trigger('contextmenu')
    await flushPromises()
    expect(open).toHaveBeenCalled()
  })

  it('emits a remove event when it is removed', () => {
    const wrapper = shallow(Chip, { store,
      localVue,
      propsData: {
        chip: { '.key': 'p', 'name': 'Chip' },
        chipClass: 'chip',
      },
    })

    wrapper.vm.remove()
    expect(actions.remove).toHaveBeenCalledWith(expect.anything(), 'p', undefined)
  })

  it('does not show menu if cannot write', async () => {
    getters.canWrite.mockReturnValue(false)

    const wrapper = shallow(Chip, { store,
      localVue,
      propsData: {
        chip: { '.key': 'p', 'name': 'Chip' },
        chipClass: 'chip',
      },
    })

    const menu = wrapper.find(ContextMenu)
    expect(menu.exists()).toBeFalsy()
    wrapper.find('.chip').trigger('contextmenu')
    await flushPromises()
  })
})
