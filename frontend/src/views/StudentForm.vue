<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-3xl mx-auto px-4">
      <h2 class="text-3xl font-semibold mb-6">Добавить студента</h2>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="0" class="space-y-6 bg-white p-6 rounded-lg shadow">

        <!-- ФИО -->
        <el-form-item prop="surname">
          <el-input v-model="form.surname" placeholder="Фамилия" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <el-form-item prop="firstName">
          <el-input v-model="form.firstName" placeholder="Имя" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <el-form-item prop="patronymic">
          <el-input v-model="form.patronymic" placeholder="Отчество" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <!-- ИИН, Email, Телефон -->
        <el-form-item prop="iin">
          <el-input v-model="form.iin" placeholder="ИИН" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.email" placeholder="Email" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.phone" placeholder="Телефон" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <!-- Статус и Top Student -->
        <div class="flex gap-4">
          <el-select v-model="form.status" placeholder="Статус" size="large" class="flex-1 bg-purple-50 text-lg">
            <el-option label="Студент" value="Студент" />
            <el-option label="Выпускник" value="Выпускник" />
          </el-select>

          <div class="flex items-center">
            <span class="mr-2 text-lg text-gray-700">Top Student</span>
            <el-checkbox v-model="form.topStudent" />
          </div>
        </div>

        <!-- Финансирование -->
        <el-select v-model="form.financing" placeholder="Финансирование" size="large" class="w-full bg-purple-50 text-lg">
          <el-option label="Полная оплата" value="full" />
          <el-option label="Со скидкой 30%" value="discount" />
          <el-option label="Грант" value="grant" />
        </el-select>

        <!-- Предмет -->
        <el-form-item prop="subject">
          <el-input v-model="form.subject" placeholder="Предмет" size="large" class="w-full bg-purple-50 text-lg" />
        </el-form-item>

        <!-- Оплаты -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-lg text-gray-700">Оплата за курс</label>
            <el-input-number v-model="coursePrice" :min="0" :step="1000" controls-position="right" size="large" class="w-full" />
          </div>
          <div>
            <label class="block mb-1 text-lg text-gray-700">Сумма оплачено</label>
            <el-input-number v-model="amountPaid" :min="0" :max="discountPrice" :step="1000" controls-position="right" size="large" class="w-full" />
          </div>
        </div>

        <!-- Итоговая таблица -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg overflow-hidden">
          <table class="w-full divide-y divide-purple-200">
            <thead class="bg-purple-100">
              <tr>
                <th class="px-6 py-3 text-left text-lg text-purple-700">Показатель</th>
                <th class="px-6 py-3 text-right text-lg text-purple-700">Сумма</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr class="border-t">
                <td class="px-6 py-4">Оплата за курс</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(coursePrice) }}</td>
              </tr>
              <tr class="border-t">
                <td class="px-6 py-4">Сумма со скидкой 30%</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(discountPrice) }}</td>
              </tr>
              <tr class="border-t">
                <td class="px-6 py-4">Сумма оплачено</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(amountPaid) }}</td>
              </tr>
              <tr class="border-t">
                <td class="px-6 py-4">Сумма к оплате</td>
                <td class="px-6 py-4 text-right">{{ formatTenge(amountDue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Кнопка -->
        <div class="flex justify-end mt-6">
          <el-button type="primary" size="large" @click="submitForm" class="rounded-lg">Сохранить</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'

const router = useRouter()
const store = useStudentStore()

const formRef = ref()

const form = ref({
  surname: '', firstName: '', patronymic: '',
  iin: '', email: '', phone: '',
  status: '', topStudent: false, financing: '', subject: ''
})

const rules = {
  surname: [{ required: true, message: 'Введите фамилию', trigger: 'blur' }],
  firstName: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
  iin: [{ required: true, message: 'Введите ИИН', trigger: 'blur' }],
  subject: [{ required: true, message: 'Введите предмет', trigger: 'blur' }]
}

const coursePrice = ref(150000)
const amountPaid = ref(0)
const discountPrice = computed(() => Math.round(coursePrice.value * 0.7))
const amountDue = computed(() => discountPrice.value - amountPaid.value)

function formatTenge(value: number) {
  return value >= 0 ? value.toLocaleString('ru-RU') + ' тг' : '—'
}

function submitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    const fullName = `${form.value.surname} ${form.value.firstName} ${form.value.patronymic}`.trim()

    // Маппинг статуса под PostgreSQL
    const statusMapped = form.value.status === 'Студент' ? 'active'
                        : form.value.status === 'Выпускник' ? 'graduated'
                        : 'active'

    const newStudent: Student = {
      id: 0,
      name: fullName,
      iin: form.value.iin,
      course: form.value.subject,
      stream: '',
      topStudent: form.value.topStudent,
      status: statusMapped
    }

    await store.addStudent({
      ...newStudent,
      status: statusMapped
    })

    router.push({ name: 'Students' })
  })
}
</script>

<style scoped>
.el-input__inner {
  background-color: #faf5ff;
  border-color: #e9d8fd;
  border-radius: 0.5rem;
  font-size: 1.125rem;
}
.el-input__inner::placeholder {
  color: #c4b5fd;
}
</style>
