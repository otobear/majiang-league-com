<template>
  <div class="flex items-center justify-center py-8">
    <svg class="h-8 w-8 animate-spin text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <circle
        class="opacity-75"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        stroke-dasharray="60"
        stroke-dashoffset="45"
        fill="none"
      />
    </svg>
    <span class="ml-3 text-lg text-green-700">読み込み中...</span>
  </div>
</template>
