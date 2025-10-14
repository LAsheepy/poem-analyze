// 状态管理统一导出
export { useUserStore } from './user'
export { useAIStore } from './ai'

// 组合式store
export function useAppStore() {
  const userStore = useUserStore()
  const aiStore = useAIStore()
  
  // 组合式状态
  const isAppReady = computed(() => {
    return userStore.isAuthenticated && aiStore.conversations.length > 0
  })
  
  // 组合式方法
  const initializeApp = async () => {
    try {
      // 初始化用户状态
      await userStore.setUser({
        id: '1',
        username: '测试用户',
        email: 'test@example.com',
        role: 'student',
        learningProgress: 65,
        interests: ['唐诗', '宋词'],
        createdAt: new Date(),
        lastLoginAt: new Date()
      })
      
      // 初始化AI对话
      aiStore.createConversation()
      
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
  
  return {
    userStore,
    aiStore,
    isAppReady,
    initializeApp,
    resetApp
  }
}