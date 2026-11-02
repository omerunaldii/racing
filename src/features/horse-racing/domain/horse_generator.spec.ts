import { describe, expect, it } from 'vitest'
import { generateHorses } from './horse_generator'

describe('Horse Generator', () => {
  it('should generate 20 horses', () => {
    const horses = generateHorses()

    expect(horses).toHaveLength(20)
  })

  it('should generate horses with uniqye IDs', () => {
    const horses = generateHorses()
    const ids = horses.map(({ id }) => id)

    expect(new Set(ids).size).toBe(20)
  })

  it('should generate horses with unique names', () => {
    const horses = generateHorses()
    const names = horses.map(({ name }) => name)

    expect(new Set(names).size).toBe(20)
  })

  it('should generate horses with unique colors', () => {
    const horses = generateHorses()
    const colors = horses.map(({ color }) => color)

    expect(new Set(colors).size).toBe(20)
  })

  it('should generate horses with valid color format', () => {
    const horses = generateHorses()

    horses.forEach(({ color }) => {
      expect(color).toMatch(/^hsl\(\d+(\.\d+)?, 70%, 50%\)$/)
    })
  })

  it('should generate horses with condition between 1 and 100', () => {
    const horses = generateHorses()

    horses.forEach(({ condition }) => {
      expect(condition).toBeGreaterThanOrEqual(1)
      expect(condition).toBeLessThanOrEqual(100)
    })
  })
})
