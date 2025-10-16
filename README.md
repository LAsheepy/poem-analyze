# 诗韵星 - AI驱动诗词解析平台

一个现代化的诗词学习平台，结合AI技术提供智能解析和个性化学习体验。

## 🚀 功能特性

### 核心功能
- **智能诗词解析** - AI驱动的深度诗词分析
- **个性化学习** - 根据用户水平推荐诗词
- **AI对话助手** - 智能问答和讨论
- **学习进度跟踪** - 可视化学习数据
- **多维度分析** - 字词、意象、背景全方位解析

### 技术特色
- **现代化前端** - Vue 3 + TypeScript + Element Plus
- **实时数据库** - Supabase后端服务
- **响应式设计** - 支持多端访问
- **类型安全** - 完整的TypeScript支持
- **性能优化** - 代码分割和懒加载

## 📋 项目结构

```
poem-analyze/
├── src/
│   ├── components/     # 可复用组件
│   │   ├── AI/         # AI相关组件
│   │   ├── Auth/       # 认证组件
│   │   ├── Layout/     # 布局组件
│   │   ├── Poem/       # 诗词组件
│   │   └── User/       # 用户组件
│   ├── lib/            # 工具库
│   ├── router/         # 路由配置
│   ├── services/       # 服务层
│   ├── stores/         # 状态管理
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   └── views/          # 页面组件
├── supabase/           # 数据库迁移脚本
└── docs/              # 文档
```

## 🛠️ 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
npm run type-check
```

## 🔧 配置说明

### 环境变量
复制 `.env.example` 为 `.env` 并配置：

```env
# 应用配置
VITE_APP_TITLE=诗韵星
VITE_APP_DESCRIPTION=AI驱动诗词解析平台

# Supabase配置
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# 开发配置
VITE_DEV_SERVER_PORT=3000
```

### Supabase设置
1. 创建Supabase项目
2. 运行数据库迁移脚本
3. 配置环境变量
4. 测试连接

详细设置请参考 [Supabase配置指南](./docs/SUPABASE_SETUP.md)

## 📊 数据库设计

项目使用Supabase作为后端，包含以下核心表：

- **users** - 用户信息和学习进度
- **poems** - 诗词内容和元数据
- **poem_analyses** - 诗词解析结果
- **learning_records** - 学习记录
- **ai_conversations** - AI对话会话
- **ai_messages** - AI对话消息

详细数据库设计请参考 [数据库设置指南](./docs/DATABASE_SETUP.md)

## 🚀 部署指南

### Netlify部署（推荐）
1. 连接Git仓库到Netlify
2. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
3. 设置环境变量
4. 部署完成

### Vercel部署
1. 导入项目到Vercel
2. 自动检测Vue.js项目
3. 配置环境变量
4. 部署完成

### 其他平台
项目支持所有支持静态部署的平台：
- GitHub Pages
- GitLab Pages
- 阿里云OSS
- 腾讯云COS

## 🎯 使用指南

### 用户注册登录
1. 访问应用首页
2. 注册新账户或登录
3. 完善个人信息

### 诗词学习
1. 浏览诗词库
2. 选择感兴趣的诗词
3. 查看AI解析结果
4. 记录学习笔记

### AI对话
1. 进入AI助手页面
2. 开始新对话或继续历史对话
3. 提问关于诗词的问题
4. 获取个性化解析

### 学习跟踪
1. 查看个人仪表板
2. 跟踪学习进度
3. 查看学习统计
4. 设置学习目标

## 🔍 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 遵循Vue 3组合式API规范
- 使用TypeScript确保类型安全
- 组件采用单文件组件(SFC)格式

### 状态管理
使用Pinia进行状态管理：
- 用户状态：认证信息、个人资料
- AI状态：对话历史、当前会话
- 应用状态：全局配置、主题设置

### API集成
- 使用Supabase JavaScript客户端
- 统一的错误处理机制
- 类型安全的API调用

## 🤝 贡献指南

欢迎贡献代码！请遵循以下流程：

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 基础诗词浏览功能
- AI对话助手
- 用户认证系统
- 学习进度跟踪

## 📄 许可证

本项目采用MIT许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- Vue.js - 渐进式JavaScript框架
- Supabase - 开源Firebase替代品
- Element Plus - Vue 3组件库
- 所有贡献者和用户

## 📞 支持与反馈

如有问题或建议，请通过以下方式联系：

- 提交Issue
- 发送邮件
- 加入讨论群

---

**诗韵星** - 让诗词学习更智能、更有趣！