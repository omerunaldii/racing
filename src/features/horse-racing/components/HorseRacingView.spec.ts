import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import HorseRacingView from './HorseRacingView.vue'

describe('HorseRacingView Component', () => {
  it('renders all main components', () => {
    setActivePinia(createPinia())

    const wrapper = mount(HorseRacingView)

    expect(wrapper.findComponent({ name: 'HorseRacingHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'HorseList' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RaceSchedule' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RaceTrack' }).exists()).toBe(true)
  })
})
