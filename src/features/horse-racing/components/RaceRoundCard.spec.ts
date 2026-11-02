import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import RaceRoundCard from './RaceRoundCard.vue'

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

function rowsOf(wrapper: ReturnType<typeof mount>, testId: string) {
  return wrapper.findAll(`[data-testid="${testId}"] tbody tr`).map((row) => row.text())
}

describe('RaceRoundCard Component', () => {
  it('should list participants with their lane numbers', () => {
    const wrapper = mount(RaceRoundCard, { props: { round: round(), horsesById } })

    expect(rowsOf(wrapper, 'participants-table')).toEqual(['1Horse 1', '2Horse 2'])
  })

  it('should list results by position', () => {
    const completed = round({
      status: 'completed',
      results: [
        { horseId: 'horse-2', position: 1, finishTime: 80 },
        { horseId: 'horse-1', position: 2, finishTime: 85 },
      ],
    })
    const wrapper = mount(RaceRoundCard, { props: { round: completed, horsesById } })

    expect(rowsOf(wrapper, 'result-table')).toEqual(['1Horse 2', '2Horse 1'])
  })

  it('should show the race is in progress while running', () => {
    const wrapper = mount(RaceRoundCard, {
      props: { round: round({ status: 'running' }), horsesById },
    })

    expect(rowsOf(wrapper, 'result-table')).toEqual(['Race in progress...'])
  })

  it('should show waiting before the race starts', () => {
    const wrapper = mount(RaceRoundCard, { props: { round: round(), horsesById } })

    expect(rowsOf(wrapper, 'result-table')).toEqual(['Waiting for race'])
  })

  it('should fall back to the horse id and a neutral color for unknown horses', () => {
    const wrapper = mount(RaceRoundCard, {
      props: { round: round({ horseIds: ['horse-99'] }), horsesById },
    })
    const indicator = wrapper.get('[data-testid="participants-table"] tbody span')

    expect(rowsOf(wrapper, 'participants-table')).toEqual(['1horse-99'])
    expect(indicator.attributes('style')).toContain('background-color: rgb(156, 163, 175)')
  })
})
