<template>
  <div class="poems-page">
    <!-- 简洁顶部栏 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">诗词库</h1>
        <p class="page-subtitle">探索经典诗词，感受中华文化魅力</p>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 搜索栏 -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索诗词标题、作者或内容..."
          size="large"
          clearable
          class="search-input"
          @input="handleSearch"
          @clear="clearSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 搜索结果 -->
      <div v-if="showSearchResults" class="search-results">
        <el-card class="results-card">
          <div class="results-header">
            <h3>搜索结果 ({{ filteredPoems.length }} 条)</h3>
            <el-button type="text" @click="clearSearch">关闭</el-button>
          </div>
          <div class="results-content">
            <div v-if="filteredPoems.length > 0" class="result-list">
              <div 
                v-for="poem in filteredPoems" 
                :key="poem.id" 
                class="result-item"
                @click="goToPoemAnalysis(poem.id)"
              >
                <el-icon><Notebook /></el-icon>
                <div class="result-info">
                  <span class="result-title">{{ poem.title }}</span>
                  <span class="result-author">{{ poem.author }} · {{ poem.dynasty }}</span>
                  <span class="result-excerpt">{{ poem.content.substring(0, 50) }}...</span>
                </div>
              </div>
            </div>
            <div v-else class="no-results">
              <el-empty description="未找到相关诗词" />
            </div>
          </div>
        </el-card>
      </div>

      <!-- 诗词列表 -->
      <div class="poems-section">
        <PoemList :poems="filteredPoems.length > 0 ? filteredPoems : poems" :title="searchQuery ? `搜索结果 (${filteredPoems.length} 条)` : '全部诗词'" :show-search="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Notebook } from '@element-plus/icons-vue'
import PoemList from '@/components/Poem/PoemList.vue'
import { generateMockPoems } from '@/utils/mockData'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const poems = ref<any[]>([])
const searchQuery = ref('')
const showSearchResults = ref(false)

// 计算过滤后的诗词
const filteredPoems = computed(() => {
  if (!searchQuery.value.trim()) {
    return poems.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return poems.value.filter(poem => 
    poem.title.toLowerCase().includes(query) ||
    poem.author.toLowerCase().includes(query) ||
    poem.content.toLowerCase().includes(query) ||
    poem.dynasty.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await loadPoems()
})

const loadPoems = async () => {
  try {
    // 首先尝试从Supabase加载数据
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('加载诗词数据失败:', error)
      // 如果数据库为空，使用模拟数据
      poems.value = generateMockPoems()
    } else if (data && data.length > 0) {
      poems.value = data
    } else {
      poems.value = generateMockPoems()
    }
  } catch (error) {
    console.error('加载诗词数据异常:', error)
    poems.value = generateMockPoems()
  }
}

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    showSearchResults.value = true
  } else {
    showSearchResults.value = false
  }
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  showSearchResults.value = false
}

// 跳转到诗词分析
const goToPoemAnalysis = (poemId: number) => {
  ElMessage.success('跳转到诗词分析页面')
  // 这里可以跳转到诗词详情页面
  // router.push(`/analysis/${poemId}`)
}
</script>

<style scoped>
.poems-page {
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
  text-align: center;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.search-section {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 400px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-results {
  margin-bottom: 24px;
}

.results-card {
  max-width: 800px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.results-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.result-item .el-icon {
  color: #409eff;
  font-size: 18px;
  margin-top: 2px;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.result-title {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.result-author {
  color: #909399;
  font-size: 12px;
}

.result-excerpt {
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
}

.no-results {
  text-align: center;
  padding: 40px 0;
}

.poems-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 0;
  }

  .page-title {
    font-size: 24px;
  }

  .main-content {
    padding: 16px;
  }

  .search-input {
    width: 100%;
  }

  .poems-section {
    padding: 16px;
  }
}
</style>