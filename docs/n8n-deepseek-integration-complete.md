# n8n + DeepSeek 完整集成指南

## 概述

本文档提供完整的n8n工作流集成DeepSeek AI到诗词分析平台的详细方案。

## 1. 架构设计

### 1.1 整体架构

```
用户前端 (Vue.js)
    ↓ (HTTP请求)
Netlify Functions (/api/deepseek-chat)
    ↓ (可选: 通过n8n Webhook)
n8n工作流 (DeepSeek处理逻辑)
    ↓ (HTTP请求)
DeepSeek API (AI服务)
    ↓ (响应)
n8n → Netlify Functions → 用户前端
```

### 1.2 两种集成方案

**方案一：直接集成（推荐）**
- 前端 → Netlify Functions → DeepSeek API
- 简单直接，响应快速
- 适合简单的AI对话场景

**方案二：通过n8n工作流**
- 前端 → Netlify Functions → n8n Webhook → DeepSeek API
- 功能更强大，支持复杂逻辑
- 适合需要工作流处理的场景

## 2. 方案一：直接集成（已实现）

### 2.1 文件结构

```
netlify/functions/deepseek-chat.js    # Netlify函数处理API调用
src/services/deepseekService.ts       # 前端服务层
src/components/AI/AIChatAssistant.vue # AI助手组件
```

### 2.2 配置步骤

1. **环境变量配置**
   ```bash
   # Netlify环境变量
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

2. **部署到Netlify**
   - 连接GitHub仓库
   - 设置构建命令：`npm run build`
   - 设置发布目录：`dist`
   - 配置环境变量

### 2.3 API调用流程

1. 用户发送消息 → `AIChatAssistant.vue`
2. 调用 `deepseekService.sendMessage()`
3. 请求 `/.netlify/functions/deepseek-chat`
4. Netlify函数调用DeepSeek API
5. 返回响应给前端

## 3. 方案二：n8n工作流集成

### 3.1 n8n工作流配置

**工作流文件：** `n8n-deepseek-poem-assistant-workflow.json`

**主要节点：**
1. **Webhook节点**：接收前端请求
2. **函数节点**：验证和处理输入
3. **HTTP请求节点**：调用DeepSeek API
4. **函数节点**：处理AI响应
5. **Supabase节点**：记录对话到数据库
6. **实时通知节点**：推送实时更新

### 3.2 n8n环境配置

1. **安装n8n**（如果尚未安装）
   ```bash
   npm install -g n8n
   # 或使用Docker
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

2. **配置环境变量**
   ```bash
   # n8n环境变量
   DEEPSEEK_API_KEY=your_deepseek_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **导入工作流**
   - 打开n8n界面 (http://localhost:5678)
   - 导入 `n8n-deepseek-poem-assistant-workflow.json`
   - 配置Webhook URL和API密钥

### 3.3 修改Netlify函数以使用n8n

创建新的Netlify函数 `netlify/functions/n8n-deepseek-chat.js`：

```javascript
const fetch = require('node-fetch')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  try {
    const body = JSON.parse(event.body)
    
    // 调用n8n webhook
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    if (!n8nResponse.ok) {
      throw new Error(`n8n请求失败: ${n8nResponse.statusText}`)
    }
    
    const data = await n8nResponse.json()
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
```

## 4. DeepSeek API使用指南

### 4.1 API端点
- **基础URL**: `https://api.deepseek.com/v1`
- **聊天完成**: `/chat/completions`

### 4.2 请求参数
```javascript
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "系统提示词"},
    {"role": "user", "content": "用户消息"}
  ],
  "max_tokens": 2000,
  "temperature": 0.7,
  "top_p": 0.9
}
```

### 4.3 系统提示词优化

**诗词分析专用提示词：**
```
你是一个专业的诗词分析AI助手，专门帮助用户理解古典诗词。请用中文回答，回答要专业、详细且富有文化内涵。

核心能力：
1. 解析诗词的意境和情感
2. 分析诗词的艺术特色和修辞手法
3. 介绍诗人的生平和创作背景
4. 比较不同诗词的异同
5. 提供诗词创作建议

回答要求：
- 保持专业性和准确性
- 语言优美，富有文学气息
- 分层解析：字词→意象→整体意境
- 结合历史背景和文化内涵
```

## 5. 前端集成代码

### 5.1 服务层 (`deepseekService.ts`)

```typescript
class DeepSeekService {
  async sendMessage(message: string, conversationId: string): Promise<string> {
    const response = await fetch('/.netlify/functions/deepseek-chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId })
    })
    const data = await response.json()
    return data.response
  }
  
  async analyzePoem(poem: string, poet?: string): Promise<string> {
    // 专用诗词分析方法
  }
}
```

### 5.2 组件集成 (`AIChatAssistant.vue`)

```vue
<script setup>
const sendMessage = async () => {
  const aiResponse = await deepSeekService.sendMessage(userMessage, conversationId)
  // 更新聊天界面
}
</script>
```

## 6. 测试和验证

### 6.1 功能测试
```bash
# 测试诗词解析
curl -X POST https://your-app.netlify.app/.netlify/functions/deepseek-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "解析李白的《静夜思》"}'
```

### 6.2 性能监控
- 响应时间监控
- 错误率统计
- Token使用量跟踪

## 7. 故障排除

### 7.1 常见问题

**API密钥错误**
```bash
# 检查环境变量
echo $DEEPSEEK_API_KEY
```

**CORS问题**
- 确保Netlify函数设置了正确的CORS头
- 检查前端请求URL

**网络超时**
- 增加超时设置
- 优化提示词减少Token使用

### 7.2 日志调试

**Netlify函数日志**
```javascript
console.log('请求数据:', event.body)
console.log('API响应:', responseData)
```

**n8n工作流调试**
- 使用n8n的调试模式
- 检查每个节点的输出

## 8. 最佳实践

### 8.1 安全实践
- 不要在客户端暴露API密钥
- 使用环境变量管理敏感信息
- 实施请求频率限制

### 8.2 性能优化
- 缓存常用响应
- 优化系统提示词
- 实施流式传输（如果支持）

### 8.3 成本控制
- 监控API使用量
- 设置使用限额
- 优化提示词减少Token消耗

## 9. 部署清单

### 9.1 环境准备
- [ ] 获取DeepSeek API密钥
- [ ] 配置Netlify环境变量
- [ ] 设置n8n环境（如果使用方案二）

### 9.2 代码部署
- [ ] 部署到Netlify
- [ ] 测试API端点
- [ ] 验证前端功能

### 9.3 监控设置
- [ ] 配置错误监控
- [ ] 设置性能监控
- [ ] 实施使用量跟踪

## 总结

通过本指南，您可以成功将DeepSeek AI集成到诗词分析平台中。方案一提供简单直接的集成方式，方案二通过n8n工作流提供更强大的功能扩展能力。根据您的具体需求选择合适的方案。

**推荐使用方案一**进行快速部署，如果需要复杂的工作流处理，再考虑升级到方案二。