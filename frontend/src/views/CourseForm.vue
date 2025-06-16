<!-- src/views/CourseForm.vue -->
<template>
  <div class="bg-gray-100 min-h-screen p-6 sm:p-8 lg:p-10">
    <!-- Заголовок -->
    <h1 class="text-2xl sm:text-3xl font-bold mb-8">
      Редактировать название курса
    </h1>

    <!-- Input для имени курса -->
    <div class="mb-6">
      <el-input
        v-model="form.name"
        placeholder="Название курса"
        clearable
        size="large"
        class="w-full bg-purple-50 placeholder-purple-400 text-lg rounded-lg"
      />
    </div>

    <!-- Кнопка “Сохранить” -->
    <div class="flex justify-end">
      <el-button type="primary" size="large" @click="saveCourse">
        Сохранить
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore, Course } from '@/store/courseStore'

// Router & Store
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// Параметр ID из роутера
const id = Number(route.params.id)

// Локальная модель формы
const form = ref({ name: '' })

// Если store пуст, подтягиваем список курсов
onMounted(async () => {
  if (!courseStore.list.length) {
    await courseStore.fetchCourses()
  }
  // Найти курс с этим ID
  const course: Course | undefined = courseStore.list.find(c => c.id === id)
  if (course) {
    form.value.name = course.name
  } else {
    // Если ID некорректен, возвращаемся назад
    router.push({ name: 'Flows' })
  }
})

/** Сохранить изменения */
async function saveCourse() {
  const trimmedName = form.value.name.trim()
  if (trimmedName === '') {
    // Если поле пустое, не сохраняем
    return
  }
  // Обновляем курс, передавая просто строку
  await courseStore.updateCourse(id, trimmedName)
  // Возвращаемся к списку всех курсов
  router.push({ name: 'Flows' })
}
</script>

<style scoped>
/* Tailwind + Element Plus уже покрывает весь нужный дизайн */
</style>
