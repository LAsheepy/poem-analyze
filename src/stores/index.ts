import { computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from './user'
import { useAIStore } from './ai'

// 状态管理统一导出
export { useUserStore } from './user'
export { useAIStore } from './ai'

// 组合式store
export function useAppStore() {
  const userStore = useUserStore()
  const aiStore = useAIStore()
  
  // 组合式状态
  const isAppReady = computed(() => {
    return userStore.isAuthenticated && !userStore.isLoading
  })
  
  // 组合式方法
  const initializeApp = async () => {
    try {
      // 设置认证监听器
      userStore.setupAuthListener()
      
      // 尝试加载当前用户
      const user = await userStore.loadUser()
      
      if (user) {
        // 用户已登录，加载对话列表
        await aiStore.loadConversations()
        console.log('应用初始化成功，用户已登录')
      } else {
        console.log('应用初始化成功，用户未登录')
      }
      
      return true
    } catch (error) {
      console.error('应用初始化失败:', error)
      return false
    }
  }
  
  const resetApp = () => {
    userStore.clearUser()
    aiStore.conversations = []
    aiStore.currentConversationId = undefined
  }
  
  // 登录方法
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }
  
  // 注册方法
  const register = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }
  
  // 登出方法
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      resetApp()
    } catch (error) {
      console.error('登出失败:', error)
      throw error
    }
  }
  
  return {
    userStore,
    aiStore,
    isAppReady,
    initializeApp,
    resetApp,
    login,
    register,
    logout
  }
}