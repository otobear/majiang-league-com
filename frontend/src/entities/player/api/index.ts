import type { IPlayer } from '../model'
import { baseApi } from '@/shared/api'
import type { paths } from '@/shared/api'

type ApiPlayer = NonNullable<
  paths['/v1/player_stats']['get']['responses']['200']['content']['application/json']
>[number]

function toIPlayer(item: ApiPlayer): IPlayer {
  return {
    id: item.player_id,
    name: item.player_name,
    gameCount: item.game_count ?? 0,
    gpTotal: item.total_gp ?? 0,
    tpTotal: item.total_tp ?? 0,
    rpTotal: item.total_pp ?? 0,
    firstPlaceCount: item.first_place_count ?? 0,
    secondPlaceCount: item.second_place_count ?? 0,
    thirdPlaceCount: item.third_place_count ?? 0,
    fourthPlaceCount: item.fourth_place_count ?? 0,
    gpAvg: item.avg_gp ?? 0,
    tpAvg: item.avg_tp ?? 0,
    rpAvg: item.avg_pp ?? 0,
    firstPlacePercentage: item.first_place_ratio ?? 0,
    secondPlacePercentage: item.second_place_ratio ?? 0,
    thirdPlacePercentage: item.third_place_ratio ?? 0,
    fourthPlacePercentage: item.fourth_place_ratio ?? 0,
  }
}

export const fetchPlayerStatsList = async (): Promise<IPlayer[]> => {
  const res = await baseApi.GET('/v1/player_stats')

  return (res.data ?? []).map(toIPlayer)
}

export const fetchPlayerStatsById = async (playerId: number): Promise<IPlayer | null> => {
  const res = await baseApi.GET('/v1/player_stats/{player_id}', {
    params: {
      path: { player_id: playerId },
    },
  })

  return res.data ? toIPlayer(res.data) : null
}
