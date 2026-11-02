<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useHorseRacingStore } from '@/features/horse-racing/stores/horse_racing_store'
import HorseRacingHeader from './HorseRacingHeader.vue'
import HorseList from './HorseList.vue'
import RaceSchedule from './RaceSchedule.vue'
import RaceTrack from './RaceTrack.vue'

const PLAYBACK_SPEED = 10

const store = useHorseRacingStore()
const { horses, rounds, status, horsesById, canToggle, trackRound, trackRacers, currentResults } =
  storeToRefs(store)

const durations = computed(() =>
  Object.fromEntries(
    currentResults.value.map(({ horseId, finishTime }) => [
      horseId,
      (finishTime * 1000) / PLAYBACK_SPEED,
    ]),
  ),
)
</script>

<template>
  <main class="mx-auto max-w-[100rem] px-4 text-gray-900">
    <HorseRacingHeader :can-toggle="canToggle" @generate="store.generate" @toggle="store.toggle" />

    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <HorseList :horses="horses" />

      <div class="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <RaceTrack
          :round="trackRound"
          :racers="trackRacers"
          :durations="durations"
          :running="status === 'running'"
          @finish="store.horseFinished"
        />
        <RaceSchedule :rounds="rounds" :horses-by-id="horsesById" />
      </div>
    </div>
  </main>
</template>
