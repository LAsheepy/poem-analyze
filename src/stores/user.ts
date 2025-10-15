import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { userService } from '@/services/supabaseService'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const isTeacher = computed(() => user.value?.role === 'teacher')

  // 从Supabase加载用户信息
  const loadUser = async (): Promise<User | null> => {
    isLoading.value = true
    error.value = null
    
    try {
      const userData = await userService.getCurrentUser()
      user.value = userData
      return userData
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载用户信息失败'
      console.error('加载用户信息失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 创建或更新用户信息
  const upsertUser = async (userData: Partial<User>): Promise<User> => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await userService.upsertUser(userData)
      user.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : '保存用户信息失败'
      console.error('保存用户信息失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    error.value = null
  }

  // 更新学习进度
  const updateLearningProgress = async (progress: number): Promise<void> => {
    if (!user.value) return
    
    try {
      await userService.updateLearningProgress(progress)
      user.value.learningProgress = progress
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新学习进度失败'
      console.error('更新学习进度失败:', err)
      throw err
    }
  }

  // 监听认证状态变化
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUser()
      } else if (event === 'SIGNED_OUT') {
        clearUser()
      }
    })
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isTeacher,
    loadUser,
    upsertUser,
    clearUser,
    updateLearningProgress,
    setupAuthListener
  }
})