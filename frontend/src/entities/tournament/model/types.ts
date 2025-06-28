export interface IPlayerResponse {
  info: {
    name: string
    subName: string
    date: string
    location: string
  }
  summary: {
    playerId: number
    playerName: string
    tournamentPlace: number
    totalPoint: {
      tablePoint: number
      gamePoint: number
    }
    roundPoint: {
      tablePoint: number
      gamePoint: number
    }[]
  }[]
  sessions: {
    info: {
      id: number
      name: string
    }
    games: {
      id: number
      forfeitGamePoint: number
      playerResults: {
        playerId: number
        playerName: string
        tablePoint: number
        gamePoint: number
        placePoint: number
      }[]
    }[]
  }[]
}

export interface ITournament {
  id: number
  info: {
    name: string
    subName: string
    date: string
    location: string
  }
  summary: {
    playerId: number
    playerName: string
    tournamentPlace: number
    totalPoint: {
      tablePoint: number
      gamePoint: number
    }
    roundPoint: {
      tablePoint: number
      gamePoint: number
    }[]
  }[]
  sessions: {
    info: {
      id: number
      name: string
    }
    games: {
      id: number
      forfeitGamePoint: number
      playerResults: {
        playerId: number
        playerName: string
        tablePoint: number
        gamePoint: number
        placePoint: number
      }[]
    }[]
  }[]
}
