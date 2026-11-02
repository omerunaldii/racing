<script setup lang="ts">
import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import RaceRoundCard from './RaceRoundCard.vue'

defineProps<{
  rounds: Array<IRaceRound>
  horsesById: ReadonlyMap<string, IHorse>
}>()
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-base font-semibold text-gray-900">Races</h2>

    <div v-if="rounds.length === 0" class="px-4 py-10 text-center text-sm text-gray-500">
      Generate a program to see the race schedule.
    </div>

    <div v-else class="max-h-[calc(100vh-17rem)] overflow-y-auto">
      <RaceRoundCard
        v-for="round in rounds"
        :key="round.id"
        :round="round"
        :horses-by-id="horsesById"
      />
    </div>
  </section>
</template>
