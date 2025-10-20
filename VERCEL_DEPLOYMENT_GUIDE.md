# Vercel 部署指南

## 环境变量配置

在 Vercel 部署时，需要在项目设置中配置以下环境变量：

### 必需的环境变量
```
DEEPSEEK_API_KEY=sk-
VITE_DEEPSEEK_API_KEY=sk-
VITE_SUPABASE_URL=https://rnvpihtnbtltaulxsunc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudnBpaHRuYnRsdGF1bHhzdW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE0OTcsImV4cCI6MjA3NjA4NzQ5N30.URaYNJGKCMz1Lkfnhf7c0f8XR0Ip1t3aYIy41pAo08k
```

### 可选的环境变量
```
VITE_APP_TITLE=诗韵星
VITE_APP_DESCRIPTION=AI驱动诗词解析平台
VITE_N8N_WEBHOOK_URL=https://anranzhou.app.n8n.cloud/webhook/ai-chat
VITE_USE_N8N=false
VITE_API_BASE_URL=/api
```

## 部署步骤

1. **在 Vercel 控制台配置环境变量**
   - 进入项目设置 → Environment Variables
   - 添加上述所有环境变量

2. **重新部署项目**
   - 在 Vercel 控制台选择项目
   - 点击 "Redeploy" 或等待自动重新部署

3. **验证部署**
   - 访问部署后的域名
   - 检查 API 端点是否正常工作：`/api/deepseek-chat`

## 常见问题解决

### 1. API 返回 500 错误
- 检查 `DEEPSEEK_API_KEY` 是否正确配置
- 确保 API 密钥有效且未过期

### 2. 前端无法加载
- 检查 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 是否正确
- 确保 Supabase 项目状态正常

### 3. 构建失败
- 检查 Node.js 版本兼容性
- 确保所有依赖正确安装

## 本地测试部署配置

在部署前，可以使用以下命令测试构建：
```bash
npm run build
```

如果构建成功，说明项目配置正确。