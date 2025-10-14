<template>
  <div class="dashboard">
    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    <el-container v-else class="dashboard-container">
      <!-- 侧边栏 -->
      <el-aside width="280px" class="sidebar">
        <div class="logo">
          <h2 class="logo-title">诗韵星</h2>
          <p class="logo-subtitle">AI驱动诗词解析平台</p>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard" class="menu-item">
            <el-icon><HouseIcon /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="poems" class="menu-item">
            <el-icon><ReadingIcon /></el-icon>
            <span>诗词解析</span>
          </el-menu-item>
          <el-menu-item index="library" class="menu-item">
            <el-icon><CollectionIcon /></el-icon>
            <span>诗词库</span>
          </el-menu-item>
          <el-menu-item index="recommendations" class="menu-item">
            <el-icon><StarIcon /></el-icon>
            <span>今日推荐</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.isTeacher" index="teacher" class="menu-item">
            <el-icon><UserIcon /></el-icon>
            <span>教学管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <h1 class="welcome-title">欢迎回来，{{ userStore.user?.username }}！</h1>
            <div class="header-stats">
              <div class="stat-badge">
                <span class="stat-label">连续学习</span>
                <span class="stat-value">{{ userStore.user?.streakDays || 0 }}天</span>
              </div>
              <div class="stat-badge">
                <span class="stat-label">今日任务</span>
                <span class="stat-value">{{ todayTasks }}/3</span>
              </div>
            </div>
            <div class="user-info">
              <el-avatar :size="40" :src="userStore.user?.avatar" />
              <span class="username">{{ userStore.user?.username }}</span>
            </div>
          </div>
        </el-header>

        <el-main class="main-content">
          <!-- 多栏目布局 -->
          <div class="dashboard-grid">
            <!-- 学习进度卡片 -->
            <el-card class="progress-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">学习进度</span>
                  <el-button type="text" @click="viewProgressDetails">查看详情</el-button>
                </div>
              </template>
              <div class="progress-content">
                <el-progress 
                  :percentage="userStore.user?.learningProgress || 0" 
                  :stroke-width="12"
                  class="main-progress"
                />
                <div class="progress-stats">
                  <div class="stat-item">
                    <span class="stat-label">已解析诗词</span>
                    <span class="stat-value">{{ userStore.user?.analyzedPoems || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">平均得分</span>
                    <span class="stat-value">{{ userStore.user?.averageScore || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">掌握度</span>
                    <span class="stat-value">{{ userStore.user?.masteryLevel || '初级' }}</span>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- AI助手卡片 -->
            <el-card class="ai-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">AI诗词导师</span>
                  <el-button type="primary" size="small" @click="startConversation">
                    开始对话
                  </el-button>
                </div>
              </template>
              <div class="ai-content">
                <div class="ai-avatar">
                  <el-avatar :size="60" src="/api/placeholder/60/60" />
                </div>
                <div class="ai-message">
                  <p>您好！我是您的专属AI诗词导师，随时为您提供个性化解析和指导。</p>
                  <div class="ai-features">
                    <el-tag v-for="feature in aiFeatures" :key="feature" size="small">
                      {{ feature }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="chat-input">
                <el-input
                  v-model="aiMessage"
                  placeholder="输入您的问题..."
                  @keyup.enter="sendAIMessage"
                >
                  <template #append>
                    <el-button @click="sendAIMessage">
                      <el-icon><PromotionIcon /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </el-card>

            <!-- 今日推荐诗词 -->
            <el-card class="recommendation-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">今日推荐</span>
                  <el-button type="text" @click="refreshRecommendations">换一批</el-button>
                </div>
              </template>
              <div class="recommendation-list">
                <div 
                  v-for="poem in recommendedPoems" 
                  :key="poem.id"
                  class="poem-item"
                  @click="startPoemAnalysis(poem.id)"
                >
                  <div class="poem-info">
                    <h4 class="poem-title">{{ poem.title }}</h4>
                    <p class="poem-meta">{{ poem.author }} · {{ poem.dynasty }}</p>
                    <div class="poem-tags">
                      <el-tag v-for="tag in poem.tags" :key="tag" size="small" type="info">
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="poem-action">
                    <el-button type="primary" size="small" @click.stop="startPoemAnalysis(poem.id)">
                      开始解析
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 学习统计 -->
            <el-card class="stats-card" shadow="hover">
              <template #header>
                <span class="card-title">学习统计</span>
              </template>
              <div class="stats-content">
                <div class="stat-chart">
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${userStore.user?.weeklyActivity || 0}%` }"></div>
                    <span>一</span>
                  </div>
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${(userStore.user?.weeklyActivity || 0) + 20}%` }"></div>
                    <span>二</span>
                  </div>
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${(userStore.user?.weeklyActivity || 0) + 40}%` }"></div>
                    <span>三</span>
                  </div>
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${(userStore.user?.weeklyActivity || 0) + 60}%` }"></div>
                    <span>四</span>
                  </div>
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${(userStore.user?.weeklyActivity || 0) + 80}%` }"></div>
                    <span>五</span>
                  </div>
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${(userStore.user?.weeklyActivity || 0) + 100}%` }"></div>
                    <span>六</span>
                  </div>
                  <div class="chart-item">
                    <div class="chart-bar" :style="{ height: `${(userStore.user?.weeklyActivity || 0) + 60}%` }"></div>
                    <span>日</span>
                  </div>
                </div>
                <div class="stats-summary">
                  <div class="summary-item">
                    <span class="summary-label">本周学习</span>
                    <span class="summary-value">{{ userStore.user?.weeklyStudyTime || 0 }}小时</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">完成率</span>
                    <span class="summary-value">{{ userStore.user?.completionRate || 0 }}%</span>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 快速入口 -->
            <el-card class="quick-actions-card" shadow="hover">
              <template #header>
                <span class="card-title">快速入口</span>
              </template>
              <div class="quick-actions">
                <div class="action-item" @click="$router.push('/poems')">
                  <el-icon><ReadingIcon /></el-icon>
                  <span>诗词解析</span>
                </div>
                <div class="action-item" @click="$router.push('/library')">
                  <el-icon><CollectionIcon /></el-icon>
                  <span>诗词库</span>
                </div>
                <div class="action-item" @click="viewLearningPath">
                  <el-icon><TrendChartsIcon /></el-icon>
                  <span>学习路径</span>
                </div>
                <div class="action-item" @click="viewAchievements">
                  <el-icon><TrophyIcon /></el-icon>
                  <span>成就</span>
                </div>
              </div>
            </el-card>

            <!-- AI提醒 -->
            <el-card class="ai-reminder-card" shadow="hover" v-if="aiReminder">
              <template #header>
                <div class="card-header">
                  <span class="card-title">AI提醒</span>
                  <el-icon><BellIcon /></el-icon>
                </div>
              </template>
              <div class="reminder-content">
                <p>{{ aiReminder.message }}</p>
                <div class="reminder-actions">
                  <el-button type="primary" size="small" @click="handleReminderAction">
                    {{ aiReminder.actionText }}
                  </el-button>
                  <el-button size="small" @click="dismissReminder">稍后</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAIStore } from '@/stores/ai'
import {
  House,
  Reading,
  User,
  Promotion,
  Collection,
  Star,
  TrendCharts,
  Trophy,
  Bell
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const aiStore = useAIStore()

// 注册图标组件
const HouseIcon = House
const ReadingIcon = Reading
const UserIcon = User
const PromotionIcon = Promotion
const CollectionIcon = Collection
const StarIcon = Star
const TrendChartsIcon = TrendCharts
const TrophyIcon = Trophy
const BellIcon = Bell

const activeMenu = ref('dashboard')
const aiMessage = ref('')
const isLoading = ref(true)

// 模拟数据
const todayTasks = ref(2)
const aiFeatures = ref(['个性化解析', '进度跟踪', '智能推荐', '即时答疑'])
const aiReminder = ref({
  message: '您有2首诗词待解析，建议今天完成学习任务。',
  actionText: '开始学习'
})

// 模拟推荐诗词数据
const recommendedPoems = ref([
  { id: '1', title: '静夜思', author: '李白', dynasty: '唐代', tags: ['思乡', '月亮'] },
  { id: '2', title: '春晓', author: '孟浩然', dynasty: '唐代', tags: ['春天', '自然'] },
  { id: '3', title: '登鹳雀楼', author: '王之涣', dynasty: '唐代', tags: ['登高', '哲理'] }
])

// 方法定义
const viewProgressDetails = () => {
  console.log('查看进度详情')
}

const refreshRecommendations = () => {
  console.log('刷新推荐')
}

const startPoemAnalysis = (poemId: string) => {
  router.push(`/analysis/${poemId}`)
}

const viewLearningPath = () => {
  console.log('查看学习路径')
}

const viewAchievements = () => {
  console.log('查看成就')
}

const handleReminderAction = () => {
  router.push('/poems')
}

const dismissReminder = () => {
  aiReminder.value = null
}

const handleMenuSelect = (index: string) => {
  router.push(`/${index}`)
}

const startConversation = () => {
  aiStore.createConversation()
}

const sendAIMessage = async () => {
  if (!aiMessage.value.trim()) return
  
  try {
    await aiStore.sendMessage(aiMessage.value)
    aiMessage.value = ''
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

onMounted(async () => {
  try {
    // 模拟用户登录
    userStore.setUser({
      id: '1',
      username: '测试用户',
      email: 'test@example.com',
      role: 'student',
      learningProgress: 65,
      interests: ['唐诗', '宋词'],
      createdAt: new Date(),
      lastLoginAt: new Date(),
      streakDays: 7,
      analyzedPoems: 12,
      averageScore: 85,
      masteryLevel: '中级',
      weeklyActivity: 40,
      weeklyStudyTime: 5,
      completionRate: 75
    })
    
    // 确保数据加载完成后再显示页面
    await new Promise(resolve => setTimeout(resolve, 100))
    isLoading.value = false
  } catch (error) {
    console.error('Dashboard初始化失败:', error)
    isLoading.value = false
  }
})

// 错误捕获
onErrorCaptured((err) => {
  console.error('Dashboard组件错误:', err)
  return false
})
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .loading-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .dashboard-container {
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
  
  .sidebar {
    background: rgba(255, 255, 255, 0.98);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    
    .logo {
      padding: 30px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      .logo-title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        animation: float 3s ease-in-out infinite;
      }
      
      .logo-subtitle {
        margin: 5px 0 0;
        font-size: 12px;
        opacity: 0.8;
      }
    }
    
    .sidebar-menu {
      border: none;
      background: transparent;
      
      .menu-item {
        margin: 5px 10px;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(5px);
        }
        
        &.is-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
    }
  }
  
  .header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 30px;
      
      .welcome-title {
        margin: 0;
        font-size: 24px;
        color: #303133;
        font-weight: 600;
        animation: slideDown 0.5s ease-out;
      }
      
      .header-stats {
        display: flex;
        gap: 20px;
        
        .stat-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          
          .stat-label {
            font-size: 12px;
            color: #667eea;
          }
          
          .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: #667eea;
          }
        }
      }
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .username {
          font-weight: 500;
          color: #303133;
        }
      }
    }
  }
  
  .main-content {
    background: transparent;
    padding: 30px;
    overflow-y: auto;
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      animation: fadeIn 0.6s ease-in-out;
    }
    
    .progress-card,
    .ai-card,
    .recommendation-card,
    .stats-card,
    .quick-actions-card,
    .ai-reminder-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 0;
      
      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }
    
    .progress-content {
      padding: 20px 24px;
      
      .main-progress {
        margin-bottom: 20px;
      }
      
      .progress-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          
          .stat-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 5px;
          }
          
          .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
          }
        }
      }
    }
    
    .ai-content {
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 15px;
      
      .ai-avatar {
        flex-shrink: 0;
      }
      
      .ai-message {
        flex: 1;
        
        p {
          margin: 0 0 10px 0;
          color: #606266;
          line-height: 1.5;
        }
        
        .ai-features {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
      }
    }
    
    .chat-input {
      padding: 0 24px 20px;
    }
    
    .recommendation-list {
      padding: 0 24px 20px;
      
      .poem-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          padding: 15px;
          margin: 0 -15px;
        }
        
        .poem-info {
          flex: 1;
          
          .poem-title {
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
          
          .poem-meta {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #909399;
          }
          
          .poem-tags {
            display: flex;
            gap: 5px;
          }
        }
        
        .poem-action {
          flex-shrink: 0;
        }
      }
    }
    
    .stats-content {
      padding: 20px 24px;
      
      .stat-chart {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 120px;
        margin-bottom: 20px;
        
        .chart-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          
          .chart-bar {
            width: 20px;
            background: linear-gradient(to top, #667eea, #764ba2);
            border-radius: 4px 4px 0 0;
            transition: height 0.3s ease;
            animation: slideUp 1s ease-out;
          }
          
          span {
            margin-top: 8px;
            font-size: 12px;
            color: #909399;
          }
        }
      }
      
      .stats-summary {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          
          .summary-label {
            font-size: 12px;
            color: #909399;
          }
          
          .summary-value {
            font-size: 16px;
            font-weight: 600;
            color: #667eea;
          }
        }
      }
    }
    
    .quick-actions {
      padding: 20px 24px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      
      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background: rgba(102, 126, 234, 0.05);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.05);
        }
        
        .el-icon {
          font-size: 24px;
          color: #667eea;
          margin-bottom: 8px;
        }
        
        span {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }
      }
    }
    
    .reminder-content {
      padding: 20px 24px;
      
      p {
        margin: 0 0 15px 0;
        color: #606266;
        line-height: 1.5;
      }
      
      .reminder-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}

// 动画定义
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>