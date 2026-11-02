<script setup lang="ts">
defineProps<{
  canToggle: boolean
}>()

defineEmits<{
  generate: []
  toggle: []
}>()
</script>

<template>
  <header class="flex items-center justify-between py-2 border-b border-gray-200">
    <h1 class="text-2xl font-bold tracking-tight text-gray-900">Horse Racing</h1>

    <div class="flex items-center gap-3">
      <button
        data-testid="generate-program-button"
        class="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
        @click="$emit('generate')"
      >
        Generate Program
      </button>

      <button
        data-testid="start-button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        :disabled="!canToggle"
        @click="$emit('toggle')"
      >
        Start / Paused
      </button>
    </div>
  </header>
</template>
