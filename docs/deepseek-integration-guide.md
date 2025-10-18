# DeepSeek集成指南

## 概述

本文档详细说明如何将DeepSeek AI集成到诗词分析平台的AI助手中。

## 1. 环境配置

### 1.1 获取DeepSeek API密钥

1. 访问 [DeepSeek官网](https://www.deepseek.com/)
2. 注册账号并获取API密钥
3. 在n8n环境中配置API密钥

### 1.2 环境变量配置

在项目的`.env`文件中添加：

```env
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

在n8n环境中添加：
- `DEEPSEEK_API_KEY`: 您的DeepSeek API密钥

## 2. n8n工作流部署

### 2.1 导入工作流

1. 打开n8n管理界面
2. 点击"导入工作流"
3. 选择 `n8n-deepseek-poem-assistant-workflow.json` 文件
4. 配置Supabase连接凭据

### 2.2 工作流配置

**Webhook配置：**
- 路径：`/api/deepseek-chat`
- 方法：POST

**DeepSeek API节点配置：**
- API端点：`https://api.deepseek.com/v1/chat/completions`
- 模型：`deepseek-chat`
- 最大Token：2000
- 温度：0.7

## 3. 前端集成

### 3.1 修改AI助手组件

更新 `src/components/AI/AIChatAssistant.vue` 中的消息发送逻辑：

```typescript
// 替换原有的模拟回复
const sendMessageToDeepSeek = async (message: string) => {
  try {
    const response = await fetch('/api/deepseek-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        conversationId: currentConversationId.value,
        userId: userStore.user?.id
      })
    })
    
    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    throw error
  }
}
```

### 3.2 添加错误处理

```typescript
const handleDeepSeekError = (error: any) => {
  if (error.message.includes('API密钥')) {
    return 'DeepSeek服务配置错误，请联系管理员'
  } else if (error.message.includes('网络')) {
    return '网络连接失败，请检查网络设置'
  } else {
    return 'AI服务暂时不可用，请稍后重试'
  }
}
```

## 4. API端点配置

### 4.1 Netlify Functions配置

创建 `netlify/functions/deepseek-chat.js`:

```javascript
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  try {
    const body = JSON.parse(event.body)
    
    // 调用n8n webhook
    const n8nResponse = await fetch(process.env.N8N_DEEPSEEK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    const data = await n8nResponse.json()
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
```

## 5. 测试验证

### 5.1 功能测试

测试以下场景：
1. 诗词解析功能
2. 诗人介绍功能
3. 一般对话功能
4. 错误处理机制

### 5.2 性能测试

- 响应时间：目标 < 3秒
- 并发用户：支持50+并发
- 错误率：< 1%

## 6. 监控和维护

### 6.1 监控指标

- API调用成功率
- 平均响应时间
- Token使用量
- 错误类型统计

### 6.2 维护任务

- 定期检查API密钥有效期
- 监控使用量避免超额
- 更新系统提示词优化效果

## 7. 故障排除

### 7.1 常见问题

**问题1：API调用返回401错误**
- 原因：API密钥无效或过期
- 解决：检查并更新API密钥

**问题2：响应时间过长**
- 原因：网络延迟或API限流
- 解决：优化提示词，减少Token使用

**问题3：返回内容不符合预期**
- 原因：系统提示词需要优化
- 解决：调整系统提示词，增加具体指导

## 8. 成本优化

### 8.1 Token优化策略

1. 精简系统提示词
2. 设置合理的max_tokens限制
3. 使用缓存减少重复调用

### 8.2 使用量监控

- 设置每日使用限额
- 监控Token消耗趋势
- 优化提示词减少不必要调用

## 总结

通过以上步骤，您可以成功将DeepSeek集成到诗词分析平台的AI助手中，为用户提供专业的诗词解析服务。