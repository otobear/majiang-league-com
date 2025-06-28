<template>
  <header class="flex h-16 items-center bg-green-600 px-6 text-white shadow">
    <RouterLink to="/" class="inline-flex h-16 flex-1 items-center gap-4">
      <img alt="Logo" src="@/shared/assets/logo.png" class="h-8 w-8" />
      <h1 class="text-2xl font-bold">ちゅんま関東リーグ</h1>
    </RouterLink>
    <nav class="space-x-6">
      <RouterLink
        to="/players"
        class="border-b-2 border-transparent pb-1 transition-colors hover:border-yellow-200 hover:text-yellow-200"
        >総合成績</RouterLink
      >
      <RouterLink
        to="/tournaments"
        class="border-b-2 border-transparent pb-1 transition-colors hover:border-yellow-200 hover:text-yellow-200"
        >対局結果</RouterLink
      >
    </nav>
  </header>
</template>
