<template>
  <div class="flex flex-col gap-8 rounded-lg py-8">
    <template v-if="playerData">
      <div class="text-xl font-semibold">{{ playerData.name }}</div>
      <div class="flex gap-4">
        <div class="flex flex-1 gap-4">
          <StatusCard>
            <template #icon>
              <i class="pi pi-chart-bar text-2xl text-gray-600"></i>
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
            <template #value>{{ playerData.rankTotal }}</template>
            <template #unit>pt</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-chart-line text-2xl text-gray-600"></i>
            </template>
            <template #label>平均着順</template>
            <template #value>{{ playerData.rankAverage.toFixed(2) }}</template>
            <template #unit>位</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-star text-2xl text-gray-600"></i>
            </template>
            <template #label>通算素点</template>
            <template #value>{{ playerData.pointTotal }}</template>
            <template #unit>pt</template>
          </StatusCard>
          <StatusCard>
            <template #icon>
              <i class="pi pi-chart-line text-2xl text-gray-600"></i>
            </template>
            <template #label>平均素点</template>
            <template #value>{{ playerData.pointAverage.toFixed(2) }}</template>
            <template #unit>pt</template>
          </StatusCard>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex flex-1 flex-col gap-8">
          <div class="rounded-lg bg-white p-8 shadow">
            <p class="text-xl font-semibold">着順分布</p>
            <!-- TODO -->
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPlayerById } from '@/entities/player'
import type { IPlayer } from '@/entities/player'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import StatusCard from './player-detail-main-status-card.vue'

const route = useRoute()
const playerData = ref<IPlayer>()

onMounted(async () => {
  playerData.value = await fetchPlayerById(route.params.id as string)
})
</script>
