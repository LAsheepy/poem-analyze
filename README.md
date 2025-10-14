# 诗韵星 (Rhyme Star) - AI驱动诗词解析平台

## 项目概述

一个基于Vue 3的AI驱动诗词解析平台，为古典诗词爱好者、学生和教师提供个性化解析支持和互动学习体验。

## 技术栈

- **前端框架**: Vue 3 + Composition API + TypeScript
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **UI组件**: Element Plus
- **构建工具**: Vite
- **AI集成**: Vercel AI SDK
- **样式**: SCSS + Tailwind CSS

## 项目结构

```
src/
├── components/          # 可复用组件
├── views/              # 页面组件
├── stores/             # Pinia状态管理
├── router/             # 路由配置
├── services/           # API服务
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── assets/             # 静态资源
└── styles/             # 全局样式
```

## 核心功能

### MVP版本功能
1. **用户解析助手**: AI驱动的个性化诗词解析
2. **教师管理界面**: 查看学生学习进度和AI互动记录
3. **诗词知识库**: RAG知识库集成
4. **实时聊天**: AI导师聊天交互

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

## 架构设计

基于L.I.G.H.T.架构模式：
- **L** (Lean Backend): 轻量后端API
- **I** (Intelligent Frontend): 智能前端应用
- **G** (Git-driven): Git驱动工作流
- **H** (Hyper-scalable): 超大规模数据层
- **T** (Templated AI): 模板化AI智能体

## 开发规范

- 使用Composition API和setup语法糖
- 遵循TypeScript严格模式
- 组件采用单文件组件(SFC)格式
- 实现响应式设计和移动端适配
- 编写详细的代码注释和错误处理