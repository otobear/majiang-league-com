<template>
  <div>
    <h1 class="mb-4 flex flex-1 text-2xl font-bold">対局結果</h1>
    <TournamentList class="w-full" />
  </div>
</template>

<script setup lang="ts">
import { TournamentList } from '@/widgets/tournament-list'
</script>
