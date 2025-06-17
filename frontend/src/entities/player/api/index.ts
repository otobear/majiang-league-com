import type { IPlayer } from '../model'
import { baseApi } from '@/shared/api'
import type { paths } from '@/shared/api'

export const fetchPlayers = async (): Promise<IPlayer[]> => {
  type ApiPlayer = NonNullable<
    paths['/api/v1/player_stats']['get']['responses']['200']['content']['application/json']
  >[number]

  function toIPlayer(item: ApiPlayer): IPlayer {
    return {
      id: String(item.player_id),
      name: item.player_name,
      gameCount: item.game_count ?? 0,
      gpTotal: item.total_gp ?? 0,
      tpTotal: item.total_tp ?? 0,
      rpTotal: item.total_rp ?? 0,
      firstPlaceCount: item.first_place_count ?? 0,
      secondPlaceCount: item.second_place_count ?? 0,
      thirdPlaceCount: item.third_place_count ?? 0,
      fourthPlaceCount: item.fourth_place_count ?? 0,
      gpAvg: item.avg_gp ?? 0,
      tpAvg: item.avg_tp ?? 0,
      rpAvg: item.avg_rp ?? 0,
      firstPlacePercentage: item.first_place_ratio ?? 0,
      secondPlacePercentage: item.second_place_ratio ?? 0,
      thirdPlacePercentage: item.third_place_ratio ?? 0,
      fourthPlacePercentage: item.fourth_place_ratio ?? 0,
    }
  }

  const res = await baseApi.GET('/api/v1/player_stats')

  return (res.data ?? []).map(toIPlayer)
}

const mockPlayerData = [
  {
    id: '1',
    name: 'Player 1',
    gameCount: 6,
    rpTotal: 6,
    firstPlaceCount: 2,
    secondPlaceCount: 3,
    thirdPlaceCount: 0,
    fourthPlaceCount: 1,
    gpTotal: 1187,
    tpAvg: 2,
    firstPlacePercentage: 33.33,
    secondPlacePercentage: 50,
    thirdPlacePercentage: 0,
    fourthPlacePercentage: 16.67,
    gpAvg: 197.83,
  },
  {
    id: '2',
    name: 'Player 2',
    gameCount: 6,
    rpTotal: 4,
    firstPlaceCount: 3,
    secondPlaceCount: 1,
    thirdPlaceCount: 0,
    fourthPlaceCount: 2,
    gpTotal: 1038,
    tpAvg: 2.17,
    firstPlacePercentage: 50,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 0,
    fourthPlacePercentage: 33.33,
    gpAvg: 173,
  },
  {
    id: '3',
    name: 'Player 3',
    gameCount: 6,
    rpTotal: 2,
    firstPlaceCount: 2,
    secondPlaceCount: 1,
    thirdPlaceCount: 2,
    fourthPlaceCount: 1,
    gpTotal: 473,
    tpAvg: 2.33,
    firstPlacePercentage: 33.33,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 33.33,
    fourthPlacePercentage: 16.67,
    gpAvg: 78.83,
  },
  {
    id: '4',
    name: 'Player 4',
    gameCount: 6,
    rpTotal: -2,
    firstPlaceCount: 1,
    secondPlaceCount: 1,
    thirdPlaceCount: 3,
    fourthPlaceCount: 1,
    gpTotal: -481,
    tpAvg: 2.5,
    firstPlacePercentage: 16.67,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 50,
    fourthPlacePercentage: 16.67,
    gpAvg: -80.17,
  },
  {
    id: '5',
    name: 'Player 5',
    gameCount: 6,
    rpTotal: -4,
    firstPlaceCount: 1,
    secondPlaceCount: 1,
    thirdPlaceCount: 2,
    fourthPlaceCount: 2,
    gpTotal: -912,
    tpAvg: 2.67,
    firstPlacePercentage: 16.67,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 33.33,
    fourthPlacePercentage: 33.33,
    gpAvg: -152,
  },
  {
    id: '6',
    name: 'Player 6',
    gameCount: 6,
    rpTotal: -6,
    firstPlaceCount: 0,
    secondPlaceCount: 2,
    thirdPlaceCount: 2,
    fourthPlaceCount: 2,
    gpTotal: -1305,
    tpAvg: 3,
    firstPlacePercentage: 0,
    secondPlacePercentage: 33.33,
    thirdPlacePercentage: 33.33,
    fourthPlacePercentage: 33.33,
    gpAvg: -217.5,
  },
] as IPlayer[]

export const fetchPlayerById = async (id: string): Promise<IPlayer | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const player = mockPlayerData.find((p) => p.id === id)
      resolve(player)
    }, 1000)
  })
}
