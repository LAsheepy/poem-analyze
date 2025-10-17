import { ref } from 'vue'

// n8n AI 助手服务
export const n8nService = {
  // 调用 AI 聊天助手
  async sendMessage(message: string, conversationId?: string): Promise<string> {
    const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
    
    if (!n8nWebhookUrl) {
      console.warn('N8N webhook URL 未配置，使用模拟 AI 响应')
      return this.getMockAIResponse(message)
    }
    
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationId: conversationId || 'default',
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.response || data.choices?.[0]?.message?.content || this.getMockAIResponse(message)
    } catch (error) {
      console.error('调用 n8n AI 助手失败:', error)
      console.warn('使用模拟 AI 响应作为备选方案')
      return this.getMockAIResponse(message)
    }
  },
  
  // 获取诗词解析（专门针对诗词的 AI 分析）
  async analyzePoem(poemContent: string, analysisType: 'word' | 'imagery' | 'overall' | 'author' | 'context' = 'overall'): Promise<string> {
    const prompt = this.buildPoemAnalysisPrompt(poemContent, analysisType)
    return this.sendMessage(prompt)
  },
  
  // 构建诗词解析提示词
  buildPoemAnalysisPrompt(poemContent: string, analysisType: string): string {
    const analysisTypes = {
      word: '字词解析',
      imagery: '意象分析', 
      overall: '整体赏析',
      author: '作者背景',
      context: '创作背景'
    }
    
    return `请对以下诗词进行${analysisTypes[analysisType as keyof typeof analysisTypes]}：

${poemContent}

请提供专业的${analysisTypes[analysisType as keyof typeof analysisTypes]}，包括：
1. 关键词语的解释和用法
2. 修辞手法和艺术特色
3. 情感表达和意境营造
4. 历史背景和文化内涵

请用中文回答，分析要详细专业。`
  },
  
  // 获取学习建议
  async getLearningSuggestions(userLevel: string, interests: string[]): Promise<string> {
    const prompt = `根据用户的学习水平（${userLevel}）和兴趣领域（${interests.join(', ')}），提供个性化的诗词学习建议和学习路径规划。`
    return this.sendMessage(prompt)
  },
  
  // 模拟 AI 响应（开发环境备用）
  getMockAIResponse(message: string): string {
    const responses = [
      "您好！我是诗词AI助手，很高兴为您服务。",
      "关于诗词的问题，我可以帮您解析意境、分析修辞手法、了解创作背景等。",
      "请告诉我您想了解哪首诗词，或者有什么具体的诗词问题需要解答？",
      "我可以帮您分析诗词的字词含义、意象表达、情感内涵等方面。",
      "如果您有具体的诗词内容，我可以为您提供专业的解析和赏析。"
    ]
    
    // 根据消息内容返回不同的响应
    if (message.includes('诗词') || message.includes('诗') || message.includes('词')) {
      return "关于诗词的问题，我可以帮您解析意境、分析修辞手法、了解创作背景等。请告诉我具体的诗词内容或您想了解的问题。"
    }
    
    if (message.includes('解析') || message.includes('分析') || message.includes('赏析')) {
      return "我可以帮您进行诗词解析，包括字词解释、意象分析、情感表达等方面。请提供具体的诗词内容。"
    }
    
    if (message.includes('学习') || message.includes('建议')) {
      return "我可以为您提供个性化的诗词学习建议，包括推荐阅读、学习方法、学习路径规划等。"
    }
    
    // 默认响应
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export default n8nService