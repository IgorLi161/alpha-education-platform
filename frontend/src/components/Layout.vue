<!-- src/components/Layout.vue -->
<template>
  <el-container style="height: 100vh">
    <!-- SIDEBAR -->
    <el-aside
      width="100px"
      class="bg-gray-900 text-white flex flex-col items-center py-8 space-y-6"
    >
      <!-- Company Logo -->
      <el-button
        type="text"
        class="p-2 w-16 h-16 flex items-center justify-center rounded transition-colors duration-200 ease-in-out"
        @click="onLogoClick"
      >
        <!-- Now scaled to 2rem×2rem inside a 3rem×3rem box -->
        <img :src="logoCompany" alt="Company Logo" class="w-16 h-16" />
      </el-button>

      <!-- Students Icon -->
      <el-button
        type="text"
        class="p-2 w-12 h-12 flex items-center justify-center rounded transition-colors duration-200 ease-in-out hover:bg-[#6252FE]"
        :class="{ 'bg-[#6252FE]': isActive('/students') }"
        @click="navigate('/students')"
      >
        <img :src="logoPerson" alt="Students" class="w-8 h-8" />
      </el-button>

      <!-- Flows Icon -->
      <el-button
        type="text"
        class="p-2 w-12 h-12 flex items-center justify-center rounded transition-colors duration-200 ease-in-out hover:bg-[#6252FE]"
        :class="{ 'bg-[#6252FE]': isActive('/flows') }"
        @click="navigate('/flows')"
      >
        <img :src="logoGroup" alt="Flows" class="w-8 h-8" />
      </el-button>

      <!-- Finance Icon -->
      <el-button
        type="text"
        class="p-2 w-12 h-12 flex items-center justify-center rounded transition-colors duration-200 ease-in-out hover:bg-[#6252FE]"
        :class="{ 'bg-[#6252FE]': isActive('/finance') }"
        @click="navigate('/finance')"
      >
        <img :src="logoMonitor" alt="Finance" class="w-8 h-8" />
      </el-button>
    </el-aside>

    <!-- MAIN AREA -->
    <el-container>
      <!-- HEADER -->
      <el-header class="bg-white shadow flex items-center h-16 px-6 justify-end">
        <div class="flex items-center space-x-4">
          <el-button :icon="Menu" circle />
          <el-badge :value="3" class="inline-block">
            <el-button :icon="Bell" circle />
          </el-badge>
          <el-dropdown trigger="click">
            <span class="cursor-pointer flex items-center space-x-1"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>Профиль</el-dropdown-item>
              <el-dropdown-item>Выйти</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="bg-gray-100 p-6 overflow-auto">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Menu, Bell } from '@element-plus/icons-vue'

import logoCompany from '@/assets/logos/company-logo.svg'
import logoPerson  from '@/assets/logos/person.png'
import logoGroup   from '@/assets/logos/group.png'
import logoMonitor from '@/assets/logos/monitor.png'

const router = useRouter()
const route  = useRoute()

function navigate(path: string) {
  router.push(path)
}

function onLogoClick() {
  router.push('/')
}

function isActive(path: string) {
  return route.path === path
}
</script>

<style scoped>
/* no extra CSS needed; we handled alignment with Tailwind classes above */
</style>
