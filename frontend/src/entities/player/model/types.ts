export interface IPlayerResponse {
  id: number
  name: string
  gameCount: number
  firstPlaceCount: number
  secondPlaceCount: number
  thirdPlaceCount: number
  fourthPlaceCount: number
  pointTotal: number
}

export interface IPlayer {
  id: number
  name: string
  gameCount: number
  rankTotal: number
  firstPlaceCount: number
  secondPlaceCount: number
  thirdPlaceCount: number
  fourthPlaceCount: number
  pointTotal: number
  rankAverage: number
  firstPlacePercentage: number
  secondPlacePercentage: number
  thirdPlacePercentage: number
  fourthPlacePercentage: number
  pointAverage: number
}
