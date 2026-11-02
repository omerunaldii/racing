import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import RaceSchedule from './RaceSchedule.vue'

const horses: Array<IHorse> = [
  { id: 'horse-1', name: 'Horse 1', condition: 85, color: '#ffffff' },
  { id: 'horse-2', name: 'Horse 2', condition: 60, color: '#000000' },
]
const horsesById = new Map(horses.map((horse) => [horse.id, horse]))

function round(overrides: Partial<IRaceRound> = {}): IRaceRound {
  return {
    id: 1,
    distance: 1200,
    horseIds: ['horse-1', 'horse-2'],
    status: 'pending',
    results: [],
    ...overrides,
  }
}

describe('RaceSchedule Component', () => {
  it('shows empty state when no race program exists', () => {
    const wrapper = mount(RaceSchedule, { props: { rounds: [], horsesById } })

    expect(wrapper.text()).toContain('Generate a program to see the race schedule.')
  })

  it('renders race rounds and their participants', () => {
    const wrapper = mount(RaceSchedule, { props: { rounds: [round()], horsesById } })

    expect(wrapper.text()).toContain('Round 1')
    expect(wrapper.text()).toContain('1200m')
    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Horse 2')
    expect(wrapper.text()).toContain('Participants')
  })

  it('renders race results in finishing order', () => {
    const completed = round({
      status: 'completed',
      results: [
        { horseId: 'horse-1', position: 1, finishTime: 80 },
        { horseId: 'horse-2', position: 2, finishTime: 85 },
      ],
    })
    const wrapper = mount(RaceSchedule, { props: { rounds: [completed], horsesById } })
    const resultsTable = wrapper.get('[data-testid="result-table"]')

    expect(resultsTable.text().indexOf('Horse 1')).toBeLessThan(
      resultsTable.text().indexOf('Horse 2'),
    )
  })

  it('shows waiting message when race has no results', () => {
    const wrapper = mount(RaceSchedule, {
      props: { rounds: [round({ horseIds: [] })], horsesById },
    })

    expect(wrapper.text()).toContain('Waiting for race')
  })
})
