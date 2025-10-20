# Vercel 部署说明

## 部署前准备

### 1. 环境变量配置
在 Vercel 项目中设置以下环境变量：

```
DEEPSEEK_API_KEY=您的DeepSeek API密钥
```

### 2. 部署步骤
1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## AI 功能配置

### DeepSeek API 模式（推荐）
- 默认启用 DeepSeek API 模式
- 通过 Vercel 函数 `/api/deepseek-chat` 代理请求
- 需要配置 `DEEPSEEK_API_KEY` 环境变量

### n8n 工作流模式
- 在 AI 聊天界面中可切换到 n8n 模式
- 需要配置正确的 n8n Webhook URL
- 在 `.env` 文件中设置 `VITE_USE_N8N=true` 可默认启用

## 故障排除

### AI 功能无法使用
1. 检查环境变量 `DEEPSEEK_API_KEY` 是否正确设置
2. 确认 n8n Webhook URL 配置正确（如果使用 n8n 模式）
3. 查看 Vercel 函数日志排查问题

### 部署错误
1. 确保 `package.json` 中的依赖正确
2. 检查 `vercel.json` 配置是否正确
3. 确认构建输出目录为 `dist`

## 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 如果需要测试 API 函数
npm run dev-with-proxy
```

## 文件结构
```
├── api/                    # Vercel 函数
│   ├── deepseek-chat.js   # DeepSeek API 代理
│   └── hello.js           # 测试函数
├── src/
│   ├── services/          # 服务层
│   │   ├── deepseekService.ts
│   │   ├── n8nService.ts
│   │   └── chatService.ts
│   └── components/AI/     # AI 相关组件
├── vercel.json            # Vercel 配置
└── package.json