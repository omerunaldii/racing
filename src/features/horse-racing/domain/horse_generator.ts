import { faker } from '@faker-js/faker'
import type { IHorse } from '@/features/horse-racing/types/horse'

const HORSE_COUNT = 20

function randomColor(index: number): string {
  return `hsl(${(index * 360) / HORSE_COUNT}, 70%, 50%)`
}

function randomHorseName(): string {
  return `${faker.word.adjective()} ${faker.person.firstName()}`
}

export function generateHorses(): Array<IHorse> {
  const names = new Set<string>()

  while (names.size < HORSE_COUNT) {
    names.add(randomHorseName())
  }

  return Array.from(names, (name, index) => ({
    id: `horse-${index + 1}`,
    name,
    color: randomColor(index),
    condition: faker.number.int({ min: 1, max: 100 }),
  }))
}
