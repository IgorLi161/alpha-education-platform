// src/store/courseStore.ts
import { defineStore } from 'pinia'

export type Course = {
  id: number
  name: string
}

export const useCourseStore = defineStore('course', {
  state: () => ({
    list: [] as Course[],
  }),
  actions: {
    async fetchCourses() {
      if (this.list.length === 0) {
        // Начальные тестовые данные (можете убрать/изменить)
        this.list = [
          { id: 1, name: 'Вэб-разработка' },
          { id: 2, name: 'Дизайн' },
          { id: 3, name: 'Машинное обучение и ИИ' },
          { id: 4, name: 'Мобильная разработка' },
          { id: 5, name: 'Программирование' },
          { id: 6, name: 'Разработка игр' },
        ]
      }
    },

    /** Создать новый курс */
    async createCourse(data: Omit<Course, 'id'>) {
      const newId = this.list.length
        ? Math.max(...this.list.map((c) => c.id)) + 1
        : 1
      this.list.push({ id: newId, ...data })
    },

    /** Обновить имя курса по ID */
    async updateCourse(id: number, newName: string) {
      const idx = this.list.findIndex((c) => c.id === id)
      if (idx !== -1) {
        this.list[idx].name = newName
      }
    },

    /** Удалить курс по ID */
    removeCourse(id: number) {
      this.list = this.list.filter((c) => c.id !== id)
    },
  },
})
