<template>
  <div class="poem-list">
    <div class="list-header">
      <h2 class="list-title">{{ title }}</h2>
      <div class="list-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索诗词..."
          style="width: 200px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterDynasty" placeholder="选择朝代" clearable>
          <el-option label="全部" value="" />
          <el-option label="唐代" value="唐代" />
          <el-option label="宋代" value="宋代" />
          <el-option label="元代" value="元代" />
          <el-option label="明代" value="明代" />
          <el-option label="清代" value="清代" />
        </el-select>
        <el-select v-model="filterDifficulty" placeholder="选择难度" clearable>
          <el-option label="全部" value="" />
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
      </div>
    </div>

    <div class="poem-grid">
      <div
        v-for="poem in filteredPoems"
        :key="poem.id"
        class="poem-card"
        @click="handlePoemClick(poem)"
      >
        <div class="poem-header">
          <h3 class="poem-title">{{ poem.title }}</h3>
          <el-tag :type="getDifficultyTag(poem.difficulty)" size="small">
            {{ getDifficultyText(poem.difficulty) }}
          </el-tag>
        </div>
        
        <div class="poem-meta">
          <span class="poem-author">{{ poem.author }}</span>
          <span class="poem-dynasty">{{ poem.dynasty }}</span>
        </div>

        <div class="poem-content">
          <p v-for="(line, index) in poem.content.slice(0, 2)" :key="index" class="poem-line">
            {{ line }}
          </p>
          <p v-if="poem.content.length > 2" class="poem-more">...</p>
        </div>

        <div class="poem-tags">
          <el-tag
            v-for="tag in poem.tags.slice(0, 3)"
            :key="tag"
            size="small"
            type="info"
          >
            {{ tag }}
          </el-tag>
          <span v-if="poem.tags.length > 3" class="tag-more">
            +{{ poem.tags.length - 3 }}
          </span>
        </div>

        <div class="poem-stats">
          <div class="stat">
            <el-icon><View /></el-icon>
            <span>{{ poem.views || 0 }}</span>
          </div>
          <div class="stat">
            <el-icon><Star /></el-icon>
            <span>{{ poem.likes || 0 }}</span>
          </div>
        </div>

        <div class="poem-actions">
          <el-button type="primary" size="small" @click.stop="startAnalysis(poem)">
            开始解析
          </el-button>
          <el-button size="small" @click.stop="addToFavorites(poem)">
            收藏
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="filteredPoems.length === 0" class="empty-state">
      <el-empty description="暂无诗词数据" />
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalPoems"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, View, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
  poems: any[]
  title?: string
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '诗词列表',
  showActions: true
})

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const filterDynasty = ref('')
const filterDifficulty = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 计算属性
const filteredPoems = computed(() => {
  let filtered = props.poems

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(poem => 
      poem.title.toLowerCase().includes(query) ||
      poem.author.toLowerCase().includes(query) ||
      poem.content.some((line: string) => line.toLowerCase().includes(query)) ||
      poem.tags.some((tag: string) => tag.toLowerCase().includes(query))
    )
  }

  // 朝代过滤
  if (filterDynasty.value) {
    filtered = filtered.filter(poem => poem.dynasty === filterDynasty.value)
  }

  // 难度过滤
  if (filterDifficulty.value) {
    filtered = filtered.filter(poem => poem.difficulty === filterDifficulty.value)
  }

  return filtered
})

const totalPoems = computed(() => filteredPoems.value.length)
const totalPages = computed(() => Math.ceil(totalPoems.value / pageSize.value))
const paginatedPoems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPoems.value.slice(start, end)
})

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

const handlePoemClick = (poem: any) => {
  router.push(`/poems/${poem.id}`)
}

const startAnalysis = (poem: any) => {
  router.push(`/analysis/${poem.id}`)
}

const addToFavorites = (poem: any) => {
  ElMessage.success(`已收藏《${poem.title}》`)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 监听过滤条件变化时重置页码
watch([searchQuery, filterDynasty, filterDifficulty], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.poem-list {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.list-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.poem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.poem-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.poem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.poem-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.poem-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #909399;
}

.poem-content {
  margin-bottom: 12px;
}

.poem-line {
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.poem-more {
  margin: 4px 0;
  font-size: 12px;
  color: #c0c4cc;
}

.poem-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.tag-more {
  font-size: 12px;
  color: #909399;
  align-self: center;
}

.poem-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.poem-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-state {
  padding: 60px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .list-actions {
    justify-content: space-between;
  }

  .poem-grid {
    grid-template-columns: 1fr;
  }
}
</style>