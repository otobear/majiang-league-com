<template>
  <div v-if="playersData && playersData.length" class="flex flex-col gap-4 rounded-lg bg-white p-8 shadow">
    <SelectButton
      v-model="aggregationType"
      :options="aggregationTypeOptions"
      option-label="label"
      data-key="label"
      :allow-empty="false"
    />
    <DataTable :value="playersData" sortField="rpTotal" :sortOrder="-1" row-hover>
      <Column header="順位">
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>
      <Column header="選手名" field="name">
        <template #body="slotProps">
          <RouterLink
            :to="{ name: 'player', params: { id: slotProps.data.id } }"
            class="text-green-600 underline hover:text-green-800"
          >
            {{ slotProps.data.name }}
          </RouterLink>
        </template>
      </Column>
      <Column header="対局数" field="gameCount" sortable body-style="text-align: right" />
      <template v-if="aggregationType.value === 'total'">
        <Column header="通算評価" field="rpTotal" sortable body-style="text-align: right" />
        <Column header="1着数" field="firstPlaceCount" sortable body-style="text-align: right" />
        <Column header="2着数" field="secondPlaceCount" sortable body-style="text-align: right" />
        <Column header="3着数" field="thirdPlaceCount" sortable body-style="text-align: right" />
        <Column header="4着数" field="fourthPlaceCount" sortable body-style="text-align: right" />
        <Column header="通算素点" field="gpTotal" sortable body-style="text-align: right" />
      </template>
      <template v-else>
        <Column header="平均順位" field="tpAvg" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ (5 - slotProps.data.tpAvg).toFixed(2) }}</span>
          </template>
        </Column>
        <Column header="1着率" field="firstPlacePercentage" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.firstPlacePercentage.toFixed(0) }}%</span>
          </template>
        </Column>
        <Column header="2着率" field="secondPlacePercentage" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.secondPlacePercentage.toFixed(0) }}%</span>
          </template>
        </Column>
        <Column header="3着率" field="thirdPlacePercentage" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.thirdPlacePercentage.toFixed(0) }}%</span>
          </template>
        </Column>
        <Column header="4着率" field="fourthPlacePercentage" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.fourthPlacePercentage.toFixed(0) }}%</span>
          </template>
        </Column>
        <Column header="平均素点" field="gpAvg" sortable body-style="text-align: right" />
      </template>
    </DataTable>
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Column, DataTable, SelectButton } from 'primevue'
import { fetchPlayerStatsList } from '@/entities/player'
import type { IPlayer } from '@/entities/player'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

const aggregationType = ref({ label: '通算', value: 'total' })
const aggregationTypeOptions = ref([
  { label: '通算', value: 'total' },
  { label: '平均', value: 'average' },
])

const playersData = ref<IPlayer[]>([])

onMounted(async () => {
  playersData.value = await fetchPlayerStatsList()
})
</script>
