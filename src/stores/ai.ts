import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aiService } from '@/services/supabaseService'
import type { AIConversation, AIResponse } from '@/types/ai'

export const useAIStore = defineStore('ai', () => {
  const conversations = ref<AIConversation[]>([])
  const isLoading = ref(false)
  const currentConversationId = ref<string | undefined>(undefined)
  const error = ref<string | null>(null)

  // 获取当前对话
  const currentConversation = computed(() => {
    return conversations.value.find(conv => conv.id === currentConversationId.value)
  })

  // 加载用户对话列表
  const loadConversations = async (): Promise<AIConversation[]> => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await aiService.getConversations()
      conversations.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载对话列表失败'
      console.error('加载对话列表失败:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // 发送消息给AI
  const sendMessage = async (message: string, poemId?: string): Promise<AIResponse> => {
    if (!currentConversationId.value) {
      await createConversation(poemId)
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      // 保存用户消息到数据库
      await aiService.sendMessage(currentConversationId.value!, message, 'user')
      
      // 模拟AI响应（后续可集成真实AI服务）
      const aiResponse = `这是AI对"${message}"的响应。基于诗词解析功能，我可以为您提供：

1. 字词解析和注释
2. 意象分析和意境解读
3. 作者生平和创作背景
4. 艺术特色和情感表达

请告诉我您想了解的具体内容。`
      
      // 保存AI响应到数据库
      await aiService.sendMessage(currentConversationId.value!, aiResponse, 'assistant')
      
      // 更新本地对话状态
      const response: AIResponse = {
        id: Date.now().toString(),
        content: aiResponse,
        timestamp: new Date(),
        poemId: poemId || null
      }
      
      // 重新加载对话消息
      await loadConversationMessages(currentConversationId.value!)
      
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '发送消息失败'
      console.error('发送消息失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 创建新对话
  const createConversation = async (poemId?: string): Promise<string> => {
    isLoading.value = true
    error.value = null
    
    try {
      const conversation = await aiService.createConversation(poemId)
      conversations.value.unshift(conversation)
      currentConversationId.value = conversation.id
      
      // 加载对话消息
      await loadConversationMessages(conversation.id)
      
      return conversation.id
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建对话失败'
      console.error('创建对话失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 加载对话消息
  const loadConversationMessages = async (conversationId: string): Promise<void> => {
    try {
      const messages = await aiService.getMessages(conversationId)
      
      // 更新对话的消息列表
      const convIndex = conversations.value.findIndex(conv => conv.id === conversationId)
      if (convIndex !== -1) {
        conversations.value[convIndex].messages = messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }))
      }
    } catch (err) {
      console.error('加载对话消息失败:', err)
    }
  }

  // 设置当前对话
  const setCurrentConversation = (conversationId: string) => {
    currentConversationId.value = conversationId
    loadConversationMessages(conversationId)
  }

  return {
    conversations,
    isLoading,
    currentConversationId,
    currentConversation,
    error,
    loadConversations,
    sendMessage,
    createConversation,
    setCurrentConversation,
    loadConversationMessages
  }
})