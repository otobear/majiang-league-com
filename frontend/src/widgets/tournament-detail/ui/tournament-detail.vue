<template>
  <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow">
    <template v-if="tournamentData">
      <TournamentSummaryTable :tournament="tournamentData" />
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
                    <RouterLink
                      :to="{ name: 'player', params: { id: result.playerId } }"
                      class="text-green-600 underline hover:text-green-800"
                    >
                      {{ result.playerName }}
                    </RouterLink>
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
import { Column, DataTable } from 'primevue'
import { fetchTournamentById } from '@/entities/tournament'
import type { ITournament } from '@/entities/tournament'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { TournamentSummaryTable } from '@/shared/ui/tournament-summary-table'

const route = useRoute()
const tournamentData = ref<ITournament>()

onMounted(async () => {
  tournamentData.value = await fetchTournamentById(route.params.id as string)
})
</script>
