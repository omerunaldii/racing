<script setup lang="ts">
import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import RaceLane from './RaceLane.vue'
import RoundHeader from './RoundHeader.vue'

defineProps<{
  round: IRaceRound | null
  racers: Array<IHorse>
  /** Milliseconds per horse id for the race being run. */
  durations: Record<string, number>
  running: boolean
}>()

defineEmits<{
  finish: [horseId: string]
}>()
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-base font-semibold text-gray-900">Race Track</h2>

    <div v-if="!round" class="px-4 py-10 text-center text-sm text-gray-500">
      Generate a race program to see the track.
    </div>

    <div v-else class="overflow-hidden border border-gray-200">
      <RoundHeader :round="round" />

      <div class="p-4">
        <div class="mb-2 flex justify-between text-xs font-medium uppercase text-gray-500">
          <span>Start</span>
          <span>Finish</span>
        </div>

        <!-- Keyed by round so every round starts with fresh lanes and fresh animations. -->
        <div :key="round.id" class="divide-y divide-gray-100 border border-gray-200">
          <RaceLane
            v-for="(horse, index) in racers"
            :key="horse.id"
            :horse="horse"
            :index="index"
            :duration="durations[horse.id] ?? null"
            :running="running"
            @finish="$emit('finish', horse.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
