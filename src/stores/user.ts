import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)
  const isTeacher = computed(() => user.value?.role === 'teacher')

  // 设置用户信息
  const setUser = (userData: User) => {
    user.value = userData
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
  }

  // 更新学习进度
  const updateLearningProgress = (progress: number) => {
    if (user.value) {
      user.value.learningProgress = progress
    }
  }

  return {
    user,
    isAuthenticated,
    isTeacher,
    setUser,
    clearUser,
    updateLearningProgress
  }
})