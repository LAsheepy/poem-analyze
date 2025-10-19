import { deepSeekService } from './deepseekService'
import { n8nService } from './n8nService'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  id: string
  content: string
  timestamp: number
  service: 'deepseek' | 'n8n'
}

interface ChatServiceConfig {
  useN8N: boolean
  conversationId: string
  userId?: string
}

class ChatService {
  private config: ChatServiceConfig = {
    useN8N: false,
    conversationId: 'default'
  }

  // 配置聊天服务
  configure(config: Partial<ChatServiceConfig>) {
    this.config = { ...this.config, ...config }
  }

  // 发送消息（自动选择服务）
  async sendMessage(
    messages: ChatMessage[], 
    conversationId?: string
  ): Promise<ChatResponse> {
    const currentConversationId = conversationId || this.config.conversationId
    const userMessage = messages[messages.length - 1]?.content || ''

    try {
      if (this.config.useN8N) {
        // 使用n8n服务
        const response = await n8nService.sendMessage(
          userMessage, 
          currentConversationId, 
          this.config.userId
        )
        
        return {
          id: `n8n_${Date.now()}`,
          content: response.response,
          timestamp: Date.now(),
          service: 'n8n'
        }
      } else {
        // 使用DeepSeek服务
        const response = await deepSeekService.sendMessage(
          messages, 
          currentConversationId, 
          this.config.userId
        )
        
        return {
          id: response.id,
          content: response.choices[0].message.content,
          timestamp: response.created * 1000,
          service: 'deepseek'
        }
      }
    } catch (error) {
      console.error('聊天服务调用失败:', error)
      throw error
    }
  }

  // 专门用于诗词分析
  async analyzePoem(poemContent: string, poet?: string, context?: string): Promise<string> {
    if (this.config.useN8N) {
      // 构建n8n专用的诗词分析消息
      const message = poet || context 
        ? `请分析以下诗词：${poemContent}\n${poet ? `诗人：${poet}` : ''}\n${context ? `背景：${context}` : ''}`
        : `请分析以下诗词：${poemContent}`
      
      const response = await this.sendMessage([
        { role: 'user', content: message }
      ], 'poem_analysis')
      
      return response.content
    } else {
      // 使用DeepSeek的诗词分析
      return await deepSeekService.analyzePoem(poemContent, poet, context)
    }
  }

  // 介绍诗人
  async introducePoet(poetName: string): Promise<string> {
    if (this.config.useN8N) {
      const response = await this.sendMessage([
        { role: 'user', content: `请详细介绍诗人：${poetName}` }
      ], 'poet_introduction')
      
      return response.content
    } else {
      return await deepSeekService.introducePoet(poetName)
    }
  }

  // 测试服务连接
  async testConnection(): Promise<{ deepseek: boolean; n8n: boolean }> {
    const results = {
      deepseek: true, // DeepSeek服务默认可用（通过本地代理）
      n8n: false
    }

    // 测试n8n连接
    if (this.config.useN8N) {
      try {
        results.n8n = await n8nService.testConnection()
      } catch (error) {
        results.n8n = false
      }
    }

    return results
  }

  // 切换服务模式
  toggleServiceMode(useN8N: boolean) {
    this.config.useN8N = useN8N
    n8nService.toggleServiceMode(useN8N)
  }

  // 获取当前配置
  getConfig(): ChatServiceConfig {
    return { ...this.config }
  }

  // 获取服务状态
  getServiceStatus(): { current: 'deepseek' | 'n8n'; n8nConfigured: boolean } {
    return {
      current: this.config.useN8N ? 'n8n' : 'deepseek',
      n8nConfigured: !!n8nService.getConfig().webhookUrl
    }
  }
}

// 创建聊天服务实例
export const chatService = new ChatService()

// 默认配置
const defaultConfig: Partial<ChatServiceConfig> = {
  useN8N: import.meta.env.VITE_USE_N8N === 'true',
  conversationId: 'default_chat'
}

// 初始化配置
chatService.configure(defaultConfig)