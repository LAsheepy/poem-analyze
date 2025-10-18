# 诗韵星项目部署指南

## 项目状态
✅ **Supabase集成完成** - 所有功能已实现
✅ **构建成功** - 无编译错误
✅ **开发服务器运行正常** - 可在本地测试

## 部署前准备

### 1. Supabase项目配置

1. **创建Supabase项目**
   - 访问 [Supabase Dashboard](https://supabase.com/dashboard)
   - 点击 "New Project"
   - 填写项目信息：
     - Name: `rhyme-star` (或自定义)
     - Database Password: 设置安全密码
     - Region: 选择 `ap-southeast-1` (新加坡) 或离用户最近的区域

2. **获取环境变量**
   - 在项目设置中获取以下信息：
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **初始化数据库**
   - 进入SQL Editor
   - 运行 `scripts/init-database.sql`
   - 运行 `scripts/seed-data.sql` (可选，添加示例数据)

4. **配置认证设置**
   - 进入 "Authentication" → "Settings"
   - 设置 Site URL: `http://localhost:3000` (开发环境)
   - 启用 Email Auth

### 2. 本地环境配置

1. **创建环境文件**
   ```bash
   cp .env.example .env
   ```

2. **编辑 .env 文件**
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

### 3. 测试本地运行

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问应用**
   - 打开 http://localhost:3000
   - 测试注册/登录功能
   - 验证诗词浏览功能

## 生产部署

### 1. Netlify部署

1. **构建设置**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **环境变量配置**
   - 在Netlify项目设置中添加环境变量

3. **部署**
   ```bash
   # 构建项目
   npm run build

   # 部署到Netlify
   netlify deploy --prod --dir=dist
   ```

### 3. 传统服务器部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **配置Web服务器**
   - 将 `dist` 目录内容上传到服务器
   - 配置Nginx/Apache指向dist目录
   - 设置正确的MIME类型

3. **HTTPS配置**
   - 启用HTTPS
   - 配置安全头信息

## 环境变量管理

### 开发环境
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_DEV_SERVER_PORT=3000
```

### 生产环境
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 性能优化建议

### 1. 代码分割
```javascript
// 路由懒加载
const Home = () => import('@/views/Home.vue')
```

### 2. 图片优化
- 使用WebP格式
- 实现懒加载
- 配置CDN加速

### 3. 缓存策略
- 配置Service Worker
- 设置合理的缓存头
- 使用CDN缓存

## 监控和维护

### 1. 错误监控
- 集成Sentry或类似服务
- 监控JavaScript错误
- 跟踪性能指标

### 2. 性能监控
- 使用Google Analytics
- 监控页面加载时间
- 跟踪用户行为

### 3. 安全监控
- 定期安全扫描
- 监控异常访问
- 更新依赖包

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   npm run clean
   # 重新安装依赖
   npm install
   # 重新构建
   npm run build
   ```

2. **Supabase连接失败**
   - 检查环境变量
   - 验证网络连接
   - 检查CORS设置

3. **认证问题**
   - 检查Supabase认证配置
   - 验证重定向URL
   - 检查JWT令牌

### 调试工具

1. **浏览器开发者工具**
   - 检查网络请求
   - 查看控制台错误
   - 调试JavaScript

2. **Supabase Dashboard**
   - 查看API请求日志
   - 监控数据库性能
   - 检查认证状态

## 备份和恢复

### 1. 数据库备份
```sql
-- 定期备份重要数据
pg_dump -h your-host -U your-user your-db > backup.sql
```

### 2. 代码备份
```bash
# 使用Git进行版本控制
git add .
git commit -m "Backup: $(date)"
git push origin main
```

## 扩展功能部署

### 1. AI功能集成
- 配置AI服务API密钥
- 设置请求限制
- 监控使用情况

### 2. 文件存储
- 配置Supabase存储桶
- 设置访问权限
- 优化上传性能

### 3. 实时功能
- 配置WebSocket连接
- 优化实时性能
- 监控连接状态

---

**部署状态**: ✅ 准备就绪  
**测试建议**: 先在开发环境充分测试  
**支持**: 参考项目文档或联系开发团队