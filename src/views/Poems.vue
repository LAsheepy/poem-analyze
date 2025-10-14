<template>
  <div class="poems-page">
    <el-container>
      <el-header class="page-header">
        <h1>诗词解析</h1>
        <el-input
          v-model="searchQuery"
          placeholder="搜索诗词..."
          style="width: 300px"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-header>

      <el-main>
        <el-row :gutter="20">
          <el-col :span="8" v-for="poem in filteredPoems" :key="poem.id">
            <el-card class="poem-card" shadow="hover">
              <template #header>
                <div class="poem-header">
                  <h3>{{ poem.title }}</h3>
                  <el-tag :type="getDifficultyTag(poem.difficulty)">
                    {{ poem.difficulty }}
                  </el-tag>
                </div>
              </template>

              <div class="poem-content">
                <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
                <div class="preview-content">
                  {{ getPreviewContent(poem.content) }}
                </div>
              </div>

              <template #footer>
                <div class="poem-actions">
                  <el-button type="primary" @click="startAnalysis(poem.id)">
                    开始解析
                  </el-button>
                  <el-button @click="viewDetails(poem.id)">
                    查看详情
                  </el-button>
                </div>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Poem } from '@/types/poem'

const router = useRouter()
const searchQuery = ref('')

// 模拟诗词数据
const poems = ref<Poem[]>([
  {
    id: '1',
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
    annotations: [],
    difficulty: 'easy',
    tags: ['思乡', '月亮'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
    annotations: [],
    difficulty: 'easy',
    tags: ['春天', '自然'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
    annotations: [],
    difficulty: 'medium',
    tags: ['登高', '哲理'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

const filteredPoems = computed(() => {
  if (!searchQuery.value) return poems.value
  return poems.value.filter(poem => 
    poem.title.includes(searchQuery.value) ||
    poem.author.includes(searchQuery.value) ||
    poem.tags.some(tag => tag.includes(searchQuery.value))
  )
})

const getDifficultyTag = (difficulty: string) => {
  const map: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return map[difficulty] || 'info'
}

const getPreviewContent = (content: string[]) => {
  return content.slice(0, 2).join(' ') + '...'
}

const handleSearch = () => {
  // 搜索逻辑
}

const startAnalysis = (poemId: string) => {
  router.push(`/analysis/${poemId}`)
}

const viewDetails = (poemId: string) => {
  router.push(`/poems/${poemId}`)
}
</script>

<style lang="scss" scoped>
.poems-page {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    h1 {
      margin: 0;
      color: #303133;
    }
  }
  
  .poem-card {
    margin-bottom: 20px;
    
    .poem-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 {
        margin: 0;
        color: #409eff;
      }
    }
    
    .poem-content {
      .author {
        color: #909399;
        font-size: 14px;
        margin-bottom: 10px;
      }
      
      .preview-content {
        color: #606266;
        line-height: 1.6;
      }
    }
    
    .poem-actions {
      display: flex;
      gap: 10px;
    }
  }
}
</style>