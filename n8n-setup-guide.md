# n8n诗词分析工作流配置指南

## 方案二：n8n工作流方案

### 已完成的工作

1. ✅ n8n已安装并启动在 http://localhost:5678
2. ✅ PostCSS配置问题已修复
3. ✅ 前端poemService.ts已更新为调用n8n工作流
4. ✅ n8n工作流配置文件已创建

### 下一步配置

#### 1. 配置n8n工作流

1. 打开n8n编辑器：http://localhost:5678
2. 导入工作流文件：`n8n-poem-analysis-workflow.json`
3. 配置DeepSeek API密钥：
   - 在n8n设置中添加环境变量 `DEEPSEEK_API_KEY`
   - 或者直接在HTTP请求节点中配置API密钥

#### 2. 启动工作流

1. 在n8n编辑器中激活工作流
2. 工作流将监听Webhook路径：`/webhook/poem-analysis`

#### 3. 测试工作流

使用以下curl命令测试工作流：

```bash
curl -X POST http://localhost:5678/webhook/poem-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "poemContent": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    "analysisType": "comprehensive"
  }'
```

### 工作流说明

工作流包含以下节点：

1. **Webhook节点** - 接收前端请求
2. **代码节点** - 构建DeepSeek API请求
3. **HTTP请求节点** - 调用DeepSeek API
4. **代码节点** - 处理API响应
5. **Webhook响应节点** - 返回分析结果

### 优势对比

| 特性 | 方案一（Netlify函数） | 方案二（n8n工作流） |
|------|---------------------|-------------------|
| 稳定性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 可维护性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 调试能力 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 扩展性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 部署复杂度 | ⭐⭐⭐⭐ | ⭐⭐ |

### 故障排除

1. **n8n无法启动**：检查端口5678是否被占用
2. **DeepSeek API调用失败**：检查API密钥配置
3. **Webhook响应超时**：调整n8n超时设置
4. **数据库连接错误**：检查Supabase配置

### 生产环境部署

如需部署到生产环境，建议使用：
- n8n.cloud（托管服务）
- 自托管n8n实例
- 配置域名和SSL证书

方案二比方案一更稳定可靠，特别适合诗词分析这类需要复杂AI集成的应用场景。