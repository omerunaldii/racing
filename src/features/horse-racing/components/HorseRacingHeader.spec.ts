import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import HorseRacingHeader from './HorseRacingHeader.vue'

describe('HorseRacingHeader Component', () => {
  it('emits generate when Generate Program is clicked', async () => {
    const wrapper = mount(HorseRacingHeader, { props: { canToggle: true } })

    await wrapper.get('[data-testid="generate-program-button"]').trigger('click')

    expect(wrapper.emitted('generate')).toHaveLength(1)
  })

  it('emits toggle when Start is clicked', async () => {
    const wrapper = mount(HorseRacingHeader, { props: { canToggle: true } })

    await wrapper.get('[data-testid="start-button"]').trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('disables Start when it cannot be toggled', () => {
    const wrapper = mount(HorseRacingHeader, { props: { canToggle: false } })

    expect(wrapper.get('[data-testid="start-button"]').attributes('disabled')).toBeDefined()
  })
})
