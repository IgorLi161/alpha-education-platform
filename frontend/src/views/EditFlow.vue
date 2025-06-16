<!-- src/views/EditFlow.vue -->
<template>
  <div class="flex items-center justify-center h-full bg-gray-100 p-6">
    <el-card class="w-full max-w-xl px-6 py-8 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-6">Редактировать поток</h2>

      <el-form
        :model="form"
        ref="formRef"
        label-width="0"
        class="space-y-6"
      >
        <!-- 1) Название потока -->
        <el-input
          v-model="form.name"
          placeholder="Название потока"
          clearable
          size="large"
          class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
        />

        <!-- 2) Ментор -->
        <el-input
          v-model="form.mentor"
          placeholder="Ментор"
          clearable
          size="large"
          class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
        />

        <!-- 3) Даты -->
        <div class="grid grid-cols-2 gap-4">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="Дата начала"
            size="large"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
          />
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="Дата окончания"
            size="large"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
          />
        </div>

        <!-- 4) Кнопка “Сохранить” -->
        <div class="flex justify-end mt-4">
          <el-button type="primary" size="large" @click="saveFlow">
            Сохранить
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- Диалог “Поток успешно сохранён” -->
    <el-dialog
      v-model="showFlowEdited"
      width="320px"
      show-close="false"
      center
      custom-class="success-dialog"
    >
      <div class="text-center p-6">
        <el-icon class="text-green-500 text-4xl mb-2">
          <SuccessFilled class="w-8 h-8" />
        </el-icon>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-600 mb-6">Поток успешно сохранён</p>
        <el-button type="primary" size="small" @click="onEditedContinue">
          Далее
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFlowStore, Flow } from '@/store/flowStore'
import { SuccessFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route  = useRoute()
const flowStore = useFlowStore()

// Из route.params получим flowId
const flowId = Number(route.params.flowId)

// Состояние формы:
const formRef = ref()
const form = ref<Partial<Flow>>({
  name:      '',
  mentor:    '',
  startDate: undefined,
  endDate:   undefined,
  courseId:  undefined,
})

const showFlowEdited = ref(false)

onMounted(async () => {
  // Если у нас нет списка потоков, загрузим
  if (!flowStore.list.length) {
    await flowStore.fetchFlows()
  }
  // Найдём текущий поток по ID
  const f = flowStore.list.find((x) => x.id === flowId)
  if (f) {
    form.value = {
      name:      f.name,
      mentor:    f.mentor,
      startDate: f.startDate ?? undefined,
      endDate:   f.endDate ?? undefined,
      courseId:  f.courseId,
    }
  }
})

// Сохранить изменения
async function saveFlow() {
  if (!form.value.name || !form.value.courseId) return

  await flowStore.updateFlow(flowId, {
    name:      form.value.name,
    mentor:    form.value.mentor ?? '',
    startDate: form.value.startDate ?? '',
    endDate:   form.value.endDate   ?? '',
  })
  showFlowEdited.value = true
}

function onEditedContinue() {
  showFlowEdited.value = false
  // Вернуться к списку потоков для данного курса
  router.push({
    name: 'Flows',
    query: { courseId: String(form.value.courseId) },
  })
}
</script>

<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>
