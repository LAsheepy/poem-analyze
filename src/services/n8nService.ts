import { ref } from 'vue'

interface N8NMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface N8NResponse {
  response: string
  conversationId: string
  userMessage: string
  timestamp: string
}

interface N8NChatConfig {
  webhookUrl: string
  apiKey?: string
  useN8N: boolean
}

class N8NService {
  private config: N8NChatConfig = {
    webhookUrl: '',
    useN8N: false
  }

  // 配置n8n服务
  configure(config: Partial<N8NChatConfig>) {
    this.config = { ...this.config, ...config }
  }

  // 发送消息到n8n工作流
  async sendMessage(
    message: string, 
    conversationId: string = 'default',
    userId?: string
  ): Promise<N8NResponse> {
    if (!this.config.useN8N || !this.config.webhookUrl) {
      throw new Error('n8n服务未配置或未启用')
    }

    const payload = {
      message: message,
      conversationId: conversationId,
      userId: userId,
      timestamp: new Date().toISOString()
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`n8n工作流请求失败: ${response.statusText}`)
      }

      const data = await response.json()
      
      // 验证响应格式
      if (!data.response) {
        throw new Error('n8n工作流返回无效的响应格式')
      }

      return {
        response: data.response,
        conversationId: data.conversationId || conversationId,
        userMessage: data.userMessage || message,
        timestamp: data.timestamp || new Date().toISOString()
      }
    } catch (error) {
      console.error('n8n服务调用失败:', error)
      throw new Error('n8n工作流暂时不可用，请检查配置或稍后重试')
    }
  }

  // 测试n8n连接
  async testConnection(): Promise<boolean> {
    if (!this.config.webhookUrl) {
      return false
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          message: '测试连接',
          conversationId: 'test',
          timestamp: new Date().toISOString()
        })
      })

      // 检查响应状态和内容
      if (!response.ok) {
        console.error('n8n连接测试失败:', response.status, response.statusText)
        return false
      }

      // 尝试解析响应内容
      const data = await response.json()
      return true
    } catch (error) {
      console.error('n8n连接测试失败:', error)
      return false
    }
  }

  // 获取当前配置
  getConfig(): N8NChatConfig {
    return { ...this.config }
  }

  // 切换服务模式
  toggleServiceMode(useN8N: boolean) {
    this.config.useN8N = useN8N
  }
}

// 创建n8n服务实例
export const n8nService = new N8NService()

// 默认配置（可在.env中配置）
const defaultConfig: Partial<N8NChatConfig> = {
  webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
  apiKey: import.meta.env.VITE_N8N_API_KEY || '',
  useN8N: import.meta.env.VITE_USE_N8N === 'true'
}

// 初始化配置
n8nService.configure(defaultConfig)