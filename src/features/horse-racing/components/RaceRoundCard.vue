<script setup lang="ts">
import { computed } from 'vue'
import type { IHorse } from '@/features/horse-racing/types/horse'
import type { IRaceRound } from '@/features/horse-racing/types/race'
import HorseLabel from './HorseLabel.vue'
import RoundHeader from './RoundHeader.vue'

const UNKNOWN_COLOR = '#9ca3af'

const props = defineProps<{
  round: IRaceRound
  horsesById: ReadonlyMap<string, IHorse>
}>()

function toRow(horseId: string, position: number) {
  const horse = props.horsesById.get(horseId)

  return {
    horseId,
    position,
    name: horse?.name ?? horseId,
    color: horse?.color ?? UNKNOWN_COLOR,
  }
}

const participants = computed(() =>
  props.round.horseIds.map((horseId, index) => toRow(horseId, index + 1)),
)

const results = computed(() =>
  props.round.results.map(({ horseId, position }) => toRow(horseId, position)),
)
</script>

<template>
  <article class="overflow-hidden border border-gray-200">
    <RoundHeader :round="round" />

    <div class="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0">
      <div class="p-4">
        <h4 class="mb-3 text-sm font-semibold text-gray-700">Participants</h4>

        <table class="w-full text-left text-sm" data-testid="participants-table">
          <thead>
            <tr class="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th class="w-10 py-2 font-medium">#</th>
              <th class="py-2 font-medium">Horse</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in participants" :key="row.horseId">
              <td class="py-2 text-gray-500">{{ row.position }}</td>
              <td class="py-2"><HorseLabel :name="row.name" :color="row.color" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4">
        <h4 class="mb-3 text-sm font-semibold text-gray-700">Results</h4>

        <table class="w-full text-left text-sm" data-testid="result-table">
          <thead>
            <tr class="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th class="w-16 py-2 font-medium">#</th>
              <th class="py-2 font-medium">Horse</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-if="results.length === 0">
              <td colspan="2" class="py-2 text-center text-gray-400">
                {{ round.status === 'running' ? 'Race in progress...' : 'Waiting for race' }}
              </td>
            </tr>

            <tr v-for="row in results" :key="row.horseId">
              <td class="py-2 text-gray-500">{{ row.position }}</td>
              <td class="py-2"><HorseLabel :name="row.name" :color="row.color" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </article>
</template>
