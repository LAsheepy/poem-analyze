import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AIConversation, AIResponse } from '@/types/ai'

export const useAIStore = defineStore('ai', () => {
  const conversations = ref<AIConversation[]>([])
  const isLoading = ref(false)
  const currentConversationId = ref<string | undefined>(undefined)

  // 获取当前对话
  const currentConversation = computed(() => {
    return conversations.value.find(conv => conv.id === currentConversationId.value)
  })

  // 发送消息给AI
  const sendMessage = async (message: string, poemId?: string): Promise<AIResponse> => {
    isLoading.value = true
    
    try {
      // 模拟AI响应
      const response: AIResponse = {
        id: Date.now().toString(),
        content: `这是AI对"${message}"的响应。诗词解析功能将在后续集成。`,
        timestamp: new Date(),
        poemId: poemId || null
      }

      // 添加到对话历史
      if (currentConversationId.value) {
        const conv = conversations.value.find(c => c.id === currentConversationId.value)
        if (conv) {
          conv.messages.push({
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date()
          }, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.content,
            timestamp: new Date()
          })
        }
      }

      return response
    } catch (error) {
      throw new Error('AI服务暂时不可用')
    } finally {
      isLoading.value = false
    }
  }

  // 创建新对话
  const createConversation = (poemId?: string): string => {
    const newConv: AIConversation = {
      id: Date.now().toString(),
      poemId: poemId || null,
      messages: [],
      createdAt: new Date()
    }
    conversations.value.push(newConv)
    currentConversationId.value = newConv.id
    return newConv.id
  }

  return {
    conversations,
    isLoading,
    currentConversationId,
    currentConversation,
    sendMessage,
    createConversation
  }
})