# 方案一部署指南（直接集成）

## 快速部署步骤

### 1. 获取DeepSeek API密钥
1. 访问 [DeepSeek官网](https://www.deepseek.com/)
2. 注册账号并获取API密钥
3. 记录您的API密钥

### 2. 部署到Netlify

#### 方法一：通过GitHub部署（推荐）
1. 将代码推送到GitHub仓库
2. 登录 [Netlify](https://netlify.com)
3. 点击"New site from Git"
4. 选择您的GitHub仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击"Deploy site"

#### 方法二：手动拖拽部署
1. 在本地运行：`npm run build`
2. 将生成的`dist`文件夹拖拽到Netlify部署区域

### 3. 配置环境变量
在Netlify仪表板中：
1. 进入 Site settings > Environment variables
2. 添加环境变量：
   ```
   DEEPSEEK_API_KEY=您的DeepSeek API密钥
   ```

### 4. 验证部署
1. 访问您的Netlify站点URL
2. 测试AI助手功能：
   - 输入"解析李白的《静夜思》"
   - 检查是否获得专业解析

## 本地开发测试

### 1. 环境设置
```bash
# 克隆项目
git clone <your-repo-url>
cd poem-analyze

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local

# 编辑.env.local，添加您的API密钥
DEEPSEEK_API_KEY=your_api_key_here
```

### 2. 本地运行
```bash
# 开发模式
npm run dev

# 访问 http://localhost:3005
# 测试AI助手功能
```

### 3. 构建测试
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 故障排除

### 常见问题

**API调用失败**
- 检查环境变量是否正确设置
- 验证DeepSeek API密钥是否有效
- 查看Netlify函数日志

**CORS错误**
- 确保Netlify函数设置了正确的CORS头
- 检查前端请求URL是否正确

**构建失败**
- 检查Node.js版本（推荐18+）
- 运行`npm install`重新安装依赖

### 日志查看
在Netlify仪表板中：
- 进入 Deploys > 选择最新部署 > Functions logs
- 查看deepseek-chat函数的日志

## 功能验证清单

- [ ] 基础页面加载正常
- [ ] AI助手组件显示正常
- [ ] 可以发送消息
- [ ] 收到DeepSeek的响应
- [ ] 诗词解析功能正常
- [ ] 诗人介绍功能正常
- [ ] 错误处理正常

## 性能优化建议

### 1. 缓存优化
- 启用Netlify的CDN缓存
- 设置适当的缓存头

### 2. 代码优化
- 使用代码分割减少初始加载大小
- 优化图片和静态资源

### 3. API优化
- 实施请求频率限制
- 使用流式响应（如果支持）

## 安全注意事项

1. **API密钥保护**
   - 不要在客户端代码中硬编码API密钥
   - 使用环境变量管理敏感信息
   - 定期轮换API密钥

2. **请求验证**
   - 实施输入验证
   - 设置合理的超时时间
   - 监控异常请求模式

## 后续扩展

如果后续需要更复杂的功能，可以考虑升级到方案二（n8n工作流）：
- 数据库集成（对话记录）
- 实时通知
- 复杂的工作流逻辑
- 多AI模型路由

## 支持资源

- [DeepSeek API文档](https://platform.deepseek.com/api-docs/)
- [Netlify文档](https://docs.netlify.com/)
- [Vue.js文档](https://vuejs.org/guide/)

---

**部署成功标志**：当您可以在网站上正常使用AI助手进行诗词解析时，说明方案一已经成功部署！