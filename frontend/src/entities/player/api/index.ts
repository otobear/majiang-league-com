import type { IPlayer } from '../model'

const mockPlayerData = [
  {
    id: 1,
    name: 'Player 1',
    gameCount: 6,
    rankTotal: 6,
    firstPlaceCount: 2,
    secondPlaceCount: 3,
    thirdPlaceCount: 0,
    fourthPlaceCount: 1,
    pointTotal: 1187,
    rankAverage: 2,
    firstPlacePercentage: 33.33,
    secondPlacePercentage: 50,
    thirdPlacePercentage: 0,
    fourthPlacePercentage: 16.67,
    pointAverage: 197.83,
  },
  {
    id: 2,
    name: 'Player 2',
    gameCount: 6,
    rankTotal: 4,
    firstPlaceCount: 3,
    secondPlaceCount: 1,
    thirdPlaceCount: 0,
    fourthPlaceCount: 2,
    pointTotal: 1038,
    rankAverage: 2.17,
    firstPlacePercentage: 50,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 0,
    fourthPlacePercentage: 33.33,
    pointAverage: 173,
  },
  {
    id: 3,
    name: 'Player 3',
    gameCount: 6,
    rankTotal: 2,
    firstPlaceCount: 2,
    secondPlaceCount: 1,
    thirdPlaceCount: 2,
    fourthPlaceCount: 1,
    pointTotal: 473,
    rankAverage: 2.33,
    firstPlacePercentage: 33.33,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 33.33,
    fourthPlacePercentage: 16.67,
    pointAverage: 78.83,
  },
  {
    id: 4,
    name: 'Player 4',
    gameCount: 6,
    rankTotal: -2,
    firstPlaceCount: 1,
    secondPlaceCount: 1,
    thirdPlaceCount: 3,
    fourthPlaceCount: 1,
    pointTotal: -481,
    rankAverage: 2.5,
    firstPlacePercentage: 16.67,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 50,
    fourthPlacePercentage: 16.67,
    pointAverage: -80.17,
  },
  {
    id: 5,
    name: 'Player 5',
    gameCount: 6,
    rankTotal: -4,
    firstPlaceCount: 1,
    secondPlaceCount: 1,
    thirdPlaceCount: 2,
    fourthPlaceCount: 2,
    pointTotal: -912,
    rankAverage: 2.67,
    firstPlacePercentage: 16.67,
    secondPlacePercentage: 16.67,
    thirdPlacePercentage: 33.33,
    fourthPlacePercentage: 33.33,
    pointAverage: -152,
  },
  {
    id: 6,
    name: 'Player 6',
    gameCount: 6,
    rankTotal: -6,
    firstPlaceCount: 0,
    secondPlaceCount: 2,
    thirdPlaceCount: 2,
    fourthPlaceCount: 2,
    pointTotal: -1305,
    rankAverage: 3,
    firstPlacePercentage: 0,
    secondPlacePercentage: 33.33,
    thirdPlacePercentage: 33.33,
    fourthPlacePercentage: 33.33,
    pointAverage: -217.5,
  },
] as IPlayer[]

export const fetchPlayers = async (): Promise<IPlayer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPlayerData)
    }, 1000)
  })
}

export const fetchPlayerById = async (id: number): Promise<IPlayer | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const player = mockPlayerData.find((p) => p.id === id)
      resolve(player)
    }, 1000)
  })
}
