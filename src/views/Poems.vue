<template>
  <div class="poems-page">
    <!-- 顶部筛选栏 -->
    <el-header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">诗词解析</h1>
          <p class="page-subtitle">探索古典诗词的无限魅力</p>
        </div>
        <div class="header-right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索诗词标题、作者或标签..."
            style="width: 300px"
            @input="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="selectedDynasty" placeholder="选择朝代" @change="handleFilterChange">
            <el-option label="全部" value=""></el-option>
            <el-option label="唐代" value="唐代"></el-option>
            <el-option label="宋代" value="宋代"></el-option>
            <el-option label="元代" value="元代"></el-option>
            <el-option label="明代" value="明代"></el-option>
            <el-option label="清代" value="清代"></el-option>
          </el-select>
          <el-select v-model="selectedDifficulty" placeholder="选择难度" @change="handleFilterChange">
            <el-option label="全部" value=""></el-option>
            <el-option label="简单" value="easy"></el-option>
            <el-option label="中等" value="medium"></el-option>
            <el-option label="困难" value="hard"></el-option>
          </el-select>
        </div>
      </div>
    </el-header>

    <!-- 多栏目内容区 -->
    <el-main class="poems-content">
      <!-- 瀑布流诗词展示 -->
      <div class="poems-grid">
        <div 
          v-for="poem in filteredPoems" 
          :key="poem.id"
          class="poem-card"
          @click="viewDetails(poem.id)"
        >
          <div class="poem-image">
            <img :src="getPoemImage(poem.id)" :alt="poem.title" />
            <div class="poem-overlay">
              <el-button type="primary" size="small" @click.stop="startAnalysis(poem.id)">
                开始解析
              </el-button>
            </div>
          </div>
          <div class="poem-info">
            <div class="poem-header">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <el-tag :type="getDifficultyTag(poem.difficulty)" size="small">
                {{ getDifficultyText(poem.difficulty) }}
              </el-tag>
            </div>
            <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
            <div class="poem-preview">
              {{ getPreviewContent(poem.content) }}
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
              <span v-if="poem.tags.length > 3" class="more-tags">+{{ poem.tags.length - 3 }}</span>
            </div>
            <div class="poem-stats">
              <span class="stat-item">
                <el-icon><View /></el-icon>
                {{ poem.views || 0 }}
              </span>
              <span class="stat-item">
                <el-icon><Star /></el-icon>
                {{ poem.likes || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <el-button type="primary" :loading="loading" @click="loadMore">
          加载更多诗词
        </el-button>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredPoems.length === 0">
        <el-empty description="暂无匹配的诗词" />
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Poem } from '@/types/poem'
import { Search, View, Star } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const selectedDynasty = ref('')
const selectedDifficulty = ref('')
const loading = ref(false)
const hasMore = ref(true)

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
    tags: ['思乡', '月亮', '夜晚', '孤独'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1250,
    likes: 890
  },
  {
    id: '2',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
    annotations: [],
    difficulty: 'easy',
    tags: ['春天', '自然', '清新', '生机'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 980,
    likes: 650
  },
  {
    id: '3',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
    annotations: [],
    difficulty: 'medium',
    tags: ['登高', '哲理', '壮阔', '进取'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1560,
    likes: 1120
  },
  {
    id: '4',
    title: '水调歌头·明月几时有',
    author: '苏轼',
    dynasty: '宋代',
    content: ['明月几时有？把酒问青天。', '不知天上宫阙，今夕是何年。'],
    annotations: [],
    difficulty: 'hard',
    tags: ['中秋', '思念', '哲理', '浪漫'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 2100,
    likes: 1780
  },
  {
    id: '5',
    title: '将进酒',
    author: '李白',
    dynasty: '唐代',
    content: ['君不见黄河之水天上来，', '奔流到海不复回。'],
    annotations: [],
    difficulty: 'medium',
    tags: ['豪放', '饮酒', '人生', '激情'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1890,
    likes: 1450
  },
  {
    id: '6',
    title: '声声慢·寻寻觅觅',
    author: '李清照',
    dynasty: '宋代',
    content: ['寻寻觅觅，冷冷清清，', '凄凄惨惨戚戚。'],
    annotations: [],
    difficulty: 'hard',
    tags: ['婉约', '愁绪', '女性', '细腻'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1340,
    likes: 980
  }
])

const filteredPoems = computed(() => {
  let filtered = poems.value
  
  // 朝代筛选
  if (selectedDynasty.value) {
    filtered = filtered.filter(poem => poem.dynasty === selectedDynasty.value)
  }
  
  // 难度筛选
  if (selectedDifficulty.value) {
    filtered = filtered.filter(poem => poem.difficulty === selectedDifficulty.value)
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    filtered = filtered.filter(poem => 
      poem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      poem.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      poem.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }
  
  return filtered
})

const getDifficultyTag = (difficulty: string) => {
  const map: Record<string, string> = {
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

const getPreviewContent = (content: string[]) => {
  return content.slice(0, 2).join(' ') + '...'
}

const getPoemImage = (poemId: string) => {
  // 模拟图片路径
  const images = {
    '1': '/api/placeholder/300/200?text=静夜思',
    '2': '/api/placeholder/300/200?text=春晓',
    '3': '/api/placeholder/300/200?text=登鹳雀楼',
    '4': '/api/placeholder/300/200?text=水调歌头',
    '5': '/api/placeholder/300/200?text=将进酒',
    '6': '/api/placeholder/300/200?text=声声慢'
  }
  return images[poemId as keyof typeof images] || '/api/placeholder/300/200'
}

const handleSearch = () => {
  // 搜索逻辑 - 已通过computed实现
}

const handleFilterChange = () => {
  // 筛选逻辑 - 已通过computed实现
}

const startAnalysis = (poemId: string) => {
  router.push(`/analysis/${poemId}`)
}

const viewDetails = (poemId: string) => {
  router.push(`/poems/${poemId}`)
}

const loadMore = async () => {
  loading.value = true
  // 模拟加载更多数据
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 这里可以添加实际的数据加载逻辑
  hasMore.value = false // 模拟没有更多数据
  loading.value = false
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style lang="scss" scoped>
.poems-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .page-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 30px;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      
      .header-left {
        .page-title {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #303133;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeIn 0.8s ease-out;
        }
        
        .page-subtitle {
          margin: 0;
          font-size: 16px;
          color: #909399;
          animation: slideUp 0.8s ease-out 0.2s both;
        }
      }
      
      .header-right {
        display: flex;
        gap: 15px;
        align-items: center;
        
        .search-input,
        .el-select {
          animation: slideDown 0.8s ease-out 0.4s both;
        }
      }
    }
  }
  
  .poems-content {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
    
    .poems-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
      
      .poem-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        animation: fadeIn 0.6s ease-out;
        
        &:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          
          .poem-image .poem-overlay {
            opacity: 1;
          }
        }
        
        .poem-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .poem-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          &:hover img {
            transform: scale(1.05);
          }
        }
        
        .poem-info {
          padding: 20px;
          
          .poem-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            
            .poem-title {
              margin: 0;
              font-size: 18px;
              font-weight: 600;
              color: #303133;
              line-height: 1.3;
              flex: 1;
              margin-right: 10px;
            }
          }
          
          .poem-author {
            margin: 0 0 15px 0;
            font-size: 14px;
            color: #909399;
          }
          
          .poem-preview {
            margin: 0 0 15px 0;
            color: #606266;
            line-height: 1.6;
            font-size: 14px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .poem-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 15px;
            
            .more-tags {
              font-size: 12px;
              color: #909399;
              align-self: center;
            }
          }
          
          .poem-stats {
            display: flex;
            gap: 15px;
            
            .stat-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #909399;
              
              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    
    .load-more {
      text-align: center;
      margin: 30px 0;
      
      .el-button {
        padding: 12px 30px;
        border-radius: 25px;
        font-weight: 500;
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      
      :deep(.el-empty__description) {
        color: #909399;
      }
    }
  }
}

// 动画定义
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .poems-page {
    .page-header {
      padding: 20px;
      
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
    }
    
    .poems-content {
      padding: 20px;
      
      .poems-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  }
}

@media (max-width: 480px) {
  .poems-page {
    .page-header {
      .header-right {
        flex-direction: column;
        width: 100%;
        
        .search-input,
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>