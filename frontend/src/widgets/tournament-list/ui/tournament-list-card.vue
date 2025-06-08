<template>
  <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow">
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
    <DataTable :value="tournament.summary" class="min-w-full text-sm">
      <ColumnGroup type="header">
        <Row>
          <Column header="順位" :rowspan="2" />
          <Column header="氏名" :rowspan="2" />
          <Column header="合計" :colspan="2" />
          <Column header="1回戦" :colspan="2" />
          <Column header="2回戦" :colspan="2" />
          <Column header="3回戦" :colspan="2" />
          <Column header="4回戦" :colspan="2" />
        </Row>
        <Row>
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
          <Column header="順位点" />
          <Column header="素点" />
        </Row>
      </ColumnGroup>
      <Column field="tournamentRank" :body-class="'text-right'" />
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
      <Column field="totalPoint.tablePoint" style="text-align: right" />
      <Column field="totalPoint.gamePoint" style="text-align: right" />
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[0].tablePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[0].gamePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[1].tablePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[1].gamePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[2].tablePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[2].gamePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[3].tablePoint }}</span>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <span class="block text-right">{{ slotProps.data.roundPoint[3].gamePoint }}</span>
        </template>
      </Column>
    </DataTable>
    <router-link
      :to="{ name: 'tournament', params: { id: tournament.id } }"
      class="flex flex-row-reverse gap-1 text-green-600 hover:text-green-800"
    >
      <i class="material-symbols-outlined">arrow_forward</i>
      <span>詳細を見る</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { Column, ColumnGroup, DataTable, Row } from 'primevue'
import type { ITournament } from '@/entities/tournament/model'

defineProps<{
  tournament: ITournament
}>()
</script>
