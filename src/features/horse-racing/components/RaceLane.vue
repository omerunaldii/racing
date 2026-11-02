<script setup lang="ts">
import { computed } from 'vue'
import HorseIcon from '@/features/horse-racing/assets/horse.svg?component'
import type { IHorse } from '@/features/horse-racing/types/horse'

const props = defineProps<{
  horse: IHorse
  index: number
  /** Milliseconds the horse needs to cross the track; `null` while it waits at the start. */
  duration: number | null
  running: boolean
}>()

defineEmits<{
  finish: []
}>()

const runStyle = computed(() =>
  props.duration === null
    ? undefined
    : {
        animationDuration: `${props.duration}ms`,
        animationPlayState: props.running ? 'running' : 'paused',
      },
)
</script>

<template>
  <div class="relative h-11 overflow-hidden" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
    <span class="absolute inset-y-0 left-0 w-px bg-gray-300" />

    <span class="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs font-medium text-gray-500">
      {{ index + 1 }}
    </span>

    <!-- Travel area: translateX(100%) of this box moves the horse from start to finish. -->
    <div
      data-testid="lane-runner"
      class="absolute inset-y-0 left-10 right-4 flex items-center"
      :class="{ running: duration !== null }"
      :style="runStyle"
      @animationend.self="$emit('finish')"
    >
      <HorseIcon
        class="h-7 w-auto shrink-0"
        :style="{ color: horse.color }"
        role="img"
        :aria-label="horse.name"
      />
    </div>

    <span class="absolute inset-y-0 right-0 w-1 bg-gray-800" />
  </div>
</template>

<style scoped>
.running {
  animation-name: run;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes run {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
