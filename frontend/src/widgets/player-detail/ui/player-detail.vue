<template>
  <div class="flex flex-col gap-8 rounded-lg">
    <template v-if="playerData">
      <div class="text-xl font-semibold">{{ playerData.name }}</div>
      <div class="flex gap-4">
        <div class="flex flex-1 gap-4">
          <StatusCard>
            <template #icon>
              <i class="pi pi-chart-bar text-2xltext-gray-600"></i>
            </template>
            <template #label>対局数</template>
            <template #value>{{ playerData.gameCount }}</template>
            <template #unit>荘</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-trophy text-2xl text-gray-600"></i>
            </template>
            <template #label>通算着順</template>
            <template #value>{{ playerData.rpTotal }}</template>
            <template #unit>pt</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-chart-line text-2xl text-gray-600"></i>
            </template>
            <template #label>平均順位</template>
            <template #value>{{ (5 - playerData.tpAvg).toFixed(2) }}</template>
            <template #unit>位</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-star text-2xl text-gray-600"></i>
            </template>
            <template #label>通算素点</template>
            <template #value>{{ playerData.gpTotal }}</template>
            <template #unit>pt</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-chart-line text-2xl text-gray-600"></i>
            </template>
            <template #label>平均素点</template>
            <template #value>{{ playerData.gpAvg.toFixed(2) }}</template>
            <template #unit>pt</template>
          </StatusCard>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 rounded-lg bg-white p-8 shadow">
          <p class="text-xl font-semibold">順位分布</p>
          <DataTable :value="placeStats" class="mt-4">
            <Column field="placeName" header="順位" class="bg-gray-100" body-style="text-align: center" />
            <Column field="count" header="回数">
              <template #body="slotProps">
                <p class="flex items-baseline justify-end gap-1">
                  <span class="text-xl font-semibold text-gray-800">{{ slotProps.data.count }}</span>
                  <span class="text-sm font-semibold text-gray-800">回</span>
                </p>
              </template>
            </Column>
            <Column field="ratio" header="率">
              <template #body="slotProps">
                <p class="flex items-baseline justify-end gap-1">
                  <span class="text-xl font-semibold text-gray-800">{{ slotProps.data.ratio.toFixed(2) }}</span>
                  <span class="text-sm font-semibold text-gray-800">%</span>
                </p>
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="flex-1 rounded-lg bg-white p-8 shadow">
          <p class="text-xl font-semibold">座順別成績</p>
          <DataTable :value="seatStats" class="mt-4 text-end">
            <Column field="seatName" header="座順" class="bg-gray-100" body-style="text-align: center" />
            <Column field="count" header="回数">
              <template #body="slotProps">
                <p class="flex items-baseline justify-end gap-1">
                  <span class="text-xl font-semibold text-gray-800">{{ slotProps.data.count }}</span>
                  <span class="text-sm font-semibold text-gray-800">回</span>
                </p>
              </template>
            </Column>
            <Column field="avgPlace" header="平均順位">
              <template #body="slotProps">
                <p class="flex items-baseline justify-end gap-1">
                  <span class="text-xl font-semibold text-gray-800">
                    {{ slotProps.data.count === 0 ? '-' : slotProps.data.avgPlace.toFixed(2) }}
                  </span>
                  <span v-if="slotProps.data.count > 0" class="text-sm font-semibold text-gray-800">位</span>
                </p>
              </template>
            </Column>
            <Column field="avgGamePoint" header="平均素点">
              <template #body="slotProps">
                <p class="flex items-baseline justify-end gap-1">
                  <span class="text-xl font-semibold text-gray-800">
                    {{ slotProps.data.count === 0 ? '-' : slotProps.data.avgGamePoint.toFixed(2) }}
                  </span>
                  <span v-if="slotProps.data.count > 0" class="text-sm font-semibold text-gray-800">pt</span>
                </p>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div class="flex-1 rounded-lg bg-white p-8 shadow">
        <p class="text-xl font-semibold">対戦相手別成績</p>
        <DataTable
          :value="opponentStats"
          class="mt-4 text-end"
          sort-field="totalPlacePointDiff"
          :sort-order="-1"
          :scrollable="true"
          scrollHeight="400px"
        >
          <Column field="playerName" header="氏名">
            <template #body="slotProps">
              <RouterLink
                :to="{ name: 'player', params: { id: slotProps.data.playerId } }"
                class="text-green-600 underline hover:text-green-800"
              >
                {{ slotProps.data.playerName }}
              </RouterLink>
            </template>
          </Column>
          <Column field="gameCount" header="対戦数" sortable>
            <template #body="slotProps">
              <p class="flex items-baseline justify-end gap-1">
                <span class="text-xl font-semibold text-gray-800">{{ slotProps.data.gameCount }}</span>
                <span class="text-sm font-semibold text-gray-800">回</span>
              </p>
            </template>
          </Column>
          <Column field="totalPlacePointDiff" header="通算着順点差" sortable>
            <template #body="slotProps">
              <p class="flex items-baseline justify-end gap-1">
                <span
                  class="text-xl font-semibold"
                  :class="{
                    'text-red-600': slotProps.data.totalPlacePointDiff < 0,
                    'text-green-600': slotProps.data.totalPlacePointDiff > 0,
                    'text-gray-800': slotProps.data.totalPlacePointDiff === 0,
                  }"
                >
                  {{ slotProps.data.totalPlacePointDiff > 0 ? '+' : ''
                  }}{{ slotProps.data.totalPlacePointDiff.toFixed(2) }}
                </span>
                <span class="text-sm font-semibold text-gray-800">pt</span>
              </p>
            </template>
          </Column>
          <Column field="avgPlaceDiff" header="平均順位差" sortable>
            <template #body="slotProps">
              <p class="flex items-baseline justify-end gap-1">
                <span
                  class="text-xl font-semibold"
                  :class="{
                    'text-red-600': slotProps.data.avgPlaceDiff > 0,
                    'text-green-600': slotProps.data.avgPlaceDiff < 0,
                    'text-gray-800': slotProps.data.avgPlaceDiff === 0,
                  }"
                >
                  {{ slotProps.data.avgPlaceDiff > 0 ? '+' : '' }}{{ slotProps.data.avgPlaceDiff.toFixed(2) }}
                </span>
                <span class="text-sm font-semibold text-gray-800">位</span>
              </p>
            </template>
          </Column>
          <Column field="avgGamePointDiff" header="平均素点差" sortable>
            <template #body="slotProps">
              <p class="flex items-baseline justify-end gap-1">
                <span
                  class="text-xl font-semibold"
                  :class="{
                    'text-red-600': slotProps.data.avgGamePointDiff < 0,
                    'text-green-600': slotProps.data.avgGamePointDiff > 0,
                    'text-gray-800': slotProps.data.avgGamePointDiff === 0,
                  }"
                >
                  {{ slotProps.data.avgGamePointDiff > 0 ? '+' : '' }}{{ slotProps.data.avgGamePointDiff.toFixed(2) }}
                </span>
                <span class="text-sm font-semibold text-gray-800">pt</span>
              </p>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="flex-1 rounded-lg bg-white p-8 shadow">
        <p class="text-xl font-semibold">直近の対局結果</p>
        <DataTable
          :value="gameHistoryPairs"
          show-gridlines
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          class="mt-4"
          tableStyle="min-width: 50rem"
        >
          <Column>
            <template #header>
              <div class="flex w-full justify-between">
                <div>対局日</div>
                <div>素点 / 順位点</div>
                <div>詳細</div>
              </div>
            </template>
            <template #body="slotProps">
              <RouterLink
                v-if="slotProps.data.game1"
                :to="{ name: 'tournament', params: { id: slotProps.data.game1.tournamentId } }"
                class="flex justify-between"
              >
                <div class="text-sm text-gray-600">{{ formatDate(slotProps.data.game1.tournamentDate) }}</div>
                <div class="text-right font-medium">
                  {{ slotProps.data.game1.gamePoint }} / {{ slotProps.data.game1.tablePoint }}
                </div>
                <i class="material-symbols-outlined text-sm text-green-600">arrow_forward</i>
              </RouterLink>
            </template>
          </Column>
          <Column>
            <template #header>
              <div class="flex w-full justify-between">
                <div>対局日</div>
                <div>素点 / 順位点</div>
                <div>詳細</div>
              </div>
            </template>
            <template #body="slotProps">
              <RouterLink
                v-if="slotProps.data.game2"
                :to="{ name: 'tournament', params: { id: slotProps.data.game2.tournamentId } }"
                class="flex justify-between"
              >
                <div class="text-sm text-gray-600">{{ formatDate(slotProps.data.game2.tournamentDate) }}</div>
                <div class="text-right font-medium">
                  {{ slotProps.data.game2.gamePoint }} / {{ slotProps.data.game2.tablePoint }}
                </div>
                <i class="material-symbols-outlined text-sm text-green-600">arrow_forward</i>
              </RouterLink>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Column, DataTable } from 'primevue'
