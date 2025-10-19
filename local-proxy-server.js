import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// 简单的DeepSeek代理
app.post('/api/deepseek-chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' });
    }

    // 直接从环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DeepSeek API密钥未配置' });
    }

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
            content: '你是一个专业的诗词AI助手，专门帮助用户理解古典诗词和文化。请用中文回答，回答要专业、详细且富有文化内涵。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      response: data.choices[0].message.content,
      conversationId: `conv_${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('代理服务器错误:', error);
    res.status(500).json({ 
      error: '服务器内部错误',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`本地代理服务器运行在 http://localhost:${PORT}`);
  console.log('确保已设置 DEEPSEEK_API_KEY 环境变量');
});