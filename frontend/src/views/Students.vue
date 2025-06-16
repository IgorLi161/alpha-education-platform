<template>
  <div class="p-6">
    <!-- Заголовок + Поиск -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Список студентов</h1>
      <div class="relative w-1/3">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск"
          clearable
          class="w-full bg-purple-50 border border-purple-200 rounded-lg pl-10 pr-4 py-2"
          @clear="applyFilters"
          @keyup.enter="applyFilters"
        >
          <template #prefix>
            <Search class="text-purple-400" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- Кнопки Добавить / Фильтр -->
    <div class="mt-4 flex items-center space-x-2 bg-purple-50 p-4 rounded-lg">
      <el-button
        class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"
        @click="onAddStudent"
        size="small"
      >
        <Plus class="mr-2" /> Добавить студента
      </el-button>
      <el-button
        type="primary"
        class="flex items-center bg-purple-500 hover:bg-purple-600"
        @click="showFilter = !showFilter"
        size="small"
      >
        <Filter class="mr-2" /> Фильтр
      </el-button>
    </div>

    <!-- Панель фильтров -->
    <el-card
      v-if="showFilter"
      class="mt-4 bg-purple-50 border border-purple-200 rounded-lg"
      shadow="never"
    >
      <div class="flex flex-wrap gap-4">
        <div>
          <el-select
            v-model="filter.course"
            placeholder="Выбрать курс"
            clearable
            class="w-48"
          >
            <el-option
              v-for="c in courses"
              :key="c"
              :label="c"
              :value="c"
            />
          </el-select>
        </div>
        <div>
          <el-select
            v-model="filter.stream"
            placeholder="Выбрать поток"
            clearable
            class="w-48"
          >
            <el-option
              v-for="s in streams"
              :key="s"
              :label="s"
              :value="s"
            />
          </el-select>
        </div>
        <el-checkbox v-model="filter.topStudent">
          Top Student
        </el-checkbox>
        <el-button
          type="primary"
          @click="onResetFilters"
          size="small"
        >
          Сбросить
        </el-button>
      </div>
    </el-card>

    <!-- Таблица студентов -->
    <div class="mt-6 overflow-auto">
      <table class="min-w-full bg-white border rounded-lg">
        <thead class="bg-purple-50">
          <tr>
            <th class="px-6 py-6 text-purple-700 text-left">#</th>
            <th class="px-6 py-6 text-purple-700 text-left">Студент</th>
            <th class="px-6 py-6 text-purple-700 text-left">ИИН</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(s, idx) in filteredList"
            :key="s.id"
            class="border-t hover:bg-gray-50 cursor-pointer"
            @click="goToProfile(s.id)"
          >
            <td class="px-6 py-8 text-sm text-gray-900">{{ idx + 1 }}</td>
            <td class="px-6 py-8 text-sm text-gray-900">{{ s.name }}</td>
            <td class="px-6 py-8 text-sm text-gray-900">{{ s.iin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'
import { Search, Plus, Filter } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStudentStore()

// Поиск и фильтры
const searchQuery = ref('')
const showFilter  = ref(false)
const filter = ref({
  course: '' as string,
  stream: '' as string,
  topStudent: false,
})

// Опции фильтров
const courses = [
  'Data Science', 'Generative AI', 'IT право',
  'Введение в программирование', 'Вэб-разработка',
  'Графический и UI/UX дизайн', 'Машинное обучение и ИИ',
  'Мобильная разработка', 'Разработка игр',
  'Сети и информационная безопасность',
]
const streams = ['A1', 'B2', 'C3', 'D4']

// Загрузка данных с backend
onMounted(async () => {
  await store.fetchStudents()
})

// Навигация
function onAddStudent() {
  router.push({ name: 'NewStudent' })
}
function goToProfile(id: number) {
  router.push({ name: 'StudentDetail', params: { id } })
}

// Фильтрация и поиск
function applyFilters() {}
function onResetFilters() {
  filter.value = { course: '', stream: '', topStudent: false }
  searchQuery.value = ''
}

// Итоговый список
const filteredList = computed<Student[]>(() =>
  store.list.filter((s) => {
    const bySearch =
      !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.iin.includes(searchQuery.value)
    const byCourse =
      !filter.value.course || s.course === filter.value.course
    const byStream =
      !filter.value.stream || s.stream === filter.value.stream
    const byTop =
      !filter.value.topStudent || s.topStudent
    return bySearch && byCourse && byStream && byTop
  })
)
</script>

<style scoped>
/* любые твои стили */
</style>
