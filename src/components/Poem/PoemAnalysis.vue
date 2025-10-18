<template>
  <div class="poem-analysis">
    <el-card v-if="analysis" class="analysis-card">
      <template #header>
        <div class="analysis-header">
          <h3>{{ poem.title }} - 深度解析</h3>
          <el-tag :type="getDifficultyTag(poem.difficulty)">
            {{ getDifficultyText(poem.difficulty) }}
          </el-tag>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="字词解析" name="word">
          <div class="analysis-section">
            <h4>重点字词解析</h4>
            <div v-for="(word, index) in analysis.word_analysis" :key="index" class="word-item">
              <strong>{{ word.character }}</strong>: {{ word.meaning }}
              <div v-if="word.notes" class="notes">{{ word.notes }}</div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="意象分析" name="imagery">
          <div class="analysis-section">
            <h4>诗歌意象</h4>
            <el-row :gutter="16">
              <el-col :span="8" v-for="(image, index) in analysis.imagery_analysis" :key="index">
                <el-card shadow="hover" class="image-card">
                  <template #header>
                    <span>{{ image.name }}</span>
                  </template>
                  <p>{{ image.description }}</p>
                  <div class="symbolism">{{ image.symbolism }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="整体赏析" name="overall">
          <div class="analysis-section">
            <h4>诗歌赏析</h4>
            <div class="overall-content" v-html="formatAnalysis(analysis.overall_analysis)"></div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="作者介绍" name="author">
          <div class="analysis-section">
            <h4>作者信息</h4>
            <div class="author-info">
              <p><strong>姓名:</strong> {{ analysis.author_info.name }}</p>
              <p><strong>朝代:</strong> {{ analysis.author_info.dynasty }}</p>
              <p><strong>生平:</strong> {{ analysis.author_info.biography }}</p>
              <p><strong>代表作品:</strong> {{ analysis.author_info.works.join('、') }}</p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="历史背景" name="history">
          <div class="analysis-section">
            <h4>历史背景</h4>
            <div class="history-content" v-html="formatAnalysis(analysis.historical_context)"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <div class="analysis-footer">
          <el-button type="primary" @click="startLearning" :loading="isLearning">
            {{ isLearning ? '学习中...' : '开始学习' }}
          </el-button>
          <el-button @click="saveAnalysis">保存分析</el-button>
          <el-button @click="shareAnalysis">分享</el-button>
        </div>
      </template>
    </el-card>
    
    <el-empty v-else description="暂无解析数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

interface Props {
  poem: any
  analysis?: any
}

const props = defineProps<Props>()

const userStore = useUserStore()

const activeTab = ref('word')
const isLearning = ref(false)

// 方法
const getDifficultyTag = (difficulty: string) => {
  const map: Record<string, any> = {
    easy: 'success',
    medium: 'warning', 
    hard: 'danger'
  }
  return map[difficulty] || 'info'
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty] || '未知'
}

const formatAnalysis = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

const startLearning = async () => {
  if (!userStore.isAuthenticated) {
    ElMessage.warning('请先登录以开始学习')
    return
  }
  
  isLearning.value = true
  try {
    // 模拟创建学习记录
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('学习记录已创建')
  } catch (error) {
    console.error('创建学习记录失败:', error)
    ElMessage.error('操作失败')
  } finally {
    isLearning.value = false
  }
}

const saveAnalysis = () => {
  ElMessage.success('分析已保存到个人收藏')
}

const shareAnalysis = () => {
  ElMessage.info('分享功能开发中...')
}
</script>

<style scoped>
.poem-analysis {
  max-width: 1000px;
  margin: 0 auto;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-section {
  padding: 16px 0;
}

.word-item {
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.notes {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.image-card {
  margin-bottom: 16px;
}

.symbolism {
  font-size: 12px;
  color: #409eff;
  margin-top: 8px;
}

.author-info p {
  margin: 8px 0;
}

.overall-content,
.history-content {
  line-height: 1.8;
}

.analysis-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>