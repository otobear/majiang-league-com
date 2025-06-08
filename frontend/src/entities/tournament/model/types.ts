export interface IPlayerResponse {
  info: {
    name: string
    subName: string
    date: string
    location: string
  }
  summary: {
    playerId: string
    playerName: string
    tournamentRank: number
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
      id: string
      name: string
    }
    games: {
      id: string
      forfeitGamePoint: number
      playerResults: {
        playerId: string
        playerName: string
        tablePoint: number
        gamePoint: number
      }[]
    }[]
  }[]
}

export interface ITournament {
  id: string
  info: {
    name: string
    subName: string
    date: string
    location: string
  }
  summary: {
    playerId: string
    playerName: string
    tournamentRank: number
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
      id: string
      name: string
    }
    games: {
      id: string
      forfeitGamePoint: number
      playerResults: {
        playerId: string
        playerName: string
        tablePoint: number
        gamePoint: number
      }[]
    }[]
  }[]
}
