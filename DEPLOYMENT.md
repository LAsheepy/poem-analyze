# 部署指南

## 本地开发环境

### 1. 环境准备
```bash
# 确保Node.js版本 >= 16
node --version

# 安装依赖
npm install
```

### 2. 配置环境变量
创建 `.env` 文件：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:3006

## Supabase配置

### 1. 创建Supabase项目
1. 访问 [Supabase官网](https://supabase.com)
2. 创建新项目
3. 获取项目URL和anon key

### 2. 数据库初始化
运行以下SQL脚本初始化数据库表：

```sql
-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户资料表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 诗词表
CREATE TABLE poems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  content TEXT[] NOT NULL,
  annotations JSONB,
  translation TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  tags TEXT[],
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 用户分析记录表
CREATE TABLE user_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 对话记录表
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 用户学习进度表
CREATE TABLE user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 启用行级安全策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "用户只能查看自己的资料" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户可以更新自己的资料" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "所有用户都可以查看诗词" ON poems FOR SELECT USING (true);
CREATE POLICY "管理员可以管理诗词" ON poems FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "用户只能查看自己的分析记录" ON user_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以创建分析记录" ON user_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能查看自己的对话" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的对话" ON conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "用户只能查看自己的学习进度" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的学习进度" ON user_progress FOR ALL USING (auth.uid() = user_id);
```

## 生产环境部署

### Netlify部署
```bash
# 构建项目
npm run build

# 部署到Netlify
netlify deploy --prod --dir=dist
```

### Docker部署
创建 `Dockerfile`：
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建和运行：
```bash
docker build -t poem-analyze .
docker run -p 3000:80 poem-analyze
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|-------|------|------|
| VITE_SUPABASE_URL | Supabase项目URL | https://xxx.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase匿名密钥 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |

## 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 查看端口占用
   netstat -ano | findstr :3006
   # 终止进程
   taskkill /PID <PID> /F
   ```

2. **环境变量未生效**
   - 确保.env文件在项目根目录
   - 重启开发服务器
   - 检查变量名拼写

3. **Supabase连接失败**
   - 检查URL和密钥是否正确
   - 验证网络连接
   - 检查Supabase项目状态

### 性能优化

1. **代码分割**
   ```javascript
   // 路由懒加载
   component: () => import('@/views/Dashboard.vue')
   ```

2. **图片优化**
   - 使用WebP格式
   - 实现懒加载
   - 压缩图片大小

3. **缓存策略**
   - 配置HTTP缓存头
   - 使用Service Worker
   - 数据库查询优化

## 监控和维护

### 性能监控
- 使用Lighthouse进行性能测试
- 监控页面加载时间
- 错误追踪和报告

### 安全维护
- 定期更新依赖
- 安全漏洞扫描
- 数据备份策略

## 更新日志

### v1.0.0 (当前版本)
- ✅ 基础项目架构
- ✅ 用户认证系统
- ✅ 诗词浏览功能
- ✅ AI对话功能
- ✅ 响应式设计
- ✅ TypeScript支持

### 未来计划
- [ ] 移动端APP
- [ ] 离线功能
- [ ] 多语言支持
- [ ] 高级分析功能