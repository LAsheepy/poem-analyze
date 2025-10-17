<template>
  <div class="dashboard">
    <!-- 左侧导航边栏 -->
    <div class="sidebar left-sidebar">
      <div class="logo">
        <h2>诗韵星</h2>
        <p>AI驱动诗词解析平台</p>
      </div>
      
      <el-menu default-active="dashboard" class="sidebar-menu">
        <el-menu-item index="dashboard" @click="$router.push('/')">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="poems" @click="$router.push('/poems')">
          <el-icon><Notebook /></el-icon>
          <span>诗词库</span>
        </el-menu-item>
        <el-menu-item index="chat" @click="showChatSidebar = !showChatSidebar">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI助手</span>
        </el-menu-item>
        <el-menu-item index="poet-profile" @click="$router.push('/poet-profile')">
          <el-icon><User /></el-icon>
          <span>诗人简介</span>
        </el-menu-item>
        <el-menu-item index="settings" @click="$router.push('/settings')">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>

      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content" :class="{ expanded: !showChatSidebar }">
      <!-- 展开AI聊天栏按钮 -->
      <div v-if="!showChatSidebar" class="expand-chat-btn">
        <el-button type="primary" @click="showChatSidebar = true" class="circle-ai-button">
          AI
        </el-button>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="content-area">
        <!-- 搜索栏 -->
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="搜索诗词、作者或内容..."
            size="large"
            clearable
            class="round-search"
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
              <h3>搜索结果</h3>
              <el-button type="text" @click="clearSearch">关闭</el-button>
            </div>
            <div class="results-content">
              <!-- 诗词搜索结果 -->
              <div v-if="poemResults.length > 0" class="result-section">
                <h4>诗词</h4>
                <div class="result-list">
                  <div 
                    v-for="poem in poemResults" 
                    :key="poem.id" 
                    class="result-item"
                    @click="goToPoemAnalysis(poem.id)"
                  >
                    <el-icon><Notebook /></el-icon>
                    <div class="result-info">
                      <span class="result-title">{{ poem.title }}</span>
                      <span class="result-author">{{ poem.author }} · {{ poem.dynasty }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 诗人搜索结果 -->
              <div v-if="poetResults.length > 0" class="result-section">
                <h4>诗人</h4>
                <div class="result-list">
                  <div 
                    v-for="poet in poetResults" 
                    :key="poet.id" 
                    class="result-item"
                    @click="goToPoetProfile(poet.id)"
                  >
                    <el-icon><User /></el-icon>
                    <div class="result-info">
                      <span class="result-title">{{ poet.name }}</span>
                      <span class="result-author">{{ poet.dynasty }} · {{ poet.style }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 无结果提示 -->
              <div v-if="poemResults.length === 0 && poetResults.length === 0" class="no-results">
                <el-empty description="未找到相关结果" />
              </div>
            </div>
          </el-card>
        </div>

        <!-- 欢迎区域 -->
        <div class="welcome-section">
          <h1>欢迎使用诗词分析平台</h1>
          <p>探索古典诗词的魅力，与AI一起深度解析</p>
        </div>

        <!-- 功能模块网格 -->
        <div class="modules-grid">
          <!-- 诗词库模块 -->
          <el-card class="module-card">
            <div class="card-header">
              <el-icon size="24" color="#409eff"><Notebook /></el-icon>
              <h3>诗词库</h3>
            </div>
            <p>浏览丰富的古典诗词库，包含唐诗宋词等经典作品</p>
            <el-button type="primary" link @click="$router.push('/poems')">查看全部 →</el-button>
          </el-card>

          <!-- 诗人介绍模块 -->
          <el-card class="module-card">
            <div class="card-header">
              <el-icon size="24" color="#67c23a"><User /></el-icon>
              <h3>诗人介绍</h3>
            </div>
            <p>了解历代著名诗人的生平事迹、文学成就和代表作品</p>
            <el-button type="primary" link @click="$router.push('/poet-profile')">探索诗人 →</el-button>
          </el-card>

          <!-- AI助手介绍模块 -->
          <el-card class="module-card">
            <div class="card-header">
              <el-icon size="24" color="#e6a23c"><ChatDotRound /></el-icon>
              <h3>AI助手</h3>
            </div>
            <p>智能AI助手帮您深度解析诗词内涵、创作背景和艺术特色</p>
            <el-button type="primary" link @click="showChatSidebar = true">开始对话 →</el-button>
          </el-card>

          <!-- 学习进度模块 -->
          <el-card class="module-card">
            <div class="card-header">
              <el-icon size="24" color="#f56c6c"><TrendCharts /></el-icon>
              <h3>学习进度</h3>
            </div>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-value">12</span>
                <span class="stat-label">已学习</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">85%</span>
                <span class="stat-label">完成度</span>
              </div>
            </div>
          </el-card>

          <!-- 诗词学习统计 -->
          <el-card class="module-card">
            <div class="card-header">
              <el-icon size="24" color="#909399"><DataAnalysis /></el-icon>
              <h3>学习统计</h3>
            </div>
            <div class="learning-stats">
              <div class="stat-row">
                <span>连续学习</span>
                <span class="stat-number">7天</span>
              </div>
              <div class="stat-row">
                <span>总学习时间</span>
                <span class="stat-number">15.5h</span>
              </div>
              <div class="stat-row">
                <span>分析诗词</span>
                <span class="stat-number">28首</span>
              </div>
            </div>
          </el-card>

          <!-- 诗词创作模块 -->
          <el-card class="module-card">
            <div class="card-header">
              <el-icon size="24" color="#b37feb"><EditPen /></el-icon>
              <h3>诗词创作</h3>
            </div>
            <p>尝试创作自己的诗词作品，AI助手为您提供创作灵感和修改建议</p>
            <el-button type="primary" link>开始创作 →</el-button>
          </el-card>
        </div>

        <!-- 今日诗词推荐 -->
        <div class="today-poems">
          <div class="section-header">
            <h2>今日诗词推荐</h2>
            <el-button type="primary" text>换一批</el-button>
          </div>
          
          <div class="poems-grid">
            <el-card v-for="poem in todayPoems" :key="poem.id" class="poem-card">
              <div class="poem-content">
                <h4>{{ poem.title }}</h4>
                <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
                <p class="poem-excerpt">{{ poem.excerpt }}</p>
                <div class="poem-actions">
                  <el-button size="small" type="primary" @click="$router.push(`/analysis/${poem.id}`)">阅读全文</el-button>
                  <el-button size="small" @click="showChatSidebar = true">AI解析</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧AI聊天边栏 -->
    <div v-if="showChatSidebar" class="sidebar right-sidebar">
      <div class="chat-header">
        <h3>AI诗词助手</h3>
        <el-button type="text" @click="showChatSidebar = false" class="collapse-btn">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <div class="chat-container">
        <div class="chat-messages">
          <div v-for="message in chatMessages" :key="message.id" class="message" :class="message.role">
            <div class="message-avatar">
              <el-avatar :size="24">
                <span v-if="message.role === 'user'">👤</span>
                <span v-else>🤖</span>
              </el-avatar>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <el-input
            v-model="currentMessage"
            placeholder="输入您的问题..."
            @keydown.enter="sendMessage"
          >
            <template #append>
              <el-button @click="sendMessage" :loading="isLoading">
                <el-icon><Promotion /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  House,
  Notebook,
  ChatDotRound,
  DataAnalysis,
  User,
  Setting,
  Search,
  SwitchButton,
  TrendCharts,
  Close,
  Promotion,
  ArrowRight,
  EditPen
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 搜索相关变量
const searchQuery = ref('')
const showSearchResults = ref(false)
const poemResults = ref([])
const poetResults = ref([])

// 聊天相关变量
const showChatSidebar = ref(true)
const currentMessage = ref('')
const isLoading = ref(false)
const chatMessages = ref([
  {
    id: 1,
    role: 'assistant',
    content: '您好！我是AI诗词助手，可以帮您分析诗词、解答相关问题。有什么我可以帮助您的吗？'
  }
])

// 模拟诗词数据
const poemData = [
  { id: 1, title: '静夜思', author: '李白', dynasty: '唐代', content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。' },
  { id: 2, title: '春晓', author: '孟浩然', dynasty: '唐代', content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。' },
  { id: 3, title: '登鹳雀楼', author: '王之涣', dynasty: '唐代', content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。' },
  { id: 4, title: '水调歌头', author: '苏轼', dynasty: '宋代', content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。' },
  { id: 5, title: '声声慢', author: '李清照', dynasty: '宋代', content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。' }
]

// 模拟诗人数据
const poetData = [
  { id: 1, name: '李白', dynasty: '唐代', style: '浪漫主义' },
  { id: 2, name: '杜甫', dynasty: '唐代', style: '现实主义' },
  { id: 3, name: '苏轼', dynasty: '宋代', style: '豪放派' },
  { id: 4, name: '李清照', dynasty: '宋代', style: '婉约派' },
  { id: 5, name: '白居易', dynasty: '唐代', style: '现实主义' }
]

const todayPoems = ref([
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    excerpt: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    excerpt: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    excerpt: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
  }
])

// 搜索处理
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    clearSearch()
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  
  // 搜索诗词
  poemResults.value = poemData.filter(poem => 
    poem.title.toLowerCase().includes(query) ||
    poem.author.toLowerCase().includes(query) ||
    poem.content.toLowerCase().includes(query)
  )
  
  // 搜索诗人
  poetResults.value = poetData.filter(poet =>
    poet.name.toLowerCase().includes(query) ||
    poet.dynasty.toLowerCase().includes(query) ||
    poet.style.toLowerCase().includes(query)
  )
  
  showSearchResults.value = true
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  poemResults.value = []
  poetResults.value = []
  showSearchResults.value = false
}

// 跳转到诗词分析
const goToPoemAnalysis = (poemId: number) => {
  router.push(`/analysis/${poemId}`)
  clearSearch()
}

// 跳转到诗人简介
const goToPoetProfile = (poetId: number) => {
  router.push('/poet-profile')
  clearSearch()
}

// 发送消息
const sendMessage = async () => {
  if (!currentMessage.value.trim()) return
  
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: currentMessage.value
  }
  
  chatMessages.value.push(userMessage)
  const message = currentMessage.value
  currentMessage.value = ''
  isLoading.value = true
  
  // 模拟AI回复
  setTimeout(() => {
    const aiResponses = [
      '这首诗词表达了深切的思乡之情，通过月光意象营造出宁静而忧郁的氛围。',
      '从文学角度看，这首诗运用了对比手法，将自然景物与内心情感巧妙结合。',
      '这首诗的意境深远，语言简练，体现了作者高超的艺术造诣。',
      '从历史背景来看，这首诗反映了当时文人的普遍情感和时代特征。',
      '这首诗的韵律优美，结构严谨，是古典诗词的典范之作。'
    ]
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)]
    }
    
    chatMessages.value.push(aiMessage)
    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.left-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 20px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.logo {
  text-align: center;
  padding: 0 20px 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.logo h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.logo p {
  margin: 5px 0 0;
  color: #909399;
  font-size: 12px;
}

.sidebar-menu {
  border: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}



.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  margin-right: 380px;
  transition: margin-right 0.3s ease;
}

.main-content.expanded {
  margin-right: 20px;
}

.top-navbar {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.search-results {
  margin-bottom: 32px;
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

.result-section {
  margin-bottom: 24px;
}

.result-section h4 {
  margin: 0 0 12px;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
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
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.no-results {
  text-align: center;
  padding: 40px 0;
}

.round-search {
  width: 400px;
}

.round-search :deep(.el-input__wrapper) {
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.round-search :deep(.el-input__wrapper:hover) {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.round-search :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
}

.welcome-section {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-section h1 {
  margin: 0;
  color: #303133;
  font-size: 28px;
}

.welcome-section p {
  margin: 8px 0 0;
  color: #909399;
  font-size: 16px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.main-content.expanded .modules-grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1200px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .main-content.expanded .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .main-content.expanded .modules-grid {
    grid-template-columns: 1fr;
  }
}

.module-card {
  padding: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.progress-stats {
  display: flex;
  gap: 20px;
  margin-top: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.learning-stats {
  margin-top: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-number {
  font-weight: bold;
  color: #409eff;
}

.today-poems {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.poem-card {
  padding: 16px;
}

.poem-content h4 {
  margin: 0 0 8px;
  color: #303133;
  font-size: 16px;
}

.poem-author {
  margin: 0 0 12px;
  color: #909399;
  font-size: 12px;
}

.poem-excerpt {
  margin: 0 0 16px;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.poem-actions {
  display: flex;
  gap: 8px;
}

/* 右侧聊天边栏样式 */
.right-sidebar {
  width: 380px;
  right: 0;
  left: auto;
  border-left: 1px solid #e4e7ed;
  border-right: none;
  background: white;
  padding: 20px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.collapse-btn {
  padding: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn .el-icon {
  font-size: 20px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: calc(100% - 160px);
}

.message {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message.assistant {
  flex-direction: row;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 8px;
}

.message-content {
  max-width: 70%;
}

.message-text {
  background: #f0f2f5;
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1.4;
  font-size: 14px;
}

.message.user .message-text {
  background: #409eff;
  color: white;
}

.expand-chat-btn {
  position: fixed;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.expand-chat-btn .el-button {
  width: auto;
  min-width: 40px;
  padding: 4px 6px;
  font-size: 12px;
  white-space: nowrap;
}

.circle-ai-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.circle-ai-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.chat-input {
  padding: 12px 16px;
  border-top: 1px solid #e4e7ed;
  background: white;
  position: sticky;
  bottom: 50px;
  z-index: 10;
  margin-top: auto;
  min-height: 70px;
  max-height: 80px;
  display: flex;
  align-items: center;
}

.chat-input :deep(.el-input-group__append) {
  background: #409eff;
  border-color: #409eff;
}

.chat-input :deep(.el-input-group__append .el-button) {
  color: white;
}

/* 调整主内容区以适应右侧边栏 */
.main-content {
  margin-right: 380px;
}

.main-content.expanded {
  margin-right: 20px;
}

.module-card {
  transition: all 0.3s ease;
  min-height: 180px;
}

.poem-card {
  transition: all 0.3s ease;
  min-height: 200px;
}
</style>