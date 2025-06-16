<!-- src/views/FlowDetail.vue -->
<template>
  <div class="p-6">
    <h2>Детали потока (ID: {{ flowId }})</h2>
    <p>Здесь будет контент FlowDetail.</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const flowId = Number(route.params.flowId)
</script>
