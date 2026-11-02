import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import RaceTrack from './RaceTrack.vue'
import RaceLane from './RaceLane.vue'

const racers: Array<IHorse> = [
  { id: 'horse-1', name: 'Horse 1', condition: 85, color: '#ffffff' },
  { id: 'horse-2', name: 'Horse 2', condition: 60, color: '#000000' },
]

const round: IRaceRound = {
  id: 1,
  distance: 1200,
  horseIds: ['horse-1', 'horse-2'],
  status: 'running',
  results: [],
}

describe('RaceTrack Component', () => {
  it('shows empty state without a round', () => {
    const wrapper = mount(RaceTrack, {
      props: { round: null, racers: [], durations: {}, running: false },
    })

    expect(wrapper.text()).toContain('Generate a race program to see the track.')
  })

  it('renders one lane per racer with its duration', () => {
    const wrapper = mount(RaceTrack, {
      props: { round, racers, durations: { 'horse-1': 8000 }, running: true },
    })
    const lanes = wrapper.findAllComponents(RaceLane)

    expect(lanes).toHaveLength(2)
    expect(lanes[0]?.props('duration')).toBe(8000)
    expect(lanes[1]?.props('duration')).toBeNull()
  })

  it('forwards a lane finish with the horse id', async () => {
    const wrapper = mount(RaceTrack, {
      props: { round, racers, durations: {}, running: true },
    })

    wrapper.findAllComponents(RaceLane)[1]?.vm.$emit('finish')

    expect(wrapper.emitted('finish')).toEqual([['horse-2']])
  })
})
