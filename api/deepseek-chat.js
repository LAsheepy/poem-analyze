import fetch from 'node-fetch'

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { message, conversationId, userId } = req.body

    // 验证输入
    if (!message || !message.trim()) {
      return res.status(400).json({ error: '消息内容不能为空' })
    }

    // 获取DeepSeek API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'DeepSeek API密钥未配置' })
    }

    // 构建系统提示词
    const systemPrompt = `你是一个专业的诗词AI助手，专门帮助用户理解古典诗词和文化。请用中文回答，回答要专业、详细且富有文化内涵。

**你的核心能力：**
1. 解析诗词的意境和情感
2. 分析诗词的艺术特色和修辞手法  
3. 介绍诗人的生平和创作背景
4. 比较不同诗词的异同
5. 提供诗词创作建议
6. 解答诗词相关的文化知识问题

**回答要求：**
- 保持回答的专业性和准确性
- 语言优美，富有文学气息
- 结构清晰，层次分明
- 适当引用相关诗词进行对比

如果用户的问题与诗词无关，请礼貌地引导用户关注诗词相关内容。`

    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message.trim()
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API错误:', response.status, errorText)
      return res.status(response.status).json({ 
        error: `DeepSeek API请求失败: ${response.statusText}` 
      })
    }

    const data = await response.json()
    
    // 返回格式化响应
    return res.status(200).json({
      response: data.choices[0].message.content,
      conversationId: conversationId || `conv_${Date.now()}`,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      model: data.model,
      usage: data.usage
    })

  } catch (error) {
    console.error('API处理错误:', error)
    return res.status(500).json({ 
      error: '服务器内部错误',
      message: error.message 
    })
  }
}