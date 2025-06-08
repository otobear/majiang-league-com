<template>
  <div class="flex flex-1 gap-2 rounded-lg bg-white p-4 shadow">
    <div class="w-8">
      <slot name="icon" />
    </div>
    <div class="flex flex-1 flex-col gap-1">
      <p class="text-gray-500">
        <slot name="label" />
      </p>
      <p class="flex items-baseline gap-1">
        <span class="text-xl font-semibold text-gray-800">
          <slot name="value" />
        </span>
        <span class="text-sm font-semibold text-gray-800">
          <slot name="unit" />
        </span>
      </p>
    </div>
  </div>
</template>
