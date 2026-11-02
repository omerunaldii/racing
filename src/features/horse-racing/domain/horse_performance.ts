import type { IHorse } from '@/features/horse-racing/types/horse'

const BASE_SPEED = 15
const CONDITION_FACTOR = 0.5
const RANDOM_VARIANCE = 0.1

export function calculateHorseRaceTime(horse: IHorse, distance: number): number {
  const multiplier = 1 + ((horse.condition - 50) * CONDITION_FACTOR) / 100
  const random = 1 + (Math.random() * 2 - 1) * RANDOM_VARIANCE
  const speed = BASE_SPEED * multiplier * random

  return distance / speed
}
