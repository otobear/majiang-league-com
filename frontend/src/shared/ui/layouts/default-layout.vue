<template>
  <div>
    <div class="fixed top-0 right-0 left-0 z-50">
      <TheHeader />
    </div>
    <div class="h-screen overflow-y-auto bg-gray-100 pt-16">
      <div class="flex justify-center p-8">
        <main class="w-5xl xl:w-6xl">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TheHeader } from '@/shared/ui/the-header'
</script>
