# n8n AI 助手集成指南

## 概述

本文档介绍如何将 n8n AI 助手工作流集成到诗词解析平台中，实现智能对话功能。

## 工作流文件

项目包含两个 n8n 工作流文件：
- `n8n-ai-chat-assistant-workflow.json` - AI 聊天助手工作流
- `n8n-poem-ai-assistant-workflow.json` - 诗词专用 AI 助手工作流

## 部署步骤

### 1. 导入工作流到 n8n

1. 登录您的 n8n 实例
2. 点击 "Import from file" 按钮
3. 选择项目中的工作流 JSON 文件进行导入
4. 重复以上步骤导入两个工作流

### 2. 配置环境变量

在 n8n 中配置以下环境变量：

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 获取 Webhook URL

1. 在 n8n 中激活工作流
2. 复制 Webhook 节点的 URL
3. 更新项目中的环境变量

### 4. 配置项目环境变量

在项目的 `.env` 文件中添加：

```bash
# n8n工作流配置
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-workflow-id
```

## 工作流说明

### AI 聊天助手工作流

这个工作流提供通用的 AI 对话功能：

1. **Webhook 节点** - 接收来自前端的请求
2. **处理用户输入** - 解析请求数据
3. **OpenAI API 调用** - 调用 GPT 模型生成响应
4. **处理 AI 响应** - 格式化响应数据
5. **响应 Webhook** - 返回结果给前端
6. **记录对话（可选）** - 将对话保存到 Google Sheets

### 诗词专用 AI 助手工作流

这个工作流专门针对诗词解析优化：

- 包含诗词特定的提示词模板
- 支持不同类型的诗词分析（字词、意象、整体等）
- 提供专业的中文诗词解析

## 集成代码

项目已经集成了 n8n 服务：

### 主要文件

- `src/services/n8nService.ts` - n8n 服务封装
- `src/services/supabaseService.ts` - 更新后的 AI 服务
- `.env` - 环境变量配置

### 使用方法

```typescript
import { n8nService } from '@/services/n8nService'

// 发送普通消息
const response = await n8nService.sendMessage('你好，请帮我解析一首诗')

// 诗词解析
const analysis = await n8nService.analyzePoem('床前明月光，疑是地上霜。', 'overall')

// 学习建议
const suggestions = await n8nService.getLearningSuggestions('中级', ['唐诗', '宋词'])
```

## 测试工作流

### 1. 本地测试

```bash
npm run dev
```

访问应用并测试 AI 聊天功能。

### 2. n8n 工作流测试

1. 在 n8n 中手动触发工作流
2. 使用测试数据：
   ```json
   {
     "message": "请解析李白的《静夜思》",
     "conversationId": "test-123"
   }
   ```

### 3. 集成测试

1. 确保前端能正确调用 n8n webhook
2. 验证响应数据格式正确
3. 检查错误处理机制

## 故障排除

### 常见问题

1. **Webhook 404 错误**
   - 检查 n8n 工作流是否激活
   - 验证 webhook URL 是否正确

2. **OpenAI API 错误**
   - 检查 API 密钥是否正确配置
   - 验证 API 配额是否充足

3. **响应超时**
   - 调整 n8n 工作流超时设置
   - 优化 OpenAI 调用参数

4. **CORS 问题**
   - 配置 n8n CORS 设置
   - 检查前端请求头

### 日志查看

1. 在 n8n 中查看工作流执行日志
2. 检查浏览器开发者工具的网络请求
3. 查看 Supabase 数据库日志

## 性能优化建议

1. **缓存策略** - 对常见诗词解析结果进行缓存
2. **批量处理** - 对多个请求进行批量处理
3. **限流控制** - 实现 API 调用频率限制
4. **错误重试** - 添加自动重试机制

## 安全考虑

1. **输入验证** - 对所有用户输入进行验证
2. **API 密钥保护** - 不要在前端暴露 API 密钥
3. **请求限制** - 防止滥用和 DDoS 攻击
4. **数据加密** - 确保敏感数据加密传输

## 后续扩展

1. **多模型支持** - 集成其他 AI 模型
2. **自定义提示词** - 允许用户自定义 AI 行为
3. **语音交互** - 添加语音输入输出支持
4. **多语言支持** - 扩展多语言诗词解析