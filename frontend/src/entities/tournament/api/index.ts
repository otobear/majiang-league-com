import type { ITournament } from '../model'

const mockTournamentData = [
  {
    id: '2',
    info: {
      name: '第2回',
      subName: 'プレ赤塚リーグ（仮）',
      date: '2021-04-25',
      location: 'ガラパゴス高田馬場店',
    },
    summary: [
      {
        playerId: '5',
        playerName: '柏木拓',
        tournamentRank: 1,
        totalPoint: {
          tablePoint: 14,
          gamePoint: 175,
        },
        roundPoint: [
          { tablePoint: 3, gamePoint: -51 },
          { tablePoint: 4, gamePoint: 121 },
          { tablePoint: 3, gamePoint: 25 },
          { tablePoint: 4, gamePoint: 80 },
        ],
      },
      {
        playerId: '3',
        playerName: '遠藤俊晃',
        tournamentRank: 2,
        totalPoint: {
          tablePoint: 12,
          gamePoint: 8,
        },
        roundPoint: [
          { tablePoint: 1, gamePoint: -185 },
          { tablePoint: 4, gamePoint: 74 },
          { tablePoint: 4, gamePoint: 81 },
          { tablePoint: 3, gamePoint: 38 },
        ],
      },
      {
        playerId: '10',
        playerName: '手塚ゆり',
        tournamentRank: 3,
        totalPoint: {
          tablePoint: 11.5,
          gamePoint: 188,
        },
        roundPoint: [
          { tablePoint: 1.5, gamePoint: -55 },
          { tablePoint: 2, gamePoint: -49 },
          { tablePoint: 4, gamePoint: 154 },
          { tablePoint: 4, gamePoint: 138 },
        ],
      },
      {
        playerId: '7',
        playerName: '小林英夫',
        tournamentRank: 4,
        totalPoint: {
          tablePoint: 11,
          gamePoint: 93,
        },
        roundPoint: [
          { tablePoint: 4, gamePoint: 160 },
          { tablePoint: 2, gamePoint: -59 },
          { tablePoint: 3, gamePoint: 1 },
          { tablePoint: 2, gamePoint: -9 },
        ],
      },
      {
        playerId: '11',
        playerName: '田籠謙介',
        tournamentRank: 5,
        totalPoint: {
          tablePoint: 9,
          gamePoint: 33,
        },
        roundPoint: [
          { tablePoint: 3, gamePoint: 63 },
          { tablePoint: 3, gamePoint: 85 },
          { tablePoint: 2, gamePoint: -6 },
          { tablePoint: 1, gamePoint: -109 },
        ],
      },
      {
        playerId: '12',
        playerName: '柴崎健司',
        tournamentRank: 6,
        totalPoint: {
          tablePoint: 8,
          gamePoint: -81,
        },
        roundPoint: [
          { tablePoint: 2, gamePoint: -38 },
          { tablePoint: 1, gamePoint: -77 },
          { tablePoint: 2, gamePoint: -7 },
          { tablePoint: 3, gamePoint: 41 },
        ],
      },
      {
        playerId: '6',
        playerName: '二萬章吾',
        tournamentRank: 7,
        totalPoint: {
          tablePoint: 8,
          gamePoint: -176,
        },
        roundPoint: [
          { tablePoint: 4, gamePoint: 161 },
          { tablePoint: 1, gamePoint: -147 },
          { tablePoint: 1, gamePoint: -148 },
          { tablePoint: 2, gamePoint: -42 },
        ],
      },
      {
        playerId: '2',
        playerName: '赤塚修',
        tournamentRank: 8,
        totalPoint: {
          tablePoint: 6.5,
          gamePoint: -240,
        },
        roundPoint: [
          { tablePoint: 1.5, gamePoint: -55 },
          { tablePoint: 3, gamePoint: 52 },
          { tablePoint: 1, gamePoint: -100 },
          { tablePoint: 1, gamePoint: -137 },
        ],
      },
    ],
    sessions: [
      {
        info: {
          id: '1',
          name: '1回戦',
        },
        games: [
          {
            id: '1',
            forfeit: 0,
            playerResults: [
              { playerId: '11', playerName: '田籠謙介', tablePoint: 3, gamePoint: 63 },
              { playerId: '7', playerName: '小林英夫', tablePoint: 4, gamePoint: 160 },
              { playerId: '12', playerName: '柴崎健司', tablePoint: 2, gamePoint: -38 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 1, gamePoint: -185 },
            ],
          },
          {
            id: '2',
            forfeit: 0,
            playerResults: [
              { playerId: '6', playerName: '二萬章吾', tablePoint: 4, gamePoint: 161 },
              { playerId: '10', playerName: '手塚ゆり', tablePoint: 1.5, gamePoint: -55 },
              { playerId: '5', playerName: '柏木拓', tablePoint: 3, gamePoint: -51 },
              { playerId: '2', playerName: '赤塚修', tablePoint: 1.5, gamePoint: -55 },
            ],
          },
        ],
      },
      {
        info: {
          id: '2',
          name: '2回戦',
        },
        games: [
          {
            id: '3',
            forfeit: 0,
            playerResults: [
              { playerId: '5', playerName: '柏木拓', tablePoint: 4, gamePoint: 121 },
              { playerId: '6', playerName: '二萬章吾', tablePoint: 1, gamePoint: -147 },
              { playerId: '11', playerName: '田籠謙介', tablePoint: 3, gamePoint: 85 },
              { playerId: '7', playerName: '小林英夫', tablePoint: 2, gamePoint: -59 },
            ],
          },
          {
            id: '4',
            forfeit: 0,
            playerResults: [
              { playerId: '2', playerName: '赤塚修', tablePoint: 3, gamePoint: 52 },
              { playerId: '12', playerName: '柴崎健司', tablePoint: 1, gamePoint: -77 },
              { playerId: '10', playerName: '手塚ゆり', tablePoint: 2, gamePoint: -49 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 4, gamePoint: 74 },
            ],
          },
        ],
      },
      {
        info: {
          id: '3',
          name: '3回戦',
        },
        games: [
          {
            id: '5',
            forfeit: 0,
            playerResults: [
              { playerId: '2', playerName: '赤塚修', tablePoint: 1, gamePoint: -100 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 4, gamePoint: 81 },
              { playerId: '5', playerName: '柏木拓', tablePoint: 3, gamePoint: 25 },
              { playerId: '11', playerName: '田籠謙介', tablePoint: 2, gamePoint: -6 },
            ],
          },
          {
            id: '6',
            forfeit: 0,
            playerResults: [
              { playerId: '12', playerName: '柴崎健司', tablePoint: 2, gamePoint: -7 },
              { playerId: '7', playerName: '小林英夫', tablePoint: 3, gamePoint: 1 },
              { playerId: '10', playerName: '手塚ゆり', tablePoint: 4, gamePoint: 154 },
              { playerId: '6', playerName: '二萬章吾', tablePoint: 1, gamePoint: -148 },
            ],
          },
        ],
      },
      {
        info: {
          id: '4',
          name: '4回戦',
        },
        games: [
          {
            id: '7',
            forfeit: 0,
            playerResults: [
              { playerId: '7', playerName: '小林英夫', tablePoint: 2, gamePoint: -9 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 3, gamePoint: 38 },
              { playerId: '11', playerName: '田籠謙介', tablePoint: 1, gamePoint: -109 },
              { playerId: '5', playerName: '柏木拓', tablePoint: 4, gamePoint: 80 },
            ],
          },
          {
            id: '8',
            forfeit: 0,
            playerResults: [
              { playerId: '6', playerName: '二萬章吾', tablePoint: 2, gamePoint: -42 },
              { playerId: '10', playerName: '手塚ゆり', tablePoint: 4, gamePoint: 138 },
              { playerId: '12', playerName: '柴崎健司', tablePoint: 3, gamePoint: 41 },
              { playerId: '2', playerName: '赤塚修', tablePoint: 1, gamePoint: -137 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '1',
    info: {
      name: '第1回',
      subName: 'プレ赤塚リーグ（仮）',
      date: '2021-03-28',
      location: 'ガラパゴス高田馬場店',
    },
    summary: [
      {
        playerId: '1',
        playerName: '土屋政士',
        tournamentRank: 1,
        totalPoint: {
          tablePoint: 13,
          gamePoint: 462,
        },
        roundPoint: [
          { tablePoint: 4, gamePoint: 245 },
          { tablePoint: 4, gamePoint: 134 },
          { tablePoint: 4, gamePoint: 284 },
          { tablePoint: 1, gamePoint: -201 },
        ],
      },
      {
        playerId: '2',
        playerName: '赤塚修',
        tournamentRank: 2,
        totalPoint: {
          tablePoint: 12,
          gamePoint: 54,
        },
        roundPoint: [
          { tablePoint: 2, gamePoint: -90 },
          { tablePoint: 4, gamePoint: 120 },
          { tablePoint: 2, gamePoint: -97 },
          { tablePoint: 4, gamePoint: 121 },
        ],
      },
      {
        playerId: '3',
        playerName: '遠藤俊晃',
        tournamentRank: 3,
        totalPoint: {
          tablePoint: 11,
          gamePoint: 145,
        },
        roundPoint: [
          { tablePoint: 3, gamePoint: 122 },
          { tablePoint: 2, gamePoint: -65 },
          { tablePoint: 3, gamePoint: -7 },
          { tablePoint: 3, gamePoint: 95 },
        ],
      },
      {
        playerId: '4',
        playerName: '左永',
        tournamentRank: 4,
        totalPoint: {
          tablePoint: 10,
          gamePoint: 48,
        },
        roundPoint: [
          { tablePoint: 4, gamePoint: 125 },
          { tablePoint: 3, gamePoint: 118 },
          { tablePoint: 1, gamePoint: -180 },
          { tablePoint: 2, gamePoint: -15 },
        ],
      },
      {
        playerId: '5',
        playerName: '柏木拓',
        tournamentRank: 5,
        totalPoint: {
          tablePoint: 10,
          gamePoint: 25,
        },
        roundPoint: [
          { tablePoint: 3, gamePoint: -19 },
          { tablePoint: 1, gamePoint: -187 },
          { tablePoint: 2, gamePoint: -7 },
          { tablePoint: 4, gamePoint: 238 },
        ],
      },
      {
        playerId: '6',
        playerName: '二萬章吾',
        tournamentRank: 6,
        totalPoint: {
          tablePoint: 9,
          gamePoint: -89,
        },
        roundPoint: [
          { tablePoint: 1, gamePoint: -157 },
          { tablePoint: 2, gamePoint: -57 },
          { tablePoint: 3, gamePoint: 57 },
          { tablePoint: 3, gamePoint: 68 },
        ],
      },
      {
        playerId: '7',
        playerName: '小林英夫',
        tournamentRank: 7,
        totalPoint: {
          tablePoint: 8,
          gamePoint: -262,
        },
        roundPoint: [
          { tablePoint: 2, gamePoint: -104 },
          { tablePoint: 1, gamePoint: -58 },
          { tablePoint: 4, gamePoint: 109 },
          { tablePoint: 1, gamePoint: -209 },
        ],
      },
      {
        playerId: '8',
        playerName: '石橋大助',
        tournamentRank: 8,
        totalPoint: {
          tablePoint: 6,
          gamePoint: -383,
        },
        roundPoint: [
          { tablePoint: 1, gamePoint: -122 },
          { tablePoint: 3, gamePoint: -5 },
          { tablePoint: 1, gamePoint: -159 },
          { tablePoint: 2, gamePoint: -97 },
        ],
      },
    ],
    sessions: [
      {
        info: {
          id: '1',
          name: '1回戦',
        },
        games: [
          {
            id: '1',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '1', playerName: '土屋政士', tablePoint: 4, gamePoint: 245 },
              { playerId: '2', playerName: '柏木拓', tablePoint: 3, gamePoint: -19 },
              { playerId: '3', playerName: '小林英夫', tablePoint: 2, gamePoint: -104 },
              { playerId: '4', playerName: '石橋大助', tablePoint: 1, gamePoint: -122 },
            ],
          },
          {
            id: '2',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '5', playerName: '赤塚修', tablePoint: 2, gamePoint: -90 },
              { playerId: '6', playerName: '遠藤俊晃', tablePoint: 3, gamePoint: 122 },
              { playerId: '7', playerName: '左永', tablePoint: 4, gamePoint: 125 },
              { playerId: '8', playerName: '二萬章吾', tablePoint: 1, gamePoint: -157 },
            ],
          },
        ],
      },
      {
        info: {
          id: '2',
          name: '2回戦',
        },
        games: [
          {
            id: '3',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '1', playerName: '土屋政士', tablePoint: 4, gamePoint: 134 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 2, gamePoint: -65 },
              { playerId: '4', playerName: '左永', tablePoint: 3, gamePoint: 118 },
              { playerId: '5', playerName: '柏木拓', tablePoint: 1, gamePoint: -187 },
            ],
          },
          {
            id: '4',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '2', playerName: '赤塚修', tablePoint: 4, gamePoint: 120 },
              { playerId: '6', playerName: '二萬章吾', tablePoint: 2, gamePoint: -57 },
              { playerId: '7', playerName: '小林英夫', tablePoint: 1, gamePoint: -58 },
              { playerId: '8', playerName: '石橋大助', tablePoint: 3, gamePoint: -5 },
            ],
          },
        ],
      },
      {
        info: {
          id: '3',
          name: '3回戦',
        },
        games: [
          {
            id: '5',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '1', playerName: '土屋政士', tablePoint: 4, gamePoint: 284 },
              { playerId: '2', playerName: '赤塚修', tablePoint: 2, gamePoint: -97 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 3, gamePoint: -7 },
              { playerId: '4', playerName: '左永', tablePoint: 1, gamePoint: -180 },
            ],
          },
          {
            id: '6',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '5', playerName: '柏木拓', tablePoint: 2, gamePoint: -7 },
              { playerId: '6', playerName: '二萬章吾', tablePoint: 3, gamePoint: 57 },
              { playerId: '7', playerName: '小林英夫', tablePoint: 1, gamePoint: 109 },
              { playerId: '8', playerName: '石橋大助', tablePoint: 4, gamePoint: -159 },
            ],
          },
        ],
      },
      {
        info: {
          id: '4',
          name: '4回戦',
        },
        games: [
          {
            id: '7',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '1', playerName: '土屋政士', tablePoint: 1, gamePoint: -201 },
              { playerId: '2', playerName: '赤塚修', tablePoint: 4, gamePoint: 121 },
              { playerId: '3', playerName: '遠藤俊晃', tablePoint: 3, gamePoint: 95 },
              { playerId: '4', playerName: '左永', tablePoint: 2, gamePoint: -15 },
            ],
          },
          {
            id: '8',
            forfeitGamePoint: 0,
            playerResults: [
              { playerId: '5', playerName: '柏木拓', tablePoint: 4, gamePoint: 238 },
              { playerId: '6', playerName: '二萬章吾', tablePoint: 3, gamePoint: 68 },
              { playerId: '7', playerName: '小林英夫', tablePoint: 1, gamePoint: -209 },
              { playerId: '8', playerName: '石橋大助', tablePoint: 2, gamePoint: -97 },
            ],
          },
        ],
      },
    ],
  },
] as ITournament[]

export const fetchTournaments = async (): Promise<ITournament[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTournamentData)
    }, 1000)
  })
}

export const fetchTournamentById = async (id: string): Promise<ITournament | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tournament = mockTournamentData.find((t) => t.id === id)
      resolve(tournament)
    }, 1000)
  })
}
