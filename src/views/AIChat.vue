<template>
  <div class="ai-chat-page">
    <el-container>
      <el-header class="page-header">
        <h1>诗词AI助手</h1>
        <div class="header-info">
          <el-tag type="success">在线</el-tag>
          <span class="assistant-desc">智能解析诗词，解答文学问题</span>
        </div>
      </el-header>

      <el-main>
        <!-- AI助手聊天界面 -->
        <AIChatAssistant />
        
        <!-- 功能说明 -->
        <el-row :gutter="20" class="features-section">
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <template #header>
                <div class="feature-header">
                  <el-icon size="24" color="#409eff"><Reading /></el-icon>
                  <span>诗词解析</span>
                </div>
              </template>
              <p>深度解析诗词的意境、修辞手法、历史背景，帮助您更好地理解诗歌内涵。</p>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <template #header>
                <div class="feature-header">
                  <el-icon size="24" color="#67c23a"><User /></el-icon>
                  <span>诗人介绍</span>
                </div>
              </template>
              <p>详细介绍诗人的生平经历、创作风格、代表作品，了解文学大家的故事。</p>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <template #header>
                <div class="feature-header">
                  <el-icon size="24" color="#e6a23c"><QuestionFilled /></el-icon>
                  <span>文学问答</span>
                </div>
              </template>
              <p>解答关于古典文学、诗词格律、文学史等方面的疑问，满足您的求知欲。</p>
            </el-card>
          </el-col>
        </el-row>

        <!-- 使用示例 -->
        <el-card class="examples-section">
          <template #header>
            <span>使用示例</span>
          </template>
          <el-row :gutter="16">
            <el-col :span="6">
              <div class="example-item">
                <h4>基础解析</h4>
                <p>"解析《静夜思》的意境"</p>
                <p>"《水调歌头》表达了什么情感"</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="example-item">
                <h4>诗人研究</h4>
                <p>"介绍李白的创作特点"</p>
                <p>"杜甫的现实主义风格"</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="example-item">
                <h4>文学知识</h4>
                <p>"唐诗和宋词的区别"</p>
                <p>"什么是婉约派"</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="example-item">
                <h4>创作指导</h4>
                <p>"如何赏析一首诗"</p>
                <p>"诗词创作的基本要求"</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AIChatAssistant from '@/components/AI/AIChatAssistant.vue'
</script>

<style scoped>
.ai-chat-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
  }
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .assistant-desc {
    font-size: 14px;
    opacity: 0.9;
  }
}

.features-section {
  margin: 30px 0;
}

.feature-card {
  height: 100%;
  
  .feature-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
  
  p {
    color: #606266;
    line-height: 1.6;
    margin: 0;
  }
}

.examples-section {
  margin-top: 30px;
  
  .example-item {
    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 14px;
      font-weight: 600;
    }
    
    p {
      margin: 8px 0;
      color: #606266;
      font-size: 13px;
      line-height: 1.4;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .header-info {
    justify-content: center;
  }
  
  .features-section .el-col {
    margin-bottom: 16px;
  }
  
  .examples-section .el-col {
    margin-bottom: 20px;
  }
}
</style>