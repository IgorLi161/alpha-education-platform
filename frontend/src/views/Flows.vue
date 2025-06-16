<!-- src/views/Flows.vue -->
<template>
  <div class="flex flex-col h-full bg-gray-100">
    <!-- ─── 1) Заголовок ─────────────────────────────────────────── -->
    <div class="px-6 pt-6 md:px-8 lg:px-10">
      <h1 class="text-2xl md:text-3xl font-bold">
        <template v-if="!currentCourseId">
          Все курсы
        </template>
        <template v-else>
          Потоки курса {{ currentCourseName || '—' }}
        </template>
      </h1>
    </div>

    <!-- ─── 2) Основная область ─────────────────────────────────── -->
    <div class="flex-1 overflow-auto px-6 pb-6 md:px-8 lg:px-10">
      <!-- A) Если ничего не выбрано (нет courseId), показываем список всех курсов -->
      <div v-if="!currentCourseId">
        <!-- A1) Если нет Курсов и НЕ в режиме редактирования -->
        <div
          v-if="courses.length === 0 && !isEditingCourses"
          class="flex flex-col items-center justify-center h-full space-y-4"
        >
          <p class="text-lg text-gray-700 text-center">
            Курсы еще не добавлены<br />
            Нажмите “Добавить курс”, чтобы начать
          </p>
          <el-button type="primary" size="large" @click="goToAddCourse">
            Добавить курс
          </el-button>
        </div>

        <!-- A2) Если есть хотя бы один курс и НЕ редактируем -->
        <div
          v-else-if="courses.length > 0 && !isEditingCourses"
          class="space-y-4 mt-6"
        >
          <template v-for="course in courses" :key="course.id">
            <el-card
              shadow="never"
              class="flex items-center justify-between p-0 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="viewCourseFlows(course)"
            >
              <div
                class="
                  flex-1 flex justify-between items-center
                  px-6 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8
                "
              >
                <span class="text-base md:text-lg lg:text-xl font-medium">
                  {{ course.name }}
                </span>
                <el-icon>
                  <ArrowRight class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-500" />
                </el-icon>
              </div>
            </el-card>
          </template>

          <div class="flex justify-end mt-6 space-x-2">
            <el-button
              type="primary"
              plain
              size="small"
              @click="enterCourseEditMode"
            >
              Редактировать
            </el-button>
            <el-button type="primary" size="small" @click="goToAddCourse">
              Добавить курс
            </el-button>
          </div>
        </div>

        <!-- A3) Режим «Редактирование курсов» (появляются чекбоксы справа) -->
        <div v-else-if="isEditingCourses" class="space-y-4 mt-6">
          <template v-for="course in courses" :key="course.id">
            <div class="flex items-center">
              <el-card
                shadow="never"
                class="flex-1 p-0 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="viewCourseFlows(course)"
              >
                <div
                  class="
                    flex justify-between items-center
                    px-6 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8
                  "
                >
                  <span class="text-base md:text-lg lg:text-xl font-medium">
                    {{ course.name }}
                  </span>
                  <el-icon>
                    <ArrowRight class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-500" />
                  </el-icon>
                </div>
              </el-card>
              <div class="ml-4">
                <el-checkbox
                  :model-value="checkedCourses.includes(course.id)"
                  @change="(val: boolean) => toggleCourseCheckbox(course.id, val)"
                />
              </div>
            </div>
          </template>

          <div class="flex justify-end mt-6 space-x-2">
            <el-button type="success" size="small" @click="editSingleCourse">
              Редактировать
            </el-button>
            <el-button type="danger" size="small" @click="confirmDeleteCourses">
              Удалить
            </el-button>
          </div>
        </div>

        <!-- A4) Диалог «Удалить курсы» -->
        <el-dialog
          v-model="showDeleteCoursesDialog"
          width="320px"
          show-close="false"
          center
          custom-class="delete-dialog"
        >
          <div class="text-center p-6">
            <el-icon class="text-red-500 text-4xl mb-2">
              <Delete class="w-8 h-8" />
            </el-icon>
            <h3 class="text-xl font-semibold mb-2">Удалить</h3>
            <p class="text-gray-700 mb-6 text-sm">
              Вы действительно хотите удалить
              <template v-if="checkedCourses.length === 1">этот курс?</template>
              <template v-else>эти курсы?</template>
            </p>
            <div class="flex justify-center space-x-4">
              <el-button @click="showDeleteCoursesDialog = false" size="small">
                Отмена
              </el-button>
              <el-button type="danger" @click="deleteSelectedCourses" size="small">
                Удалить
              </el-button>
            </div>
          </div>
        </el-dialog>
      </div>

      <!-- B) Если courseId задан → показываем потоки указанного курса -->
      <div v-else class="relative">
        <!-- B1) Если нет Потоков и НЕ в режиме редактирования -->
        <div
          v-if="flowsForThisCourse.length === 0 && !isEditingFlows"
          class="flex flex-col items-center justify-center h-full space-y-4"
        >
          <p class="text-lg text-gray-700 text-center">
            Потоки еще не добавлены<br />
            Нажмите “Добавить поток”, чтобы начать
          </p>
          <el-button type="primary" size="large" @click="goToAddFlow">
            Добавить поток
          </el-button>
        </div>

        <!-- B2) Если есть Потоки и НЕ в режиме редактирования -->
        <div
          v-else-if="flowsForThisCourse.length > 0 && !isEditingFlows"
          class="space-y-3 mt-6"
        >
          <template v-for="flow in flowsForThisCourse" :key="flow.id">
            <el-card
              shadow="never"
              class="bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="viewFlowDetail(flow)"
            >
              <div
                class="
                  flex justify-between items-center
                  px-6 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8
                "
              >
                <span class="text-lg md:text-xl font-medium">{{ flow.name }}</span>
                <el-icon>
                  <ArrowRight class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-500" />
                </el-icon>
              </div>
            </el-card>
          </template>

          <div class="flex justify-end mt-6 space-x-2">
            <el-button
              type="primary"
              plain
              size="small"
              @click="enterFlowEditMode"
            >
              Редактировать
            </el-button>
            <el-button type="primary" size="small" @click="goToAddFlow">
              Добавить поток
            </el-button>
          </div>
        </div>

        <!-- B3) Режим «Редактирование потоков» ( появляются чекбоксы справа ) -->
        <div v-else-if="isEditingFlows" class="space-y-3 mt-6">
          <template v-for="flow in flowsForThisCourse" :key="flow.id">
            <div class="flex items-center">
              <el-card
                shadow="never"
                class="flex-1 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="viewFlowDetail(flow)"
              >
                <div
                  class="
                    flex justify-between items-center
                    px-6 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8
                  "
                >
                  <span class="text-lg md:text-xl font-medium">{{ flow.name }}</span>
                  <el-icon>
                    <ArrowRight class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-500" />
                  </el-icon>
                </div>
              </el-card>
              <div class="ml-4">
                <el-checkbox
                  :model-value="checkedFlows.includes(flow.id)"
                  @change="(v: boolean) => toggleFlowCheckbox(flow.id, v)"
                />
              </div>
            </div>
          </template>

          <div class="flex justify-end mt-6 space-x-2">
            <el-button type="success" size="small" @click="editSingleFlow">
              Редактировать
            </el-button>
            <el-button type="danger" size="small" @click="confirmDeleteFlows">
              Удалить
            </el-button>
          </div>
        </div>

        <!-- B4) Диалог «Удалить потоки» -->
        <el-dialog
          v-model="showDeleteFlowsDialog"
          width="320px"
          show-close="false"
          center
          custom-class="delete-dialog"
        >
          <div class="text-center p-6">
            <el-icon class="text-red-500 text-4xl mb-2">
              <Delete class="w-8 h-8" />
            </el-icon>
            <h3 class="text-xl font-semibold mb-2">Удалить</h3>
            <p class="text-gray-700 mb-6 text-sm">
              Вы действительно хотите удалить
              <template v-if="checkedFlows.length === 1">этот поток?</template>
              <template v-else>эти потоки?</template>
            </p>
            <div class="flex justify-center space-x-4">
              <el-button @click="showDeleteFlowsDialog = false" size="small">
                Отмена
              </el-button>
              <el-button type="danger" @click="deleteSelectedFlows" size="small">
                Удалить
              </el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- ─── 3) Диалог «Поток успешно создан» ──────────────────────────────────── -->
    <el-dialog
      v-model="showFlowCreated"
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
        <p class="text-gray-600 mb-6">Поток успешно создан</p>
        <el-button type="primary" size="small" @click="onFlowCreatedContinue">
          Далее
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowRight, Delete, SuccessFilled } from '@element-plus/icons-vue';

