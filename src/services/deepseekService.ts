import { ref } from 'vue'

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  conversationId: string
}

class DeepSeekService {
  private baseURL = '/api'

  async sendMessage(
    messages: DeepSeekMessage[], 
    conversationId: string,
    userId?: string
  ): Promise<DeepSeekResponse> {
    // 提取用户消息（最后一条）
    const userMessage = messages[messages.length - 1]?.content || ''

    const response = await fetch(`${this.baseURL}/deepseek-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        conversationId: conversationId,
        userId: userId
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API请求失败: ${response.statusText}`)
    }

    const data = await response.json()
    
    // 转换为DeepSeekResponse格式
    return {
      id: `chatcmpl_${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'deepseek-chat',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: data.response
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    }
  }

  // 专门用于诗词分析的对话方法
  async analyzePoem(poemContent: string, poet?: string, context?: string): Promise<string> {
    const systemPrompt = `你是一个专业的诗词分析AI助手。请对用户提供的诗词进行专业解析：

**解析要求：**
1. 分析诗词的主题思想和情感表达
2. 解析诗词的艺术特色和修辞手法
3. 介绍诗人的创作背景和文学风格
4. 解释诗词中的文化典故和历史背景
5. 提供分层的详细解析（字词→意象→整体意境）

**回答格式：**
- 语言优美，富有文学气息
- 结构清晰，层次分明
- 结合具体诗句进行分析
- 适当引用相关诗词进行对比`

    const userMessage = poet || context 
      ? `请分析以下诗词：
${poemContent}

${poet ? `诗人：${poet}` : ''}
${context ? `背景信息：${context}` : ''}`
      : `请分析以下诗词：${poemContent}`

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]

    try {
      const response = await this.sendMessage(messages, 'poem_analysis')
      return response.choices[0].message.content
    } catch (error) {
      console.error('诗词分析失败:', error)
      throw new Error('诗词分析服务暂时不可用，请稍后重试')
    }
  }

  // 介绍诗人的方法
  async introducePoet(poetName: string): Promise<string> {
    const systemPrompt = `你是一个专业的文学研究AI助手。请详细介绍指定的诗人：

**介绍要求：**
1. 诗人的生平和重要经历
2. 诗人的文学成就和代表作品
3. 诗人的创作风格和艺术特色
4. 诗人在文学史上的地位和影响
5. 相关的历史背景和文化环境

**回答格式：**
- 内容详实，信息准确
- 结构清晰，重点突出
- 语言专业但不失生动
- 适当引用诗人的代表诗句`

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请详细介绍诗人：${poetName}` }
    ]

    try {
      const response = await this.sendMessage(messages, 'poet_introduction')
      return response.choices[0].message.content
    } catch (error) {
      console.error('诗人介绍失败:', error)
      throw new Error('诗人介绍服务暂时不可用，请稍后重试')
    }
  }
}

export const deepSeekService = new DeepSeekService()