import { defineStore } from 'pinia'
import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import { generateHorses } from '@/features/horse-racing/domain/horse_generator'
import { generateRaceSchedule } from '@/features/horse-racing/domain/race_schedule'

interface IHorceRacingState {
  horses: Array<IHorse>
  rounds: Array<IRaceRound>
}

export const useHorseRacingStore = defineStore('horseRacing', {
  state: (): IHorceRacingState => ({
    horses: [],
    rounds: [],
  }),
  actions: {
    generate() {
      const _horses = generateHorses()

      this.horses = _horses
      this.rounds = generateRaceSchedule(_horses)
    },
  },
})
