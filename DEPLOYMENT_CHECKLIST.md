# Vercel 部署检查清单

## ✅ 已完成的任务

### 1. API 配置修复
- [x] 更新 `deepseekService.ts` 中的 API 端点从 `http://localhost:3005/api` 改为 `/api`
- [x] 添加 `VITE_API_BASE_URL=/api` 环境变量
- [x] 创建 Vercel 函数 `api/deepseek-chat.js`

### 2. n8n 工作流配置优化
- [x] 修复 n8n 连接测试逻辑，添加更好的错误处理
- [x] 默认禁用 n8n 模式 (`VITE_USE_N8N=false`)
- [x] 移除默认的 n8n Webhook URL

### 3. Vercel 配置文件
- [x] 创建 `vercel.json` 配置文件
- [x] 设置正确的路由和构建配置
- [x] 配置环境变量映射

### 4. 构建配置
- [x] 验证构建过程正常工作
- [x] 预览服务器启动成功

## 🔧 部署到 Vercel 的步骤

### 第一步：准备代码
```bash
# 确保所有更改已提交
git add .
git commit -m "修复 Vercel 部署配置"
git push origin main
```

### 第二步：Vercel 部署
1. 登录 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 在项目设置中配置环境变量：
   - **环境变量名称**: `DEEPSEEK_API_KEY`
   - **值**: 您的 DeepSeek API 密钥（以 `sk-` 开头）
4. 部署项目

### 第三步：验证功能
1. 访问部署的网站
2. 打开 AI 聊天界面
3. 测试 DeepSeek API 模式是否正常工作
4. 可选：配置 n8n 工作流模式

## 🐛 故障排除

### AI 功能无法使用
1. **检查环境变量**：确认 `DEEPSEEK_API_KEY` 在 Vercel 中正确设置
2. **查看函数日志**：在 Vercel 控制台检查 API 函数日志
3. **测试 API 端点**：直接访问 `/api/deepseek-chat` 端点测试

### n8n 模式问题
1. **检查 Webhook URL**：确保 n8n 工作流配置正确
2. **测试连接**：在 AI 聊天界面中测试 n8n 连接
3. **CORS 配置**：确保 n8n 允许来自您域名的请求

### 构建失败
1. **检查依赖**：确保所有依赖在 `package.json` 中正确声明
2. **构建日志**：查看 Vercel 构建日志中的错误信息
3. **路径配置**：确认 `vercel.json` 中的路径配置正确

## 📋 环境变量清单

### 必需的环境变量
```
DEEPSEEK_API_KEY=您的 DeepSeek API 密钥
```

### 可选的环境变量
```
VITE_N8N_WEBHOOK_URL=n8n Webhook URL（如果使用 n8n 模式）
VITE_USE_N8N=true/false（是否启用 n8n 模式）
```

## 🔄 切换 AI 服务模式

### DeepSeek API 模式（推荐）
- 默认启用
- 通过 Vercel 函数代理
- 响应速度快，稳定性好

### n8n 工作流模式
- 需要在 AI 聊天界面中手动启用
- 需要配置正确的 n8n Webhook URL
- 适合需要自定义工作流的场景

## 📞 支持
如果部署过程中遇到问题，请检查：
1. Vercel 部署日志
2. 浏览器开发者工具的控制台错误
3. API 函数的响应状态