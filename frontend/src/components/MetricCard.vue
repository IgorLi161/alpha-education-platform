<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-2xl mt-2">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; value: number }>()
</script>