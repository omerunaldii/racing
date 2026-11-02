export type RaceStatus = 'pending' | 'running' | 'completed'

export interface IRaceRound {
  id: number
  distance: number
  horseIds: Array<string>
  status: RaceStatus
  results: Array<IRaceResult>
}

export interface IRaceResult {
  horseId: string
  position: number
  finishTime: number
}
