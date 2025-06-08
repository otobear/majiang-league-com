<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-green-700 text-white flex items-center px-6 h-16 shadow">
      <img src="@/shared/assets/logo.png" alt="Logo" class="h-9 mr-4" />
      <h1 class="text-2xl font-bold flex-1">ちゅんま関東リーグ</h1>
      <nav class="space-x-6">
        <router-link
          to="/"
          class="pb-1 transition-colors border-b-2 border-transparent hover:border-yellow-200 hover:text-yellow-200"
          >総合成績</router-link
        >
        <router-link
          to="/players"
          class="pb-1 transition-colors border-b-2 border-transparent hover:border-yellow-200 hover:text-yellow-200"
          >選手一覧</router-link
        >
        <router-link
          to="/results"
          class="pb-1 transition-colors border-b-2 border-transparent hover:border-yellow-200 hover:text-yellow-200"
          >対局結果</router-link
        >
      </nav>
    </header>
    <div class="flex flex-1 bg-gray-50">
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
