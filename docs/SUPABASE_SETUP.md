# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com) 并登录
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **Name**: `poem-analyze` (或您喜欢的名称)
   - **Database Password**: 设置安全的数据库密码
   - **Region**: 选择离您最近的区域（如 `ap-southeast-1`）
4. 点击 "Create new project" 完成创建

## 2. 获取项目配置

项目创建完成后，在项目设置中获取以下信息：

1. 进入项目设置 → API
2. 复制以下信息到 `.env` 文件：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. 设置数据库表结构

### 方法一：使用 SQL 迁移脚本（推荐）

1. 在 Supabase 控制台进入 **SQL Editor**
2. 复制 `supabase/migrations/001_initial_schema.sql` 文件内容
3. 在 SQL Editor 中执行完整的 SQL 脚本
4. 验证表是否创建成功

### 方法二：手动创建表

如果 SQL 脚本执行失败，可以手动创建表：

1. 进入 **Table Editor**
2. 按照以下顺序创建表：
   - `users` (用户表)
   - `poems` (诗词表) 
   - `poem_analyses` (诗词解析表)
   - `learning_records` (学习记录表)
   - `ai_conversations` (AI对话表)
   - `ai_messages` (AI消息表)

## 4. 配置认证设置

1. 进入 **Authentication** → **Settings**
2. 配置以下设置：
   - **Site URL**: 您的应用域名（开发时使用 `http://localhost:3000`）
   - **Enable email confirmation**: 根据需求开启
   - **Enable magic link**: 可选开启

## 5. 配置行级安全策略（RLS）

SQL 迁移脚本已包含 RLS 策略，但需要验证：

1. 进入 **Authentication** → **Policies**
2. 确保每个表都有正确的策略：
   - 用户只能访问自己的数据
   - 所有用户可以查看诗词内容

## 6. 测试数据库连接

### 环境变量验证

确保 `.env` 文件包含正确的配置：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 连接测试

运行应用测试连接：

```bash
npm run dev
```

访问应用并检查控制台是否有连接错误。

## 7. 故障排除

### 常见问题

1. **连接被拒绝**
   - 检查环境变量是否正确
   - 验证 Supabase 项目是否正常运行

2. **表不存在错误**
   - 确认 SQL 迁移脚本已执行
   - 检查表名拼写是否正确

3. **认证错误**
   - 检查 Site URL 配置
   - 验证 RLS 策略设置

4. **权限错误**
   - 确保匿名密钥有适当权限
   - 检查 RLS 策略是否生效

### 调试技巧

1. 使用 Supabase 控制台的 **Logs** 功能查看错误日志
2. 在浏览器开发者工具中检查网络请求
3. 使用 Supabase 客户端的调试模式：

```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // 启用调试
  debug: true
})
```

## 8. 生产环境部署

### Netlify 部署

1. 在 Netlify 项目设置中添加环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. 重新部署应用

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量
2. 重新部署应用

## 9. 安全建议

1. **保护敏感信息**
   - 不要将 `.env` 文件提交到版本控制
   - 使用环境变量管理敏感信息

2. **密钥管理**
   - 定期轮换 API 密钥
   - 使用最小权限原则

3. **数据库安全**
   - 启用 RLS 保护用户数据
   - 定期备份数据库

## 10. 性能优化

1. **数据库索引**
   - 为常用查询字段创建索引
   - 使用适当的索引类型

2. **查询优化**
   - 避免 N+1 查询问题
   - 使用分页加载大量数据

3. **缓存策略**
   - 实现客户端缓存
   - 考虑使用 CDN 缓存静态资源