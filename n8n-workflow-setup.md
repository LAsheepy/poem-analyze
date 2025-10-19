# n8n工作流集成方案二

## 快速设置步骤

### 1. 安装n8n
```bash
npm install -g n8n
n8n start
```

### 2. 配置工作流
访问 http://localhost:5678 导入工作流文件：
- `n8n-deepseek-poem-assistant-workflow.json`

### 3. 设置环境变量
在n8n中配置：
- `DEEPSEEK_API_KEY`: 您的DeepSeek密钥

### 4. 修改前端调用
将前端API调用改为n8n Webhook：
```typescript
private baseURL = 'http://localhost:5678/webhook/deepseek-chat'
```

### 5. 部署n8n
- 使用Docker部署到服务器
- 或使用n8n.cloud云服务

## 优势
✅ 更稳定的API调用
✅ 可视化工作流管理  
✅ 更好的错误处理
✅ 支持复杂逻辑

立即切换到方案二，解决当前Netlify函数问题！