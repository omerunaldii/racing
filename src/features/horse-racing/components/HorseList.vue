<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHorseRacingStore } from '@/features/horse-racing/stores/horse_racing_store'

const store = useHorseRacingStore()
const { horses } = storeToRefs(store)
</script>

<template>
  <section>
    <div class="py-2">
      <h2 class="text-base font-semibold text-gray-900">Horses</h2>
    </div>

    <div class="border border-gray-200 overflow-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 text-sm uppercase text-gray-500">
          <tr>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">Condition</th>
            <th class="px-4 py-3 font-medium">Color</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr v-if="horses.length === 0">
            <td colspan="3" class="px-4 py-8 text-center text-gray-500">
              No horses generated yet.
            </td>
          </tr>

          <tr v-for="horse in horses" :key="horse.id" class="transition hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">{{ horse.name }}</td>
            <td class="px-4 py-3 text-center font-medium text-gray-900">{{ horse.condition }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center">
                <span class="size-4" :style="{ backgroundColor: horse.color }" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
