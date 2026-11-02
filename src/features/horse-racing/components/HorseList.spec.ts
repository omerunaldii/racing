import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { IHorse } from '@/features/horse-racing/types/horse'
import HorseList from './HorseList.vue'

const horses: Array<IHorse> = [
  { id: 'horse-1', name: 'Horse 1', condition: 85, color: '#ffffff' },
  { id: 'horse-2', name: 'Horse 2', condition: 60, color: '#000000' },
]

describe('HorseList Component', () => {
  it('should shows empty state when there are no horses', () => {
    const wrapper = mount(HorseList, { props: { horses: [] } })

    expect(wrapper.text()).toContain('No horses generated yet.')
  })

  it('should render the given horses', () => {
    const wrapper = mount(HorseList, { props: { horses } })

    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Horse 2')
    expect(wrapper.text()).toContain('85')
    expect(wrapper.text()).toContain('60')
  })

  it('should applies horse colors to color indicators', () => {
    const wrapper = mount(HorseList, { props: { horses: horses.slice(0, 1) } })
    const colorIndicator = wrapper.find('tbody tr:last-child td:last-child span')

    expect(colorIndicator.attributes('style')).toContain('background-color: rgb(255, 255, 255)')
  })
})
