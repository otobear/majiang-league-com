<template>
  <div v-if="loading" class="flex justify-center py-8">
    <LoadingSpinner />
  </div>
  <div v-else-if="tournamentsData && tournamentsData.length" class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <TournamentListCard v-for="tournament in paginatedTournaments" :key="tournament.id" :tournament="tournament" />
    </div>
    <div class="flex justify-center">
      <Paginator
        v-model:first="defaultPage"
        :rows="rowsPerPage"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="onPageChange"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="{first} から {last} / 全 {totalRecords} 件"
      />
    </div>
  </div>
  <div v-else class="flex justify-center py-8">
    <p class="text-gray-500">大会データがありません</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Paginator } from 'primevue'
import { fetchTournaments } from '@/entities/tournament'
import type { ITournament } from '@/entities/tournament'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import TournamentListCard from './tournament-list-card.vue'

const tournamentsData = ref<ITournament[]>([])
const loading = ref(true)

const defaultPage = ref(0)
const rowsPerPage = ref(5)

const totalRecords = computed(() => tournamentsData.value.length)

const paginatedTournaments = computed(() => {
  const start = defaultPage.value
  const end = start + rowsPerPage.value
  return tournamentsData.value.slice(start, end)
})

const onPageChange = (event: any) => {
  defaultPage.value = event.first
  rowsPerPage.value = event.rows
}

onMounted(async () => {
  try {
    loading.value = true
    tournamentsData.value = await fetchTournaments()
  } catch (error) {
    console.error('Failed to fetch tournaments:', error)
  } finally {
    loading.value = false
  }
})
</script>
