import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import HorseLabel from './HorseLabel.vue'

describe('HorseLabel Component', () => {
  it('should render the horse name', () => {
    const wrapper = mount(HorseLabel, { props: { name: 'Horse 1', color: '#ffffff' } })

    expect(wrapper.text()).toBe('Horse 1')
  })

  it('should apply the horse color to the color indicator', () => {
    const wrapper = mount(HorseLabel, { props: { name: 'Horse 1', color: '#ffffff' } })

    expect(wrapper.get('span').attributes('style')).toContain(
      'background-color: rgb(255, 255, 255)',
    )
  })
})
