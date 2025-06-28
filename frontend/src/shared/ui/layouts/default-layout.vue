<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <div class="flex flex-1 justify-center bg-gray-100 p-8">
      <main class="w-5xl xl:w-6xl">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TheHeader } from '@/shared/ui/the-header'
</script>
