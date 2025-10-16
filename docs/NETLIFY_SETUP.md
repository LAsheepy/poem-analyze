# Netlify部署和Supabase配置指南

## 重要说明

**不要使用Netlify的"Add Database"功能**，这会创建Netlify自己的数据库服务，而不是连接您现有的Supabase数据库。

## 正确的Supabase配置步骤

### 1. 获取Supabase连接信息

1. 登录 [Supabase控制台](https://supabase.com)
2. 选择您的项目
3. 进入 **Settings** > **API**
4. 复制以下信息：

- **Project URL**: `https://your-project-ref.supabase.co`
- **anon/public key**: 以 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 开头的密钥

### 2. 在Netlify中配置环境变量

1. 登录 [Netlify控制台](https://app.netlify.com)
2. 选择您的 `poem-analyze` 项目
3. 点击 **Site settings**
4. 选择 **Environment variables**
5. 点击 **Add a variable** 添加以下两个变量：

```
变量名: VITE_SUPABASE_URL
变量值: https://your-project-ref.supabase.co

变量名: VITE_SUPABASE_ANON_KEY  
变量值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 重新部署

环境变量设置完成后，Netlify会自动触发重新部署。您可以在 **Deploys** 标签页查看部署状态。

## 验证配置

部署完成后，访问您的网站并测试以下功能：

1. **用户注册/登录** - 检查认证是否正常工作
2. **AI对话** - 测试消息发送和接收
3. **诗词浏览** - 确认数据加载正常

## 故障排除

### 常见问题

1. **环境变量未生效**
   - 检查变量名是否正确（区分大小写）
   - 确认部署已完成
   - 清除浏览器缓存重新测试

2. **数据库连接失败**
   - 验证Supabase项目URL和密钥是否正确
   - 检查Supabase项目是否正常运行
   - 确认数据库表已创建

3. **CORS错误**
   - 在Supabase中配置正确的域名白名单
   - 检查Netlify域名是否添加到Supabase允许列表

### 获取帮助

如果遇到问题，请检查：
- [Supabase文档](https://supabase.com/docs)
- [Netlify文档](https://docs.netlify.com)
- 项目中的错误日志信息

## 后续步骤

配置完成后，您还需要：

1. **运行数据库迁移** - 创建必要的数据库表
2. **测试完整功能** - 验证所有功能正常工作
3. **监控性能** - 确保应用运行稳定

---

**重要提醒**: 始终使用环境变量存储敏感信息，不要将密钥硬编码在代码中或提交到版本控制。