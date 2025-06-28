<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-baseline justify-between">
      <div class="flex gap-2 text-2xl font-bold">
        <span>{{ tournament.info.name }}</span>
        <span>{{ tournament.info.subName }}</span>
      </div>
      <div class="flex gap-2">
        <span>{{ tournament.info.date }}</span>
        <span>{{ tournament.info.location }}</span>
      </div>
    </div>

    <DataTable :value="tournament.summary" show-gridlines row-hover class="min-w-full text-sm">
      <ColumnGroup type="header">
        <Row>
          <Column header="順位" :rowspan="2" />
          <Column header="氏名" :rowspan="2" />
          <Column header="合計" :colspan="2" class="bg-green-200" />
          <Column header="1回戦" :colspan="2" />
          <Column header="2回戦" :colspan="2" />
          <Column header="3回戦" :colspan="2" />
          <Column header="4回戦" :colspan="2" />
        </Row>
        <Row>
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
        </Row>
      </ColumnGroup>
      <Column field="tournamentPlace" body-style="text-align: right" />
      <Column field="playerName">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'player', params: { id: slotProps.data.playerId } }"
            class="text-green-600 underline hover:text-green-800"
          >
            {{ slotProps.data.playerName }}
          </router-link>
        </template>
      </Column>
      <Column field="totalPoint.gamePoint" body-style="text-align: right" body-class="bg-green-200" />
      <Column field="totalPoint.tablePoint" body-style="text-align: right" body-class="bg-green-200 font-bold" />
      <template v-for="roundIndex in 4" :key="roundIndex">
        <Column>
          <template #body="slotProps">
            <span class="block text-right">
              {{ slotProps.data.roundPoint[roundIndex - 1].gamePoint }}
            </span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right font-bold">
              {{ slotProps.data.roundPoint[roundIndex - 1].tablePoint }}
            </span>
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { Column, ColumnGroup, DataTable, Row } from 'primevue'
import type { ITournament } from '@/entities/tournament/model'

interface Props {
  tournament: ITournament
}

defineProps<Props>()
</script>
