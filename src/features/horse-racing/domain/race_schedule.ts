import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'

const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]
const HORSES_PER_RACE = 10

function selectRandomHorses(horses: Array<IHorse>): Array<string> {
  const remaining = [...horses]
  const selected: Array<string> = []

  while (selected.length < HORSES_PER_RACE) {
    const index = Math.floor(Math.random() * remaining.length)
    const [horse] = remaining.splice(index, 1)

    if (!horse) break

    selected.push(horse.id)
  }

  return selected
}

export function generateRaceSchedule(horses: Array<IHorse>): Array<IRaceRound> {
  return RACE_DISTANCES.map((distance, index) => ({
    id: index + 1,
    distance,
    horseIds: selectRandomHorses(horses),
    status: 'pending',
    results: [],
  }))
}
