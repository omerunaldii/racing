export type RaceStatus = 'pending' | 'running' | 'completed'

export interface IRaceRound {
  id: number
  distance: number
  horseIds: Array<string>
  status: RaceStatus
}

export interface IRaceResult {
  horseId: string
  position: number
  finishTime: number
}

export interface ICompletedRace {
  roundId: number
  results: Array<IRaceResult>
}
