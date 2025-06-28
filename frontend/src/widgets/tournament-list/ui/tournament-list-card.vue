<template>
  <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow">
    <TournamentSummaryTable :tournament="tournament" />
    <RouterLink
      :to="{ name: 'tournament', params: { id: tournament.id } }"
      class="flex flex-row-reverse gap-1 text-green-600 hover:text-green-800"
    >
      <i class="material-symbols-outlined">arrow_forward</i>
      <span>詳細を見る</span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import type { ITournament } from '@/entities/tournament/model'
import { TournamentSummaryTable } from '@/shared/ui/tournament-summary-table'

defineProps<{
  tournament: ITournament
}>()
</script>