import { fetchPlayerStatsById } from '@/entities/player'
import type { IPlayerWithGames } from '@/entities/player'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import StatusCard from './player-detail-main-status-card.vue'

const route = useRoute()
const playerData = ref<IPlayerWithGames | null>()
const placeStats = computed(() => [
  {
    placeName: '1位',
    count: playerData.value?.firstPlaceCount || 0,
    ratio: playerData.value?.firstPlacePercentage || 0,
  },
  {
    placeName: '2位',
    count: playerData.value?.secondPlaceCount || 0,
    ratio: playerData.value?.secondPlacePercentage || 0,
  },
  {
    placeName: '3位',
    count: playerData.value?.thirdPlaceCount || 0,
    ratio: playerData.value?.thirdPlacePercentage || 0,
  },
  {
    placeName: '4位',
    count: playerData.value?.fourthPlaceCount || 0,
    ratio: playerData.value?.fourthPlacePercentage || 0,
  },
])

const gameHistory = computed(() => {
  if (!playerData.value?.gameDetails) return []

  return playerData.value.gameDetails
    .map((game) => {
      const playerResult = game.players.find((p) => p.playerId === playerData.value?.id)
      if (!playerResult) return null

      return {
        ...game,
        gamePoint: playerResult.gamePoint,
        placePoint: playerResult.placePoint,
        tablePoint: playerResult.tablePoint,
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (!a && !b) return 0
      if (!a) return 1
      if (!b) return -1
      return b.gameId - a.gameId
    })
})

const gameHistoryPairs = computed(() => {
  const games = gameHistory.value
  const pairs = []

  for (let i = 0; i < games.length; i += 2) {
    pairs.push({
      game1: games[i] || null,
      game2: games[i + 1] || null,
    })
  }

  return pairs
})

const seatStats = computed(() => {
  if (!playerData.value?.gameDetails) return []

  const seatNames = ['東', '南', '西', '北']
  const seatData = {
    東: { count: 0, totalPlace: 0, totalGamePoint: 0 },
    南: { count: 0, totalPlace: 0, totalGamePoint: 0 },
    西: { count: 0, totalPlace: 0, totalGamePoint: 0 },
    北: { count: 0, totalPlace: 0, totalGamePoint: 0 },
  }

  playerData.value.gameDetails.forEach((game) => {
    const sortedPlayers = [...game.players].sort((a, b) => a.playerId - b.playerId)

    const playerIndex = sortedPlayers.findIndex((p) => p.playerId === playerData.value?.id)

    if (playerIndex !== -1) {
      const seatName = seatNames[playerIndex] as keyof typeof seatData
      const playerResult = sortedPlayers[playerIndex]

      seatData[seatName].count++
      const place = 5 - playerResult.tablePoint
      seatData[seatName].totalPlace += place
      seatData[seatName].totalGamePoint += playerResult.gamePoint
    }
  })

  return seatNames.map((seatName) => {
    const data = seatData[seatName as keyof typeof seatData]
    return {
      seatName,
      count: data.count,
      avgPlace: data.count > 0 ? data.totalPlace / data.count : 0,
      avgGamePoint: data.count > 0 ? data.totalGamePoint / data.count : 0,
    }
  })
})

const opponentStats = computed(() => {
  if (!playerData.value?.gameDetails) return []

  const opponentData = new Map<
    number,
    {
      playerId: number
      playerName: string
      gameCount: number
      totalPlace: number
      totalPlacePoint: number
      totalGamePoint: number
      totalOpponentPlace: number
      totalOpponentGamePoint: number
      totalOpponentPlacePoint: number
    }
  >()

  playerData.value.gameDetails.forEach((game) => {
    const currentPlayerResult = game.players.find((p) => p.playerId === playerData.value?.id)
    if (!currentPlayerResult) return

    game.players.forEach((opponent) => {
      if (opponent.playerId === playerData.value?.id) return

      if (!opponentData.has(opponent.playerId)) {
        opponentData.set(opponent.playerId, {
          playerId: opponent.playerId,
          playerName: opponent.playerName,
          gameCount: 0,
          totalPlace: 0,
          totalPlacePoint: 0,
          totalGamePoint: 0,
          totalOpponentPlace: 0,
          totalOpponentGamePoint: 0,
          totalOpponentPlacePoint: 0,
        })
      }

      const data = opponentData.get(opponent.playerId)!
      data.gameCount++
      const place = 5 - currentPlayerResult.tablePoint
      const opponentPlace = 5 - opponent.tablePoint
      data.totalPlace += place
      data.totalPlacePoint += currentPlayerResult.placePoint
      data.totalGamePoint += currentPlayerResult.gamePoint
      data.totalOpponentPlace += opponentPlace
      data.totalOpponentGamePoint += opponent.gamePoint
      data.totalOpponentPlacePoint += opponent.placePoint
    })
  })
  return Array.from(opponentData.values())
    .map((data) => {
      const avgPlace = data.gameCount > 0 ? data.totalPlace / data.gameCount : 0
      const avgOpponentPlace = data.gameCount > 0 ? data.totalOpponentPlace / data.gameCount : 0
      const avgGamePoint = data.gameCount > 0 ? data.totalGamePoint / data.gameCount : 0
      const avgOpponentGamePoint = data.gameCount > 0 ? data.totalOpponentGamePoint / data.gameCount : 0

      return {
        playerId: data.playerId,
        playerName: data.playerName,
        gameCount: data.gameCount,
        totalPlacePointDiff: data.totalPlacePoint - data.totalOpponentPlacePoint,
        avgPlace: avgPlace,
        avgGamePoint: avgGamePoint,
        avgPlaceDiff: avgPlace - avgOpponentPlace,
        avgGamePointDiff: avgGamePoint - avgOpponentGamePoint,
      }
    })
    .sort((a, b) => b.gameCount - a.gameCount)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(async () => {
  playerData.value = await fetchPlayerStatsById(route.params.id as unknown as number)
})
</script>
