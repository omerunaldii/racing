<script setup lang="ts">
defineProps<{
  name: string
  color: string
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="size-3 shrink-0" :style="{ backgroundColor: color }" />
    <span class="text-gray-700">{{ name }}</span>
  </div>
</template>
