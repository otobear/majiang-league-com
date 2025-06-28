import type { ITournament } from '../model'
import { baseApi } from '@/shared/api'

type TournamentApiResponse = {
  id: number
  name: string
  sub_name: string
  date: string
  location: string
}

type TournamentDetailApiResponse = {
  id: number
  info: {
    id: number
    name: string
    sub_name: string
    date: string
    location: string
  }
  summary: {
    player_id: number
    player_name: string
    tournament_place: number
    total_point: {
      table_point: number
      game_point: number
    }
    round_point: {
      table_point: number
      game_point: number
    }[]
  }[]
  sessions: {
    info: {
      id: number
      name: string
    }
    games: {
      id: number
      forfeit_game_point: number
      player_results: {
        player_id: number
        player_name: string
        table_point: number
        game_point: number
      }[]
    }[]
  }[]
}

function transformTournamentList(apiTournaments: TournamentDetailApiResponse[]): ITournament[] {
  return apiTournaments.map((tournament) => transformTournamentDetail(tournament))
}

function transformTournamentDetail(apiTournament: TournamentDetailApiResponse): ITournament {
  return {
    id: apiTournament.id,
    info: {
      name: apiTournament.info.name,
      subName: apiTournament.info.sub_name,
      date: apiTournament.info.date,
      location: apiTournament.info.location,
    },
    summary: apiTournament.summary.map((summary) => ({
      playerId: summary.player_id,
      playerName: summary.player_name,
      tournamentPlace: summary.tournament_place,
      totalPoint: {
        tablePoint: summary.total_point.table_point,
        gamePoint: summary.total_point.game_point,
      },
      roundPoint: summary.round_point.map((round) => ({
        tablePoint: round.table_point,
        gamePoint: round.game_point,
      })),
    })),
    sessions: apiTournament.sessions.map((session) => ({
      info: {
        id: session.info.id,
        name: session.info.name,
      },
      games: session.games.map((game) => ({
        id: game.id,
        forfeitGamePoint: game.forfeit_game_point,
        playerResults: game.player_results.map((result) => ({
          playerId: result.player_id,
          playerName: result.player_name,
          tablePoint: result.table_point,
          gamePoint: result.game_point,
          placePoint: result.table_point * 2 - 5,
        })),
      })),
    })),
  }
}

export const fetchTournaments = async (): Promise<ITournament[]> => {
  const { data, error } = await baseApi.GET('/v1/tournaments')

  if (error) {
    throw new Error(`Failed to fetch tournaments: ${error}`)
  }

  return transformTournamentList(data || [])
}

export const fetchTournamentById = async (id: string): Promise<ITournament | undefined> => {
  const { data, error } = await baseApi.GET('/v1/tournaments/{tournament_id}', {
    params: {
      path: {
        tournament_id: parseInt(id, 10),
      },
    },
  })

  if (error) {
    console.error(`Failed to fetch tournament ${id}:`, error)
    return undefined
  }

  return data ? transformTournamentDetail(data) : undefined
}
