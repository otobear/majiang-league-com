<template>
  <div v-if="playersData && playersData.length" class="flex flex-col gap-4 rounded-lg bg-white p-8 shadow">
    <SelectButton
      v-model="aggregationType"
      :options="aggregationTypeOptions"
      option-label="label"
      data-key="label"
      :allow-empty="false"
    />
    <DataTable :value="playersData" sortField="rpTotal" :sortOrder="-1">
      <Column header="着順">
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>
      <Column header="選手名" field="name">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'player', params: { id: slotProps.data.id } }"
            class="text-green-600 underline hover:text-green-800"
          >
            {{ slotProps.data.name }}
          </router-link>
        </template>
      </Column>
      <template v-if="aggregationType.value === 'total'">
        <Column header="総合着順" field="rpTotal" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.rpTotal }}</span>
          </template>
        </Column>
        <Column header="1着数" field="firstPlaceCount" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.firstPlaceCount }}</span>
          </template>
        </Column>
        <Column header="2着数" field="secondPlaceCount" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.secondPlaceCount }}</span>
          </template>
        </Column>
        <Column header="3着数" field="thirdPlaceCount" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.thirdPlaceCount }}</span>
          </template>
        </Column>
        <Column header="4着数" field="fourthPlaceCount" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.fourthPlaceCount }}</span>
          </template>
        </Column>
        <Column header="通算素点" field="gpTotal" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.gpTotal }}</span>
          </template>
        </Column>
      </template>
      <template v-else>
        <Column header="平均着順" field="tpAvg" sortable>
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
        <Column header="平均素点" field="gpAvg" sortable>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.gpAvg }}</span>
          </template>
        </Column>
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
