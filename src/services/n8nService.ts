import { ref } from 'vue'

// n8n AI 助手服务
export const n8nService = {
  // 调用 AI 聊天助手
  async sendMessage(message: string, conversationId?: string): Promise<string> {
    const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
    
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL 未配置')
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
      return data.response || data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'
    } catch (error) {
      console.error('调用 n8n AI 助手失败:', error)
      throw new Error('AI 服务暂时不可用，请稍后重试')
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
  }
}

export default n8nService