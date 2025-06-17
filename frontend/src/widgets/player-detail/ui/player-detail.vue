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
            <DataTable :value="rankDistribution" class="text-end">
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
        <p class="text-xl font-semibold">対局結果</p>
        <!-- TODO -->
      </div>
    </template>
    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Column, DataTable, SelectButton } from 'primevue'
import { fetchPlayerStatsById } from '@/entities/player'
import type { IPlayer } from '@/entities/player'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import StatusCard from './player-detail-main-status-card.vue'

const route = useRoute()
const playerData = ref<IPlayer | null>()
const rankDistribution = computed(() => [
  { label: '1位', count: playerData.value?.firstPlaceCount || 0, ratio: playerData.value?.firstPlacePercentage || 0 },
  { label: '2位', count: playerData.value?.secondPlaceCount || 0, ratio: playerData.value?.secondPlacePercentage || 0 },
  { label: '3位', count: playerData.value?.thirdPlaceCount || 0, ratio: playerData.value?.thirdPlacePercentage || 0 },
  { label: '4位', count: playerData.value?.fourthPlaceCount || 0, ratio: playerData.value?.fourthPlacePercentage || 0 },
])

onMounted(async () => {
  playerData.value = await fetchPlayerStatsById(route.params.id as unknown as number)
})
</script>
