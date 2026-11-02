import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useHorseRacingStore } from '@/features/horse-racing/stores/horse_racing_store'
import HorseList from './HorseList.vue'

describe('HorseList Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should shows empty state when there are no horses', () => {
    const wrapper = mount(HorseList)

    expect(wrapper.text()).toContain('No horses generated yet.')
  })

  it('should generate horses', () => {
    const store = useHorseRacingStore()

    store.horses = [
      {
        id: 'horse-1',
        name: 'Horse 1',
        condition: 85,
        color: '#ffffff',
      },
      {
        id: 'horse-2',
        name: 'Horse 2',
        condition: 60,
        color: '#000000',
      },
    ]

    const wrapper = mount(HorseList)

    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Horse 2')
    expect(wrapper.text()).toContain('85')
    expect(wrapper.text()).toContain('60')
  })

  it('should applies horse colors to color indicators', () => {
    const store = useHorseRacingStore()

    store.horses = [
      {
        id: 'horse-1',
        name: 'Horse 1',
        condition: 85,
        color: '#ffffff',
      },
    ]

    const wrapper = mount(HorseList)
    const colorIndicator = wrapper.find('tbody tr:last-child td:last-child span')

    expect(colorIndicator.attributes('style')).toContain('background-color: rgb(255, 255, 255)')
  })
})