import { useCourseStore, Course } from '@/store/courseStore';
import { useFlowStore, Flow } from '@/store/flowStore';

// ─── a) Router & Query ───────────────────────────────────────────────────
const router = useRouter();
const route = useRoute();

// Текущий courseId из query, например /flows?courseId=5
const currentCourseId = computed<number | null>(() => {
  const q = route.query.courseId;
  return q ? Number(q) : null;
});

// ─── b) Stores ─────────────────────────────────────────────────────────────
const courseStore = useCourseStore();
const flowStore = useFlowStore();

// ─── c) Списки / Стейты ─────────────────────────────────────────────────────
// Список всех курсов:
const courses = computed<Course[]>(() => courseStore.list);

// Состояния режима “Редактирование курсов”
const isEditingCourses = ref(false);
const checkedCourses = ref<number[]>([]);
const showDeleteCoursesDialog = ref(false);

// Состояния режима “Редактирование потоков”
const isEditingFlows = ref(false);
const checkedFlows = ref<number[]>([]);
const showDeleteFlowsDialog = ref(false);

// Потоки, отфильтрованные по currentCourseId:
const flowsForThisCourse = computed<Flow[]>(() => {
  if (currentCourseId.value !== null) {
    return flowStore.list.filter(f => f.courseId === currentCourseId.value);
  }
  return [];
});

