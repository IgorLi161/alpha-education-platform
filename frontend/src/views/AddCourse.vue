<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Заголовок -->
      <h2 class="text-3xl font-semibold mb-6">Добавить курс</h2>

      <!-- Форма -->
      <el-form ref="formRef" label-width="0" class="space-y-6">
        <el-input
          v-model="courseName"
          placeholder="Название"
          clearable
          size="large"
          class="w-full bg-purple-50 placeholder-purple-300 text-lg rounded-lg border border-purple-200"
        />
        <div class="flex justify-end">
          <el-button type="primary" size="large" @click="submitCourse">
            Создать
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- УСПЕШНО -->
    <el-dialog
      v-model="showSuccess"
      width="320px"
      show-close="false"
      center
      custom-class="success-dialog"
    >
      <div class="text-center p-6">
        <el-icon class="text-green-500 mb-2">
          <SuccessFilled />
        </el-icon>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-600 mb-6">Курс успешно создан</p>
        <el-button type="primary" @click="onContinue">Далее</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/store/courseStore'
import { SuccessFilled } from '@element-plus/icons-vue'

const router     = useRouter()
const store      = useCourseStore()
const courseName = ref('')
const showSuccess= ref(false)
const formRef    = ref()

async function submitCourse() {
  const trimmed = courseName.value.trim()
  if (!trimmed) return
  console.log('Создать курс:', trimmed)        // <— click feedback
  await store.createCourse({ name: trimmed })
  showSuccess.value = true
}

function onContinue() {
  showSuccess.value = false
  router.push({ name: 'Flows' })
}
</script>

<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>
