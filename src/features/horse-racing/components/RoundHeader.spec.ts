import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { IRaceRound } from '@/features/horse-racing/types/race'
import RoundHeader from './RoundHeader.vue'

const round: IRaceRound = {
  id: 3,
  distance: 1600,
  horseIds: [],
  status: 'running',
  results: [],
}

describe('RoundHeader Component', () => {
  it('should render the round number, distance and status', () => {
    const wrapper = mount(RoundHeader, { props: { round } })

    expect(wrapper.get('h3').text()).toBe('Round 3')
    expect(wrapper.text()).toContain('1600m')
    expect(wrapper.text()).toContain('running')
  })
})
