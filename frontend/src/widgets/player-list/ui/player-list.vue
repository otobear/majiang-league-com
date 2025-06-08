<template>
  <div v-if="playersData && playersData.length" class="flex flex-col gap-4 rounded-lg bg-white p-8 shadow">
    <SelectButton
      v-model="aggregationType"
      :options="aggregationTypeOptions"
      option-label="label"
      data-key="label"
      :allow-empty="false"
    />
    <DataTable :value="playersData" sortField="rankTotal" :sortOrder="-1">
      <Column header="着順">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column header="選手名" field="name">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'player', params: { id: slotProps.data.id } }"
            class="text-green-700 underline hover:text-green-800"
          >
            {{ slotProps.data.name }}
          </router-link>
        </template>
      </Column>
      <Column header="対局数" field="gameCount" sortable />
      <template v-if="aggregationType.value === 'total'">
        <Column header="通算着順" field="rankTotal" sortable />
        <Column header="1着数" field="firstPlaceCount" sortable />
        <Column header="2着数" field="secondPlaceCount" sortable />
        <Column header="3着数" field="thirdPlaceCount" sortable />
        <Column header="4着数" field="fourthPlaceCount" sortable />
        <Column header="通算素点" field="pointTotal" sortable />
      </template>
      <template v-else>
        <Column header="平均着順" field="rankAverage" sortable>
          <template #body="slotProps">{{ slotProps.data.rankAverage.toFixed(2) }}</template>
        </Column>
        <Column header="1着率" field="firstPlacePercentage" sortable>
          <template #body="slotProps">{{ slotProps.data.firstPlacePercentage.toFixed(0) }}%</template>
        </Column>
        <Column header="2着率" field="secondPlacePercentage" sortable>
          <template #body="slotProps">{{ slotProps.data.secondPlacePercentage.toFixed(0) }}%</template>
        </Column>
        <Column header="3着率" field="thirdPlacePercentage" sortable>
          <template #body="slotProps">{{ slotProps.data.thirdPlacePercentage.toFixed(0) }}%</template>
        </Column>
        <Column header="4着率" field="fourthPlacePercentage" sortable>
          <template #body="slotProps">{{ slotProps.data.fourthPlacePercentage.toFixed(0) }}%</template>
        </Column>
        <Column header="平均素点" field="pointAverage" sortable />
      </template>
    </DataTable>
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Column, DataTable, SelectButton } from 'primevue'
import { fetchPlayers } from '@/entities/player'
import type { IPlayer } from '@/entities/player'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

const aggregationType = ref({ label: '通算', value: 'total' })
const aggregationTypeOptions = ref([
  { label: '通算', value: 'total' },
  { label: '平均', value: 'average' },
])

const playersData = ref<IPlayer[]>([])

onMounted(async () => {
  playersData.value = await fetchPlayers()
})
</script>
