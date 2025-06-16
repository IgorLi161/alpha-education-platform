// src/store/flowStore.ts
import { defineStore } from 'pinia'

export type Flow = {
  id: number
  name: string
  mentor: string
  startDate?: string
  endDate?: string
  courseId: number
}

export const useFlowStore = defineStore('flow', {
  state: () => ({
    list: [] as Flow[],
    loading: false,
  }),
  actions: {
    async fetchFlows() {
      this.loading = true
      // … здесь обычно делаете API‐вызов, но для примера – просто эмуляция:
      await new Promise((r) => setTimeout(r, 300))
      if (!this.list.length) {
        this.list = [
          // Примеры “заглушек” потоков:
          { id: 1, name: 'DSF-1', mentor: 'Иванов Иван', startDate: '2025-01-01', endDate: '2025-06-01', courseId: 1 },
          { id: 2, name: 'DSF-2', mentor: 'Петров Петр', startDate: '2025-02-01', endDate: '2025-07-01', courseId: 1 },
          // … и т.д.
        ]
      }
      this.loading = false
    },

    async createFlow(data: Omit<Flow, 'id'>) {
      const newId = this.list.length ? Math.max(...this.list.map((x) => x.id)) + 1 : 1
      this.list.push({ id: newId, ...data })
    },

    async updateFlow(id: number, data: Partial<Flow>) {
      const idx = this.list.findIndex((f) => f.id === id)
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...data }
      }
    },

    async removeFlow(id: number) {
      this.list = this.list.filter((x) => x.id !== id)
    },
  },
})
