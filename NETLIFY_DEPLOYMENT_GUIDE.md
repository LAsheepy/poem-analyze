# Netlify 部署指南

## 环境变量配置

在 Netlify 部署时，需要在项目设置中配置以下环境变量：

### 必需的环境变量
- `DEEPSEEK_API_KEY` - DeepSeek API密钥
- `VITE_SUPABASE_URL` - Supabase项目URL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥

### 可选的环境变量
- `VITE_N8N_WEBHOOK_URL` - n8n webhook URL（如果使用n8n）
- `VITE_USE_N8N` - 是否使用n8n（true/false）

## 部署步骤

1. **连接GitHub仓库**
   - 登录Netlify
   - 选择"New site from Git"
   - 连接你的GitHub仓库

2. **配置构建设置**
   - 构建命令: `npm run build`
   - 发布目录: `dist`
   - Node版本: 18

3. **配置环境变量**
   - 在站点设置中找到"Environment variables"
   - 添加上述环境变量

4. **部署**
   - Netlify会自动检测netlify.toml配置
   - 部署完成后即可访问

## 函数配置

项目包含一个Netlify函数：
- `netlify/functions/deepseek-chat.js` - AI聊天接口

函数会自动部署到 `/.netlify/functions/deepseek-chat`

## 注意事项

- 确保环境变量正确配置
- 检查构建日志是否有错误
- 函数可能需要几秒钟冷启动时间