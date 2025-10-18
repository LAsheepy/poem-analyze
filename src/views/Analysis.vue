<template>
  <div class="analysis-page">
    <div class="page-header">
      <div class="header-content">
        <div class="poem-info">
          <h1 class="poem-title">{{ poem?.title }}</h1>
          <div class="poem-meta">
            <span class="author">{{ poem?.author }}</span>
            <span class="dynasty">{{ poem?.dynasty }}</span>
            <el-tag :type="getDifficultyTag(poem?.difficulty)" size="small">
              {{ getDifficultyText(poem?.difficulty) }}
            </el-tag>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="startAIChat">
            <el-icon><ChatDotRound /></el-icon>
            与AI讨论
          </el-button>
          <el-button @click="saveAnalysis">
            <el-icon><DocumentAdd /></el-icon>
            保存分析
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <div class="analysis-layout">
        <!-- 左侧：诗词内容 -->
        <div class="poem-section">
          <div class="section-card">
            <h3 class="section-title">诗词原文</h3>
            <div class="poem-content">
              <p v-for="(line, index) in poem?.content" :key="index" class="poem-line">
                {{ line }}
              </p>
            </div>
          </div>

          <!-- 逐句分析 -->
          <div class="section-card">
            <h3 class="section-title">逐句解析</h3>
            <div class="line-analysis">
              <div v-for="(line, index) in poem?.content" :key="index" class="line-item">
                <div class="line-text">{{ line }}</div>
                <div class="line-meaning">
                  {{ getLineAnalysis(index) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：分析结果 -->
        <div class="analysis-section">
          <!-- 整体分析 -->
          <div class="section-card">
            <h3 class="section-title">整体分析</h3>
            <div class="analysis-content">
              <p>{{ analysis?.overall_analysis }}</p>
            </div>
          </div>

          <!-- 意象分析 -->
          <div class="section-card">
            <h3 class="section-title">意象分析</h3>
            <div class="imagery-analysis">
              <div v-for="imagery in analysis?.imagery_analysis" :key="imagery.name" class="imagery-item">
                <h4>{{ imagery.name }}</h4>
                <p><strong>描述：</strong>{{ imagery.description }}</p>
                <p><strong>象征意义：</strong>{{ imagery.symbolism }}</p>
              </div>
            </div>
          </div>

          <!-- 作者信息 -->
          <div class="section-card">
            <h3 class="section-title">作者信息</h3>
            <div class="author-info">
              <h4>{{ analysis?.author_info?.name }}</h4>
              <p><strong>朝代：</strong>{{ analysis?.author_info?.dynasty }}</p>
              <p><strong>简介：</strong>{{ analysis?.author_info?.biography }}</p>
              <div class="works">
                <strong>代表作品：</strong>
                <el-tag
                  v-for="work in analysis?.author_info?.works"
                  :key="work"
                  size="small"
                  style="margin: 2px 4px"
                >
                  {{ work }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 历史背景 -->
          <div class="section-card">
            <h3 class="section-title">历史背景</h3>
            <div class="historical-context">
              <p>{{ analysis?.historical_context }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatDotRound, DocumentAdd } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { generateMockPoems, generateMockAnalysis } from '@/utils/mockData'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

const poem = ref<any>(null)
const analysis = ref<any>(null)

const poemId = computed(() => route.params.id as string)

onMounted(async () => {
  await loadPoemData()
})

const loadPoemData = async () => {
  try {
    // 加载诗词数据
    const { data: poemData, error: poemError } = await supabase
      .from('poems')
      .select('*')
      .eq('id', poemId.value)
      .single()

    if (poemError) {
      console.error('加载诗词失败:', poemError)
      // 使用模拟数据
      const mockPoems = generateMockPoems()
      poem.value = mockPoems.find(p => p.id === poemId.value) || mockPoems[0]
    } else {
      poem.value = poemData
    }

    // 加载分析数据
    analysis.value = generateMockAnalysis(poemId.value)

    // 记录用户查看
    await recordView()

  } catch (error) {
    console.error('加载诗词数据异常:', error)
    const mockPoems = generateMockPoems()
    poem.value = mockPoems.find(p => p.id === poemId.value) || mockPoems[0]
    analysis.value = generateMockAnalysis(poemId.value)
  }
}

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

const getLineAnalysis = (index: number) => {
  const analyses = analysis.value?.word_analysis || []
  if (analyses[index]) {
    return `${analyses[index].character}：${analyses[index].meaning}`
  }
  return '暂无详细解析'
}

const startAIChat = () => {
  // AI聊天功能暂未实现
  console.log('AI聊天功能暂未实现')
}

const saveAnalysis = async () => {
  try {
    const { error } = await supabase
      .from('user_analysis')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        poem_id: poemId.value,
        analysis_data: analysis.value,
        created_at: new Date().toISOString()
      })

    if (error) {
      throw error
    }

    ElMessage.success('分析已保存')
  } catch (error) {
    console.error('保存分析失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

const recordView = async () => {
  try {
    await supabase
      .from('poems')
      .update({ views: (poem.value?.views || 0) + 1 })
      .eq('id', poemId.value)
  } catch (error) {
    console.error('记录查看失败:', error)
  }
}
</script>

<style scoped>
.analysis-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poem-info .poem-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.poem-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.author, .dynasty {
  font-size: 16px;
  color: #606266;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.analysis-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

.poem-content {
  line-height: 2;
  font-size: 16px;
  color: #606266;
}

.poem-line {
  margin: 8px 0;
  text-align: center;
}

.line-analysis .line-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.line-text {
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.line-meaning {
  color: #606266;
  line-height: 1.6;
}

.imagery-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.imagery-item h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.author-info h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.works {
  margin-top: 8px;
}

@media (max-width: 968px) {
  .analysis-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .poem-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 16px;
  }

  .section-card {
    padding: 16px;
  }
}
</style>