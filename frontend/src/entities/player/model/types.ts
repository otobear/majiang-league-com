export interface IGameDetail {
  gameId: number
  tournamentId: number
  tournamentName: string
  tournamentSubName: string
  tournamentLocation: string
  tournamentDate: string
  sessionName: string
  players: IPlayerGameResult[]
}

export interface IPlayerGameResult {
  playerId: number
  playerName: string
  gamePoint: number
  placePoint: number
  tablePoint: number
}

export interface IPlayer {
  id: number
  name: string
  gameCount: number
  gpTotal: number
  tpTotal: number
  rpTotal: number
  firstPlaceCount: number
  secondPlaceCount: number
  thirdPlaceCount: number
  fourthPlaceCount: number
  gpAvg: number
  tpAvg: number
  rpAvg: number
  firstPlacePercentage: number
  secondPlacePercentage: number
  thirdPlacePercentage: number
  fourthPlacePercentage: number
}

export interface IPlayerWithGames extends IPlayer {
  gameDetails: IGameDetail[]
}
