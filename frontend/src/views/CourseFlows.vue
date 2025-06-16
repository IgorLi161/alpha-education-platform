<template>
  <div class="bg-gray-100 min-h-full p-4 sm:p-6 lg:p-8">
    <!-- Заголовок курса -->
    <h1 class="text-2xl sm:text-3xl font-bold mb-6">
      {{ courseName }}
    </h1>

    <!-- ======== РЕЖИМ 1: Нет потоков ======== -->
    <div
      v-if="flowsForCourse.length === 0 && !isEditing"
      class="flex flex-col items-center justify-center mt-12 space-y-4"
    >
      <p class="text-lg text-gray-700 text-center">
        Потоки еще не добавлены<br />
        Нажмите “Добавить поток”, чтобы начать
      </p>
      <el-button
        type="primary"
        size="large"
        @click="onAddFlow"
      >
        Добавить поток
      </el-button>
    </div>

    <!-- ======== РЕЖИМ 2: Есть потоки (не в режиме редактирования) ======== -->
    <div v-else-if="flowsForCourse.length > 0 && !isEditing" class="space-y-3">
      <!-- Список потоков -->
      <el-card
        v-for="flow in flowsForCourse"
        :key="flow.id"
        shadow="never"
        class="p-0 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
        @click="viewStudents(flow.id)"
      >
        <div
          class="
            w-full flex justify-between items-center
            px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8
          "
        >
          <span class="text-base sm:text-lg lg:text-xl font-medium">
            {{ flow.name }}
          </span>
          <el-icon>
            <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-500" />
          </el-icon>
        </div>
      </el-card>

      <!-- Кнопки “Редактировать” и “Добавить поток” -->
      <div class="flex justify-end mt-6 space-x-2">
        <el-button type="success" @click="startEdit" size="small">
          Редактировать
        </el-button>
        <el-button type="primary" @click="onAddFlow" size="small">
          Добавить поток
        </el-button>
      </div>
    </div>

    <!-- ======== РЕЖИМ 3: РЕДАКТИРОВАНИЕ (есть потоки, isEditing=true) ======== -->
    <div v-else-if="isEditing" class="space-y-3">
      <!-- Список потоков с чекбоксами -->
      <el-card
        v-for="flow in flowsForCourse"
        :key="flow.id"
        shadow="never"
        class="flex justify-between items-center p-0 bg-white rounded-lg hover:bg-gray-50"
      >
        <div
          class="
            w-full flex items-center
            px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8
            space-x-4
          "
        >
          <!-- Название потока (не кликабельно, т.к. сейчас мы в режиме выбора) -->
          <span class="flex-1 text-base sm:text-lg lg:text-xl font-medium">
            {{ flow.name }}
          </span>

          <!-- Иконка стрелки (для однородности, можно убрать если не нужна) -->
          <el-icon class="text-purple-500">
            <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </el-icon>

          <!-- Чекбокс для удаления -->
          <el-checkbox
            v-model="selectedIds"
            :label="flow.id"
            :true-label="flow.id"
            :false-label="null"
            class="ml-4"
          />
        </div>
      </el-card>

      <!-- Кнопки “Редактировать” (зелёная) и “Удалить” (красная) -->
      <div class="flex justify-end mt-6 space-x-2">
        <!-- Тут вы сможете добавить логику массового редактирования или редактирования выбранного потока -->
        <el-button type="success" @click="onApplyEdit" size="small">
          Редактировать
        </el-button>

        <!-- Кнопка “Удалить” открывает диалог confirm -->
        <el-button type="danger" @click="confirmDelete" size="small">
          Удалить
        </el-button>
      </div>
    </div>

    <!-- ======== DIALOG: Подтверждение удаления ======== -->
    <el-dialog
      v-model="showDeleteDialog"
      width="400px"
      show-close="false"
      center
      custom-class="delete-dialog"
    >
      <div class="text-center p-6">
        <el-icon class="text-red-500 text-4xl mb-2">
          <!-- Используем иконку корзины -->
          <Delete class="w-8 h-8" />
        </el-icon>
        <h3 class="text-xl font-semibold mb-2">Удалить</h3>
        <p class="text-gray-700 mb-6 text-sm">
          Вы действительно хотите удалить
          <template v-if="selectedIds.length === 1">
            этот поток?
          </template>
          <template v-else>
            эти потоки?
          </template>
        </p>
        <div class="flex justify-center space-x-4">
          <el-button @click="showDeleteDialog = false" size="small">
            Отмена
          </el-button>
          <el-button type="danger" @click="onDelete" size="small">
            Удалить
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/store/courseStore'
import { useFlowStore, Flow } from '@/store/flowStore'
import { ArrowRight, Delete } from '@element-plus/icons-vue'

const route  = useRoute()
const router = useRouter()

// ID курса (из параметра URL)
const courseId = Number(route.params.id)

// Подключаем Pinia-сторы
const courseStore = useCourseStore()
const flowStore   = useFlowStore()

// Загрузка данных при монтировании
onMounted(async () => {
  await courseStore.fetchCourses()
  await flowStore.fetchFlows()
})

// Название курса
const courseName = computed<string>(() => {
  const c = courseStore.list.find((c) => c.id === courseId)
  return c ? c.name : 'Курс не найден'
})

// Список всех потоков этого курса
const flowsForCourse = computed<Flow[]>(() =>
  flowStore.list.filter((f) => f.courseId === courseId)
)

// Режим редактирования (отображает чекбоксы)
const isEditing = ref(false)

// Массив выбранных ID потоков (через el-checkbox)
const selectedIds = ref<number[]>([])

// Открыть режим редактирования
function startEdit() {
  isEditing.value = true
  selectedIds.value = []
}

// Применить “Редактировать” (пока заглушка, можно доработать под логику)
function onApplyEdit() {
  // Здесь можно реализовать логику массового или одиночного редактирования
  // Например, если выбран ровно один поток, открыть форму редактирования этого потока
  if (selectedIds.value.length === 1) {
    const flowId = selectedIds.value[0]
    router.push({
      name: 'EditFlow',
      params: { courseId, flowId },
    })
  }
  // Можно также добавить логику при 0 или >1 выбранных потоках
}

// Кнопка “Добавить поток”
function onAddFlow() {
  router.push({ name: 'AddFlow', params: { courseId } })
}

// При клике на стрелочку – переход к списку студентов конкретного потока
function viewStudents(flowId: number) {
  router.push({ name: 'FlowStudents', params: { flowId } })
}

// ======== ДИАЛОГ УДАЛЕНИЯ ========
const showDeleteDialog = ref(false)

// Открыть диалог удаления
function confirmDelete() {
  if (selectedIds.value.length > 0) {
    showDeleteDialog.value = true
  }
}

// Подтверждение удаления: удаляем все выбранные ID
function onDelete() {
  for (const id of selectedIds.value) {
    flowStore.removeFlow(id)
  }
  // Закрываем диалог и выходим из режима редактирования
  showDeleteDialog.value = false
  isEditing.value = false
  selectedIds.value = []
}
</script>

<style scoped>
/* Стилизация для диалога удаления, чтобы padding в body был ноль */
.delete-dialog .el-dialog__body {
  padding: 0;
}
</style>
