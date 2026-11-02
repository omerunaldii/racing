import { describe, expect, it } from 'vitest'
import type { IHorse } from '@/features/horse-racing/types/horse'
import { generateRaceSchedule } from './race_schedule'

const mockHorses: Array<IHorse> = Array.from({ length: 20 }, (_, index) => ({
  id: `horse-${index + 1}`,
  name: `Horse ${index + 1}`,
  color: `hsl(${index * 18}, 70%, 50%)`,
  condition: index + 1,
}))

describe('Race Schedule', () => {
  it('should generate 6 race rounds', () => {
    const schedule = generateRaceSchedule(mockHorses)

    expect(schedule).toHaveLength(6)
  })

  it('should generate races with correct distances', () => {
    const schedule = generateRaceSchedule(mockHorses)

    expect(schedule.map((race) => race.distance)).toEqual([1200, 1400, 1600, 1800, 2000, 2200])
  })

  it('should assign 10 unique horses to each race', () => {
    const schedule = generateRaceSchedule(mockHorses)

    schedule.forEach((race) => {
      expect(race.horseIds).toHaveLength(10)
      expect(new Set(race.horseIds).size).toBe(10)
    })
  })

  it('should only select horses from the provider list', () => {
    const schedule = generateRaceSchedule(mockHorses)
    const availableHorseIds = new Set(mockHorses.map(({ id }) => id))

    schedule.forEach((race) => {
      race.horseIds.forEach((id) => {
        expect(availableHorseIds.has(id)).toBe(true)
      })
    })
  })

  it('should initialize every race with pending status', () => {
    const schedule = generateRaceSchedule(mockHorses)

    schedule.forEach((race, index) => {
      expect(race.id).toBe(index + 1)
      expect(race.status).toBe('pending')
    })
  })

  it('should not mutate the original horses array', () => {
    const initial = [...mockHorses]

    generateRaceSchedule(mockHorses)

    expect(mockHorses).toEqual(initial)
  })
})
