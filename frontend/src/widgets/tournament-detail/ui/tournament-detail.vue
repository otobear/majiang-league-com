<template>
  <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow">
    <template v-if="tournamentData">
      <div class="flex items-baseline justify-between">
        <div class="flex gap-2 text-2xl font-bold">
          <span>{{ tournamentData.info.name }}</span>
          <span>{{ tournamentData.info.subName }}</span>
        </div>
        <div class="flex gap-2">
          <span>{{ tournamentData.info.date }}</span>
          <span>{{ tournamentData.info.location }}</span>
        </div>
      </div>
      <DataTable :value="tournamentData.summary" class="min-w-full text-sm">
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
        <Column>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.roundPoint[0].gamePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right font-bold">{{ slotProps.data.roundPoint[0].tablePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.roundPoint[1].gamePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right font-bold">{{ slotProps.data.roundPoint[1].tablePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.roundPoint[2].gamePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right font-bold">{{ slotProps.data.roundPoint[2].tablePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right">{{ slotProps.data.roundPoint[3].gamePoint }}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <span class="block text-right font-bold">{{ slotProps.data.roundPoint[3].tablePoint }}</span>
          </template>
        </Column>
      </DataTable>
      <div class="mt-8">
        <h2 class="mb-8 text-lg font-semibold">対局詳細</h2>
        <div class="flex flex-wrap justify-between">
          <div v-for="session in tournamentData.sessions" :key="session.info.id" class="mb-6">
            <div class="mb-1 font-semibold">{{ session.info.name }}</div>
            <DataTable :value="session.games" class="min-w-full text-xs">
              <Column header="卓" class="max-w-8">
                <template #body="slotProps">
                  <span class="block text-right">{{ slotProps.index + 1 }}</span>
                </template>
              </Column>
              <Column header="氏名" class="min-w-28">
                <template #body="slotProps">
                  <div v-for="result in slotProps.data.playerResults" :key="result.playerId">
                    <router-link
                      :to="{ name: 'player', params: { id: result.playerId } }"
                      class="text-green-600 underline hover:text-green-800"
                    >
                      {{ result.playerName }}
                    </router-link>
                  </div>
                  <span class="block">供託</span>
                </template>
              </Column>
              <Column header="素点 / 順位点" class="min-w-18">
                <template #body="slotProps">
                  <div v-for="result in slotProps.data.playerResults" :key="result.playerId">
                    <span class="block text-right">{{ result.gamePoint }} / {{ result.tablePoint }}</span>
                  </div>
                  <span class="block text-right">{{ slotProps.data.forfeitGamePoint }} / 0</span>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Column, ColumnGroup, DataTable, Row } from 'primevue'
import { fetchTournamentById } from '@/entities/tournament'
import type { ITournament } from '@/entities/tournament'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

const route = useRoute()
const tournamentData = ref<ITournament>()

onMounted(async () => {
  tournamentData.value = await fetchTournamentById(route.params.id as string)
})
</script>
