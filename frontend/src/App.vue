<template>
  <!-- Wrap every page in your Layout (header + sidebar) -->
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
</script>
