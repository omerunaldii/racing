import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useHorseRacingStore } from './horse_racing_store'

describe('useHorseRacingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useHorseRacingStore()

    expect(store.horses).toEqual([])
    expect(store.rounds).toEqual([])
  })

  it('should generate horses and race schedule', () => {
    const store = useHorseRacingStore()

    store.generate()

    expect(store.horses).toHaveLength(20)
    expect(store.rounds).toHaveLength(6)
  })

  it('should generate valid race rounds', () => {
    const store = useHorseRacingStore()

    store.generate()

    store.rounds.forEach((round) => {
      expect(round.horseIds).toHaveLength(10)
      expect(new Set(round.horseIds).size).toBe(10)
      expect(round.status).toBe('pending')
    })
  })

  it('should regenerate horses and race schedule', () => {
    const store = useHorseRacingStore()

    store.generate()
    const previous = store.horses

    store.generate()

    expect(store.horses).not.toBe(previous)
    expect(store.horses).toHaveLength(20)
    expect(store.rounds).toHaveLength(6)
  })
})
