<template>
  <component :is="layout">
    <template #default>
      <RouterView />
    </template>
  </component>

</template>

<script setup lang="ts">
import { DefaultLayout } from '@/shared/ui/layouts'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || DefaultLayout
})
</script>
