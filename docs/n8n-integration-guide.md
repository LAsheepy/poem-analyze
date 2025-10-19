# n8n工作流集成指南

## 概述

本指南介绍如何将诗词分析助手的AI聊天功能与n8n工作流集成，实现更灵活的AI对话处理。

## 功能特点

- **双模式支持**: 可在DeepSeek API和n8n工作流之间切换
- **无缝集成**: 无需修改代码即可切换服务模式
- **配置灵活**: 支持Webhook URL和API密钥配置
- **连接测试**: 内置连接测试功能确保配置正确

## 配置步骤

### 1. 准备n8n工作流

1. 在n8n中创建新的工作流
2. 添加Webhook节点作为触发器
3. 配置AI服务节点（如OpenAI、DeepSeek等）
4. 添加响应节点返回结果

### 2. 获取Webhook URL

1. 在n8n工作流中部署Webhook节点
2. 复制Webhook URL（格式如：`https://your-n8n.com/webhook/your-id`）

### 3. 配置应用

1. 复制`.env.example`为`.env`
2. 修改以下配置：

```env
# n8n工作流配置
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
VITE_N8N_API_KEY=your_n8n_api_key_here  # 可选，如果需要认证
VITE_USE_N8N=true  # 设置为true启用n8n模式
```

### 4. 在界面中配置

1. 启动应用并进入AI聊天页面
2. 点击"服务模式"切换到n8n工作流
3. 点击"配置n8n"按钮
4. 输入Webhook URL和API密钥（可选）
5. 点击"测试连接"验证配置
6. 点击"保存配置"

## n8n工作流示例

### 基础AI聊天工作流

```json
{
  "nodes": [
    {
      "parameters": {
        "path": "chat",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "parameters": {
        "functionCode": "const input = $input.first().json;\nreturn [{ json: { message: input.message } }];"
      },
      "name": "处理输入",
      "type": "n8n-nodes-base.function"
    },
    {
      "parameters": {
        "service": "openAi",
        "operation": "createChatMessage",
        "model": "gpt-3.5-turbo",
        "prompt": "={{ $json.message }}",
        "options": {}
      },
      "name": "OpenAI",
      "type": "n8n-nodes-base.openAi"
    },
    {
      "parameters": {
        "functionCode": "const response = $input.first().json;\nreturn [{ json: { response: response.choices[0].message.content } }];"
      },
      "name": "处理响应",
      "type": "n8n-nodes-base.function"
    },
    {
      "parameters": {},
      "name": "响应Webhook",
      "type": "n8n-nodes-base.respondToWebhook"
    }
  ]
}
```

### 诗词专用工作流

可以创建专门处理诗词分析的工作流，包含：
- 诗词内容提取
- 诗人信息查询
- 文学分析处理
- 格式化输出

## 响应格式要求

n8n工作流需要返回以下格式的JSON响应：

```json
{
  "response": "AI回复内容",
  "conversationId": "对话ID",
  "userMessage": "用户原始消息",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 故障排除

### 连接测试失败

1. **检查URL格式**: 确保Webhook URL以`http://`或`https://`开头
2. **验证n8n服务**: 确认n8n实例正常运行
3. **检查网络连接**: 确保应用可以访问n8n服务
4. **查看n8n日志**: 检查n8n工作流执行日志

### 消息发送失败

1. **检查工作流配置**: 确认工作流正确部署
2. **验证响应格式**: 确保返回正确的JSON格式
3. **查看浏览器控制台**: 检查前端错误信息

### 服务切换问题

1. **检查环境变量**: 确认`.env`文件配置正确
2. **重启应用**: 修改环境变量后需要重启开发服务器
3. **清除浏览器缓存**: 清除本地存储的配置信息

## 最佳实践

### 安全性

1. **使用HTTPS**: 在生产环境中使用HTTPS协议
2. **API密钥保护**: 不要将API密钥提交到版本控制
3. **输入验证**: 在工作流中添加输入验证

### 性能优化

1. **缓存响应**: 对常见问题实现缓存机制
2. **异步处理**: 对耗时操作使用异步处理
3. **错误处理**: 实现完善的错误处理机制

### 监控和维护

1. **日志记录**: 记录重要的操作和错误
2. **性能监控**: 监控工作流的执行性能
3. **定期测试**: 定期测试工作流的可用性

## 扩展功能

### 自定义处理逻辑

可以在n8n工作流中添加自定义处理逻辑：
- 用户身份验证
- 对话历史管理
- 多轮对话处理
- 内容过滤和审核

### 集成其他服务

利用n8n的丰富连接器集成其他服务：
- 数据库存储对话记录
- 邮件通知重要对话
- 社交媒体分享
- 数据分析平台集成