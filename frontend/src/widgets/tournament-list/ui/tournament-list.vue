<template>
  <div v-if="tournamentsData && tournamentsData.length" :value="tournamentsData" class="flex flex-col gap-4">
    <ListCard v-for="tournament in tournamentsData" :key="tournament.id" :tournament="tournament" />
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchTournaments } from '@/entities/tournament'
import type { ITournament } from '@/entities/tournament'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import ListCard from './tournament-list-card.vue'

const tournamentsData = ref<ITournament[]>([])

onMounted(async () => {
  tournamentsData.value = await fetchTournaments()
})
</script>
