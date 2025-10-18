# Supabase 集成配置指南

## 概述

诗韵星平台使用 Supabase 作为后端服务，提供用户认证、数据存储和实时功能。

## 环境配置

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息：
   - **Name**: `rhyme-star` (或自定义名称)
   - **Database Password**: 设置安全的数据库密码
   - **Region**: 选择离用户最近的区域（如 `ap-southeast-1`）
4. 点击 "Create new project"

### 2. 获取环境变量

项目创建完成后，在项目设置中获取以下信息：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 配置环境变量

创建 `.env` 文件（基于 `.env.example`）：

```env
# 应用配置
VITE_APP_TITLE=诗韵星
VITE_APP_DESCRIPTION=AI驱动诗词解析平台

# Supabase 配置
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key

# 开发环境配置
VITE_DEV_SERVER_PORT=3000
```

## 数据库初始化

### 1. 运行 SQL 脚本

在 Supabase Dashboard 的 SQL Editor 中运行 `scripts/init-database.sql` 脚本：

1. 进入项目 Dashboard
2. 点击左侧菜单的 "SQL Editor"
3. 复制 `scripts/init-database.sql` 的内容
4. 点击 "Run" 执行脚本

### 2. 验证表结构

执行完成后，检查以下表是否创建成功：

- `users` - 用户表
- `poems` - 诗词表  
- `poem_analyses` - 诗词解析表
- `learning_records` - 学习记录表
- `ai_conversations` - AI对话表
- `ai_messages` - AI消息表

### 3. 配置认证设置

在 Supabase Dashboard 中配置认证：

1. 进入 "Authentication" → "Settings"
2. 配置以下设置：
   - **Site URL**: `http://localhost:3000` (开发环境)
   - **Enable Email Auth**: 开启
   - **Enable Google Auth**: 可选开启

## 功能集成

### 用户认证

平台支持以下认证方式：

1. **邮箱密码认证**
2. **第三方登录**（可选配置）

### 数据存储

集成以下数据表：

- **用户数据**: 学习进度、偏好设置
- **诗词库**: 经典诗词内容
- **学习记录**: 用户学习历史
- **AI对话**: 智能助手交互记录

### 实时功能

Supabase 提供实时数据同步：

- 实时更新学习进度
- 实时聊天消息同步
- 实时统计数据显示

## 开发指南

### 1. 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入实际的 Supabase 配置

# 启动开发服务器
npm run dev
```

### 2. 生产部署

1. 配置生产环境变量
2. 构建应用：`npm run build`
3. 部署到 Netlify 等平台

## 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量配置
   - 验证网络连接
   - 确认 Supabase 项目状态

2. **认证错误**
   - 检查认证配置
   - 验证重定向 URL
   - 查看浏览器控制台错误信息

3. **数据库权限错误**
   - 检查 RLS 策略
   - 验证表权限设置
   - 查看 Supabase 日志

### 调试工具

使用 Supabase Dashboard 的以下工具：

- **Logs**: 查看 API 请求日志
- **Auth**: 监控用户认证状态
- **Database**: 实时查看数据变化

## 安全配置

### 1. RLS 策略

所有表都启用了行级安全策略：

- 用户只能访问自己的数据
- 诗词数据对所有认证用户可见
- 严格的权限控制确保数据安全

### 2. 环境安全

- 不要在客户端暴露服务端密钥
- 使用环境变量管理敏感信息
- 定期轮换 API 密钥

## 扩展功能

### 1. 自定义函数

可以创建 PostgreSQL 函数来实现复杂业务逻辑：

```sql
-- 示例：计算用户学习统计
CREATE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE(total_poems INTEGER, total_time INTEGER, avg_score NUMERIC)
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        COUNT(DISTINCT poem_id) as total_poems,
        SUM(time_spent) as total_time,
        AVG(score) as avg_score
    FROM learning_records 
    WHERE user_id = $1;
END;
$$ LANGUAGE plpgsql;
```

### 2. 实时订阅

利用 Supabase 的实时功能：

```typescript
// 订阅用户学习进度更新
const subscription = supabase
  .channel('user-progress')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'users' },
    (payload) => {
      console.log('学习进度更新:', payload.new)
    }
  )
  .subscribe()
```

## 支持与资源

- [Supabase 文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [社区支持](https://github.com/supabase/supabase/discussions)

---

**注意**: 在生产环境部署前，请确保完成所有安全配置和测试。