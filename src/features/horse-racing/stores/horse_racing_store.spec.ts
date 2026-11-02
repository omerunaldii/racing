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

  describe('racing', () => {
    function finishAll(store: ReturnType<typeof useHorseRacingStore>) {
      store.currentResults.forEach(({ horseId }) => store.horseFinished(horseId))
    }

    it('does not start without a program', () => {
      const store = useHorseRacingStore()

      store.start()

      expect(store.status).toBe('idle')
    })

    it('starts the first round with precomputed finish order', () => {
      const store = useHorseRacingStore()
      store.generate()

      store.start()

      expect(store.status).toBe('running')
      expect(store.rounds[0]?.status).toBe('running')
      expect(store.currentResults).toHaveLength(10)
      expect(store.currentResults.map(({ position }) => position)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ])
      expect(store.trackRound?.id).toBe(1)
    })

    it('toggles between running and paused', () => {
      const store = useHorseRacingStore()
      store.generate()

      store.toggle()
      store.toggle()
      expect(store.status).toBe('paused')

      store.toggle()
      expect(store.status).toBe('running')
    })

    it('ignores finishes while paused', () => {
      const store = useHorseRacingStore()
      store.generate()
      store.start()
      store.pause()

      finishAll(store)

      expect(store.rounds[0]?.status).toBe('running')
    })

    it('completes the round only when every horse has finished', () => {
      const store = useHorseRacingStore()
      store.generate()
      store.start()
      const [first, ...rest] = store.currentResults

      store.horseFinished(first!.horseId)
      store.horseFinished(first!.horseId)
      expect(store.rounds[0]?.status).toBe('running')

      rest.forEach(({ horseId }) => store.horseFinished(horseId))

      expect(store.rounds[0]?.status).toBe('completed')
      expect(store.rounds[0]?.results).toHaveLength(10)
      expect(store.rounds[1]?.status).toBe('running')
      expect(store.trackRound?.id).toBe(2)
    })

    it('completes the program after the last round and keeps it on the track', () => {
      const store = useHorseRacingStore()
      store.generate()
      store.start()

      store.rounds.forEach(() => finishAll(store))

      expect(store.status).toBe('completed')
      expect(store.canToggle).toBe(false)
      expect(store.rounds.every(({ status }) => status === 'completed')).toBe(true)
      expect(store.trackRound?.id).toBe(6)
    })

    it('resets the race when a new program is generated', () => {
      const store = useHorseRacingStore()
      store.generate()
      store.start()

      store.generate()

      expect(store.status).toBe('idle')
      expect(store.currentResults).toEqual([])
      expect(store.finishedHorseIds).toEqual([])
    })
  })
})