// Имя текущего курса (для заголовка “Потоки курса …”)
const currentCourseName = computed<string | null>(() => {
  const c = courses.value.find(x => x.id === currentCourseId.value);
  return c ? c.name : null;
});

// Состояние поп-апа “Поток успешно создан”
const showFlowCreated = ref(false);

// ─── d) Lifecycle: начальная загрузка ──────────────────────────────────────
onMounted(async () => {
  // Если ещё не подгружены курсы, подгрузим
  if (!courses.value.length) {
    await courseStore.fetchCourses();
  }
  // Если у нас есть курс в query и ещё нет потоков, подгрузим все потоки (store хранит их в flowStore.list)
  if (currentCourseId.value !== null && !flowStore.list.length) {
    await flowStore.fetchFlows();
  }
});

// Если вручную сменили query (например переключились на другой courseId), загрузим потоки снова
watch(
  () => currentCourseId.value,
  async newId => {
    if (newId !== null && !flowStore.list.length) {
      await flowStore.fetchFlows();
    }
  }
);

// ─── e) Навигация / Действия ─────────────────────────────────────────────────
// Добавить курс → переходим на AddCourse
function goToAddCourse() {
  router.push({ name: 'AddCourse' });
}

// Из режима “редактировать курсы” → если ровно один курс отмечен, открываем страницу редактирования
function editSingleCourse() {
  if (checkedCourses.value.length === 1) {
    const id = checkedCourses.value[0];
    router.push({ name: 'EditCourse', params: { id } });
  }
}

// Подтвердить удаление курсов → показать диалог
function confirmDeleteCourses() {
  if (checkedCourses.value.length) {
    showDeleteCoursesDialog.value = true;
  }
}

// Удалить выбранные курсы из store, выйти из edit-режима
function deleteSelectedCourses() {
  checkedCourses.value.forEach(id => {
    courseStore.removeCourse(id);
  });
  checkedCourses.value = [];
  isEditingCourses.value = false;
  showDeleteCoursesDialog.value = false;
}

// Войти в режим “редактирование курсов”
function enterCourseEditMode() {
  isEditingCourses.value = true;
  checkedCourses.value = [];
}

// Переключить чекбокс курса
function toggleCourseCheckbox(id: number, val: boolean) {
  if (val) {
    if (!checkedCourses.value.includes(id)) {
      checkedCourses.value.push(id);
    }
  } else {
    checkedCourses.value = checkedCourses.value.filter(x => x !== id);
  }
}

// Щелкнули по карточке курса → показываем потоки этого курса (добавляем query ?courseId=…)
function viewCourseFlows(course: Course) {
  router.push({ name: 'Flows', query: { courseId: String(course.id) } });
}

// ────────────────────────────────────────────────────────────────────────────
// Перейти на “Добавить поток” (сохраняем текущий courseId в query)
function goToAddFlow() {
  if (currentCourseId.value !== null) {
    router.push({
      name: 'AddFlow',
      query: { courseId: String(currentCourseId.value) },
    });
  }
}

// Перейти на детали конкретного потока
function viewFlowDetail(flow: Flow) {
  router.push({ name: 'FlowDetail', params: { flowId: flow.id } });
}

// Войти в режим “редактирование потоков” (показываем чекбоксы справа)
function enterFlowEditMode() {
  isEditingFlows.value = true;
  checkedFlows.value = [];
}

// Если нажали “Редактировать” в режиме редактирования потоков,
// и отмечен ровно один поток, переходим на страницу редактирования этого потока:
function editSingleFlow() {
  if (checkedFlows.value.length === 1) {
    const id = checkedFlows.value[0];
    router.push({ name: 'EditFlow', params: { flowId: id } });
  }
}

// Подтвердить удаление потоков → показать диалог
function confirmDeleteFlows() {
  if (checkedFlows.value.length) {
    showDeleteFlowsDialog.value = true;
  }
}

// Удалить выбранные потоки, выйти из режима редактирования
function deleteSelectedFlows() {
  checkedFlows.value.forEach(id => {
    flowStore.removeFlow(id);
  });
  checkedFlows.value = [];
  isEditingFlows.value = false;
  showDeleteFlowsDialog.value = false;
}

// Переключить чекбокс потока
function toggleFlowCheckbox(id: number, val: boolean) {
  if (val) {
    if (!checkedFlows.value.includes(id)) {
      checkedFlows.value.push(id);
    }
  } else {
    checkedFlows.value = checkedFlows.value.filter(x => x !== id);
  }
}

// Вызывается (напрямую из AddFlow.vue) после успешного добавления потока,
// чтобы показать “Поток успешно создан” диалог.
function onAddFlowSuccess() {
  showFlowCreated.value = true;
}

// После клика “Далее” в диалоге “Поток успешно создан”:
function onFlowCreatedContinue() {
  showFlowCreated.value = false;
  // Перезагрузим текущую страницу, чтобы диалог не повторялся:
  router.push({
    name: 'Flows',
    query: { courseId: String(currentCourseId.value) },
  });
}
</script>

<style scoped>
/* Сохраняем строго 320px ширину у обоих поп-апов: “Удалить” и “Готово!” */
.delete-dialog .el-dialog__body,
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>
