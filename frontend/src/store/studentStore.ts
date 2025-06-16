import { defineStore } from 'pinia'
import axios from 'axios'

// Тип студента на фронте (UI-структура)
export interface Student {
  id: number
  name: string          // full_name в базе
  iin: string
  course: string        // subject в базе
  stream: string        // cohort_id в базе
  topStudent: boolean   // top_student в базе
  status: string
}

export const useStudentStore = defineStore('studentStore', {
  state: () => ({
    list: [] as Student[],
  }),

  actions: {
    // Получение всех студентов
    async fetchStudents() {
      try {
        const res = await axios.get('http://localhost:5000/api/students')
        this.list = res.data.map((s: any) => ({
          id: s.id,
          name: s.full_name,
          iin: s.iin,
          course: s.subject,
          stream: s.cohort_id?.toString() ?? '',  // на случай если null
          topStudent: s.top_student,
        }))
      } catch (error) {
        console.error('Ошибка при загрузке студентов', error)
      }
    },

    // Добавление нового студента
    async addStudent(student: Student) {
      try {
        // Сборка правильного payload для backend (PostgreSQL)
        await axios.post('http://localhost:5000/api/students', {
          full_name: student.name,
          iin: student.iin,
          email: '',
          phone: '',
          whatsapp: '',
          telegram: '',
          status: 'active',
          top_student: student.topStudent,
          funding_source: '',
          discount_percent: 0,
          paid_amount: 0,
          total_cost: 0,
          cohort_id: student.stream ? parseInt(student.stream) : null,
          created_at: new Date(),
          subject: student.course
        })

        await this.fetchStudents()
      } catch (error) {
        console.error('Ошибка при добавлении студента', error)
      }
    },

    // Удаление студента
    async deleteStudent(id: number) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`)
        await this.fetchStudents()
      } catch (error) {
        console.error('Ошибка при удалении студента', error)
      }
    }
  }
})
