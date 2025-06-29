<template>
  <header class="flex h-16 items-center gap-4 bg-green-600 px-6 text-white shadow">
    <RouterLink to="/" class="inline-flex h-16 items-center gap-4">
      <img alt="Logo" src="@/shared/assets/logo.png" class="h-8 w-8" />
    </RouterLink>
    <h1 class="flex-1 text-2xl font-bold">ちゅんま関東リーグ</h1>
    <nav>
      <Tabs :value="activeTab" unstyled class="bg-green-600">
        <TabList>
          <Tab value="players" class="h-16">
            <RouterLink
              to="/players"
              class="pb-1 hover:border-yellow-200 hover:text-yellow-200"
              :class="{ 'border-yellow-200 text-yellow-200': activeTab === 'players' }"
            >
              総合成績
            </RouterLink>
          </Tab>
          <Tab value="tournaments" class="ml-4 h-16">
            <RouterLink
              to="/tournaments"
              class="px-4 hover:border-yellow-200 hover:text-yellow-200"
              :class="{ '!border-yellow-200 !text-yellow-200': activeTab === 'tournaments' }"
            >
              対局結果
            </RouterLink>
          </Tab>
          <Tab v-if="isDevelopment" value="score-entry" class="ml-4 h-16">
            <RouterLink
              to="/score-entry"
              class="px-4 hover:border-yellow-200 hover:text-yellow-200"
              :class="{ '!border-yellow-200 !text-yellow-200': activeTab === 'score-entry' }"
            >
              成績入力
            </RouterLink>
          </Tab>
        </TabList>
      </Tabs>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Tab, TabList, Tabs } from 'primevue'

const route = useRoute()

const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV
})

const activeTab = computed(() => {
  const path = route.path
  if (path.startsWith('/players')) {
    return 'players'
  } else if (path.startsWith('/tournaments')) {
    return 'tournaments'
  } else if (path.startsWith('/score-entry')) {
    return 'score-entry'
  }
  return 'players'
})
</script>
