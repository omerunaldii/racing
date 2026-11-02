import { afterEach, describe, expect, it, vi } from 'vitest'

import type { IHorse } from '@/features/horse-racing/types/horse'
import { calculateHorseRaceTime } from './horse_performance'

function horseWithCondition(condition: number): IHorse {
  return { id: 'horse-1', name: 'Horse 1', color: '#000000', condition }
}

describe('calculateHorseRaceTime', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should use the base speed for an average horse without variance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    expect(calculateHorseRaceTime(horseWithCondition(50), 1200)).toBeCloseTo(80)
  })

  it('should make horses in better condition faster', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const fit = calculateHorseRaceTime(horseWithCondition(100), 1200)
    const tired = calculateHorseRaceTime(horseWithCondition(1), 1200)

    expect(fit).toBeCloseTo(64)
    expect(fit).toBeLessThan(tired)
  })

  it('should scale with distance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const horse = horseWithCondition(70)

    expect(calculateHorseRaceTime(horse, 2400)).toBeCloseTo(calculateHorseRaceTime(horse, 1200) * 2)
  })

  it('should keep random variance within 10%', () => {
    const horse = horseWithCondition(50)

    vi.spyOn(Math, 'random').mockReturnValue(0)
    const slowest = calculateHorseRaceTime(horse, 1200)

    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    const fastest = calculateHorseRaceTime(horse, 1200)

    expect(slowest).toBeCloseTo(80 / 0.9)
    expect(fastest).toBeGreaterThanOrEqual(80 / 1.1)
    expect(fastest).toBeLessThan(80)
  })
})
