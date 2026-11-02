<script setup lang="ts">
import type { IRaceRound } from '@/features/horse-racing/types/race'

defineProps<{
  round: IRaceRound
}>()
</script>

<template>
  <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
    <div class="flex items-center gap-3">
      <h3 class="font-semibold text-gray-900">Round {{ round.id }}</h3>
      <span class="text-sm text-gray-500">{{ round.distance }}m</span>
    </div>

    <span data-testid="round-status" class="px-3 py-1 text-xs font-medium capitalize text-gray-700">
      {{ round.status }}
    </span>
  </div>
</template>
