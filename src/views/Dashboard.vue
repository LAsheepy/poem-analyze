<template>
  <div class="dashboard">
    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    <el-container v-else class="dashboard-container">
      <!-- 侧边栏 -->
      <el-aside width="250px" class="sidebar">
        <div class="logo">
          <h2>诗韵星</h2>
          <p>AI驱动诗词解析平台</p>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><HouseIcon /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="poems">
            <el-icon><ReadingIcon /></el-icon>
            <span>诗词解析</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.isTeacher" index="teacher">
            <el-icon><UserIcon /></el-icon>
            <span>教学管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <h1>欢迎回来！</h1>
            <div class="user-info">
              <el-avatar :size="40" :src="userStore.user?.avatar" />
              <span class="username">{{ userStore.user?.username }}</span>
            </div>
          </div>
        </el-header>

        <el-main class="main-content">
          <!-- 学习进度 -->
          <el-card class="progress-card">
            <template #header>
              <div class="card-header">
                <span>学习进度</span>
                <el-progress 
                  :percentage="userStore.user?.learningProgress || 0" 
                  :stroke-width="8"
                />
              </div>
            </template>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-label">已解析诗词</span>
                <span class="stat-value">12</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">平均得分</span>
                <span class="stat-value">85</span>
              </div>
            </div>
          </el-card>

          <!-- AI助手 -->
          <el-card class="ai-card">
            <template #header>
              <div class="card-header">
                <span>AI诗词导师</span>
                <el-button type="primary" size="small" @click="startConversation">
                  开始对话
                </el-button>
              </div>
            </template>
            <div class="ai-content">
              <p>您好！我是您的AI诗词导师，可以帮您解析诗词、解答疑问。</p>
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

          <!-- 推荐诗词 -->
          <el-card class="recommendation-card">
            <template #header>
              <span>推荐诗词</span>
            </template>
            <el-table :data="recommendedPoems" style="width: 100%">
              <el-table-column prop="title" label="诗词标题" />
              <el-table-column prop="author" label="作者" />
              <el-table-column prop="dynasty" label="朝代" />
              <el-table-column label="操作">
                <template #default>
                  <el-button type="primary" size="small">开始解析</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAIStore } from '@/stores/ai'
import {
  House,
  Reading,
  User,
  Promotion
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const aiStore = useAIStore()

// 注册图标组件
const HouseIcon = House
const ReadingIcon = Reading
const UserIcon = User
const PromotionIcon = Promotion

const activeMenu = ref('dashboard')
const aiMessage = ref('')
const isLoading = ref(true)

// 模拟推荐诗词数据
const recommendedPoems = ref([
  { id: '1', title: '静夜思', author: '李白', dynasty: '唐代' },
  { id: '2', title: '春晓', author: '孟浩然', dynasty: '唐代' },
  { id: '3', title: '登鹳雀楼', author: '王之涣', dynasty: '唐代' }
])

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

onMounted(() => {
  // 模拟用户登录
  userStore.setUser({
    id: '1',
    username: '测试用户',
    email: 'test@example.com',
    role: 'student',
    learningProgress: 65,
    interests: ['唐诗', '宋词'],
    createdAt: new Date(),
    lastLoginAt: new Date()
  })
  
  // 模拟加载延迟
  setTimeout(() => {
    isLoading.value = false
  }, 500)
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
  
  .loading-container {
    padding: 20px;
  }
  
  .dashboard-container {
    height: 100%;
  }
  
  .sidebar {
    background-color: #f5f7fa;
    border-right: 1px solid #e4e7ed;
    
    .logo {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #e4e7ed;
      
      h2 {
        margin: 0;
        color: #409eff;
      }
      
      p {
        margin: 5px 0 0;
        font-size: 12px;
        color: #909399;
      }
    }
    
    .sidebar-menu {
      border: none;
    }
  }
  
  .header {
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      
      h1 {
        margin: 0;
        font-size: 24px;
        color: #303133;
      }
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .username {
          font-weight: 500;
        }
      }
    }
  }
  
  .main-content {
    background-color: #f0f2f5;
    padding: 20px;
    
    .progress-card,
    .ai-card,
    .recommendation-card {
      margin-bottom: 20px;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .progress-stats {
      display: flex;
      gap: 40px;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .stat-label {
          font-size: 12px;
          color: #909399;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #409eff;
        }
      }
    }
    
    .ai-content {
      p {
        margin-bottom: 15px;
        color: #606266;
      }
    }
  }
}
</style>