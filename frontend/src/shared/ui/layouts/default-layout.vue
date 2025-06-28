<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex h-16 items-center bg-green-600 px-6 text-white shadow">
      <img src="@/shared/assets/logo.png" alt="Logo" class="mr-4 h-9" />
      <h1 class="flex-1 text-2xl font-bold">ちゅんま関東リーグ</h1>
      <nav class="space-x-6">
        <RouterLink
          to="/"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-yellow-200 hover:text-yellow-200"
          >総合成績</RouterLink
        >
        <RouterLink
          to="/players"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-yellow-200 hover:text-yellow-200"
          >選手一覧</RouterLink
        >
        <RouterLink
          to="/tournaments"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-yellow-200 hover:text-yellow-200"
          >対局結果</RouterLink
        >
      </nav>
    </header>
    <div class="flex flex-1 justify-center bg-gray-100 p-8">
      <main class="w-5xl xl:w-6xl">
        <slot />
      </main>
    </div>
  </div>
</template>
