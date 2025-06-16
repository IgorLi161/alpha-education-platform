```vue
<template>
  <div class="space-y-8 p-16">
    <!-- HERO BANNER -->
    <div class="bg-[#E0DEFB] rounded-2xl p-24 text-center">
      <h1 class="text-3xl font-semibold text-gray-800 mb-2">
        IT-Академия, которая готовит будущих лидеров цифровой эпохи.
      </h1>
      <p class="text-gray-600">
        Путь к успешной карьере в IT — от веб-разработки до дизайна и анализа данных.
      </p>
    </div>

    <!-- STATS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-2xl p-6 text-center shadow">
        <p class="text-5xl font-bold text-indigo-500">73%</p>
        <p class="mt-3 text-gray-600">
          выпускников трудоустраиваются по специальности вскоре после окончания обучения.
        </p>
      </div>

      <!-- Card 2 (highlight) -->
      <div class="bg-[#E0DEFB] rounded-2xl p-6 text-center shadow">
        <p class="text-5xl font-bold text-indigo-600">6+ лет</p>
        <p class="mt-3 text-gray-700">
          преподаём в разных IT направлениях
        </p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-2xl p-6 text-center shadow">
        <p class="text-5xl font-bold text-indigo-500">3000+</p>
        <p class="mt-3 text-gray-600">
          студентов, прошедших наши курсы по B2B и B2C направлениям
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MetricCard from '@/components/MetricCard.vue'
</script>

<style scoped>
/* Scoped styles if needed */
</style>
```
