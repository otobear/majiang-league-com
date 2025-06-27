<template>
  <div class="flex flex-col gap-8 rounded-lg py-8">
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
            <template #label>平均着順</template>
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
        <div class="flex flex-1 flex-col gap-8">
          <div class="rounded-lg bg-white p-8 shadow">
            <p class="text-xl font-semibold">着順分布</p>
            <DataTable :value="placeDistribution" class="text-end">
              <Column field="label" class="bg-gray-100" />
              <Column field="count">
                <template #body="slotProps">
                  <p class="flex items-baseline justify-end gap-1">
                    <span class="text-xl font-semibold text-gray-800">{{ slotProps.data.count }}</span>
                    <span class="text-sm font-semibold text-gray-800">回</span>
                  </p>
                </template>
              </Column>
              <Column field="ratio">
                <template #body="slotProps">
                  <p class="flex items-baseline justify-end gap-1">
                    <span class="text-xl font-semibold text-gray-800">{{ slotProps.data.ratio.toFixed(2) }}</span>
                    <span class="text-sm font-semibold text-gray-800">%</span>
                  </p>
                </template>
              </Column>
            </DataTable>
          </div>
          <div class="rounded-lg bg-white p-8 shadow">
            <p class="text-xl font-semibold">座順別成績</p>
            <!-- TODO -->
          </div>
        </div>
        <div class="flex-1 rounded-lg bg-white p-8 shadow">
          <p class="text-xl font-semibold">対戦相手別成績</p>
          <!-- TODO -->
        </div>
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
              <router-link
                v-if="slotProps.data.game1"
                :to="{ name: 'tournament', params: { id: slotProps.data.game1.tournamentId } }"
                class="flex justify-between"
              >
                <div class="text-sm text-gray-600">{{ formatDate(slotProps.data.game1.tournamentDate) }}</div>
                <div class="text-right font-medium">
                  {{ slotProps.data.game1.gamePoint }} / {{ slotProps.data.game1.tablePoint }}
                </div>
                <i class="material-symbols-outlined text-sm text-green-600">arrow_forward</i>
              </router-link>
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
              <router-link
                v-if="slotProps.data.game2"
                :to="{ name: 'tournament', params: { id: slotProps.data.game2.tournamentId } }"
                class="flex justify-between"
              >
                <div class="text-sm text-gray-600">{{ formatDate(slotProps.data.game2.tournamentDate) }}</div>
                <div class="text-right font-medium">
                  {{ slotProps.data.game2.gamePoint }} / {{ slotProps.data.game2.tablePoint }}
                </div>
                <i class="material-symbols-outlined text-sm text-green-600">arrow_forward</i>
              </router-link>
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
const placeDistribution = computed(() => [
  { label: '1位', count: playerData.value?.firstPlaceCount || 0, ratio: playerData.value?.firstPlacePercentage || 0 },
  { label: '2位', count: playerData.value?.secondPlaceCount || 0, ratio: playerData.value?.secondPlacePercentage || 0 },
  { label: '3位', count: playerData.value?.thirdPlaceCount || 0, ratio: playerData.value?.thirdPlacePercentage || 0 },
  { label: '4位', count: playerData.value?.fourthPlaceCount || 0, ratio: playerData.value?.fourthPlacePercentage || 0 },
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
