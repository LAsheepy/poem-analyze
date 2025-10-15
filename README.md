# 诗词分析平台 (Poem Analysis Platform)

一个基于Vue 3 + TypeScript + Supabase的现代化诗词学习与分析平台。

## 🚀 功能特性

### 核心功能
- **诗词库管理** - 浏览、搜索、分类经典诗词
- **智能解析** - AI驱动的诗词深度解析
- **AI助手** - 智能对话，解答诗词相关问题
- **学习进度** - 个人学习轨迹和进度跟踪
- **用户认证** - 完整的注册登录系统

### 技术特色
- **现代化前端** - Vue 3 + Composition API + TypeScript
- **响应式设计** - 支持桌面端和移动端
- **实时数据** - Supabase后端服务
- **组件化开发** - Element Plus UI组件库
- **类型安全** - 完整的TypeScript类型定义

## 🛠️ 技术栈

### 前端技术
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理库

### 后端服务
- **Supabase** - 开源Firebase替代品
- **PostgreSQL** - 关系型数据库
- **实时订阅** - WebSocket实时数据同步
- **认证系统** - 内置用户认证管理

## 📦 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Layout/         # 布局组件
│   ├── Poem/           # 诗词相关组件
│   ├── AI/             # AI功能组件
│   └── Auth/           # 认证组件
├── views/              # 页面视图
├── stores/             # 状态管理
├── services/           # 服务层
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
├── router/             # 路由配置
└── assets/             # 静态资源
```

## 🚀 快速开始

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
```

## ⚙️ 环境配置

创建 `.env` 文件并配置Supabase连接信息：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 页面功能

### 首页 (Dashboard)
- 学习进度概览
- 最近学习记录
- 个性化推荐

### 诗词库 (Poems)
- 诗词浏览和搜索
- 朝代和难度筛选
- 分页显示

### 诗词解析 (Analysis)
- 逐句解析
- 意象分析
- 作者信息
- 历史背景

### AI助手 (Chat)
- 智能对话
- 诗词问答
- 学习指导

### 个人中心 (Profile)
- 用户信息管理
- 学习统计
- 兴趣标签

## 🔐 用户认证

### 认证方式
- 邮箱密码登录/注册
- GitHub OAuth登录
- Google OAuth登录

### 权限控制
- 路由守卫保护
- 用户状态管理
- 会话持久化

## 🎨 设计特色

### UI/UX设计
- **现代化界面** - 简洁美观的设计风格
- **响应式布局** - 适配各种屏幕尺寸
- **交互友好** - 流畅的用户体验
- **主题定制** - 可配置的颜色主题

### 用户体验
- **快速加载** - Vite构建优化
- **离线支持** - PWA特性
- **键盘导航** - 无障碍访问支持
- **错误处理** - 友好的错误提示

## 🗃️ 数据库设计

### 核心数据表
- **users** - 用户信息表
- **poems** - 诗词数据表
- **analyses** - 解析记录表
- **conversations** - 对话记录表
- **user_progress** - 学习进度表

### 数据关系
- 用户与诗词的多对多关系
- 实时数据同步
- 自动备份和恢复

## 🚀 部署指南

### 本地部署
```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm run preview
```

### 云部署
- **Vercel** - 静态站点部署
- **Netlify** - 自动化部署
- **Supabase** - 一体化部署

## 🤝 贡献指南

### 开发流程
1. Fork项目
2. 创建功能分支
3. 提交代码变更
4. 创建Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循TypeScript最佳实践
- 编写清晰的注释文档

## 📄 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 🙏 致谢

感谢以下开源项目的支持：
- Vue.js团队
- Supabase团队
- Element Plus团队
- Vite团队

---

**诗词分析平台** - 让诗词学习变得更加智能和有趣！