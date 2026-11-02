import { defineStore } from 'pinia'
import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceResult, IRaceRound } from '@/features/horse-racing/types/race'
import { generateHorses } from '@/features/horse-racing/domain/horse_generator'
import { generateRaceSchedule } from '@/features/horse-racing/domain/race_schedule'
import { calculateHorseRaceTime } from '@/features/horse-racing/domain/horse_performance'

type RaceStatus = 'idle' | 'running' | 'paused' | 'completed'

interface IHorseRacingState {
  horses: Array<IHorse>
  rounds: Array<IRaceRound>
  status: RaceStatus
  currentResults: Array<IRaceResult>
  finishedHorseIds: Array<string>
}

export const useHorseRacingStore = defineStore('horseRacing', {
  state: (): IHorseRacingState => ({
    horses: [],
    rounds: [],
    status: 'idle',
    currentResults: [],
    finishedHorseIds: [],
  }),
  getters: {
    horsesById: (state) => new Map(state.horses.map((horse) => [horse.id, horse])),
    canToggle: (state) => state.rounds.length > 0 && state.status !== 'completed',
    trackRound: (state): IRaceRound | null =>
      state.rounds.find((round) => round.status === 'running') ??
      state.rounds.find((round) => round.status === 'pending') ??
      state.rounds.at(-1) ??
      null,
    trackRacers(): Array<IHorse> {
      return (
        this.trackRound?.horseIds
          .map((id) => this.horsesById.get(id))
          .filter((horse) => horse !== undefined) ?? []
      )
    },
  },
  actions: {
    generate() {
      const _horses = generateHorses()

      this.horses = _horses
      this.rounds = generateRaceSchedule(_horses)
      this.status = 'idle'
      this.currentResults = []
      this.finishedHorseIds = []
    },
    start() {
      if (this.status === 'running' || !this.canToggle) return
      if (this.status === 'idle' && !this.startNextRound()) return

      this.status = 'running'
    },
    pause() {
      if (this.status === 'running') this.status = 'paused'
    },
    toggle() {
      if (this.status === 'running') this.pause()
      else this.start()
    },
    horseFinished(horseId: string) {
      if (this.status !== 'running' || this.finishedHorseIds.includes(horseId)) return

      this.finishedHorseIds.push(horseId)

      if (this.finishedHorseIds.length === this.currentResults.length) this.completeRound()
    },
    completeRound() {
      const round = this.rounds.find(({ status }) => status === 'running')

      if (!round) return

      round.results = this.currentResults
      round.status = 'completed'

      this.startNextRound()
    },
    startNextRound(): boolean {
      const round = this.rounds.find(({ status }) => status === 'pending')

      if (!round) {
        this.status = 'completed'
        return false
      }

      this.currentResults = round.horseIds
        .map((id) => this.horsesById.get(id))
        .filter((horse) => horse !== undefined)
        .map((horse) => ({
          horseId: horse.id,
          finishTime: calculateHorseRaceTime(horse, round.distance),
          position: 0,
        }))
        .sort((a, b) => a.finishTime - b.finishTime)
        .map((result, index) => ({ ...result, position: index + 1 }))

      this.finishedHorseIds = []
      round.status = 'running'

      return true
    },
  },
})
