<template>
  <div class="detailed-analysis">
    <!-- 顶部导航 -->
    <el-header class="analysis-header">
      <el-button type="primary" @click="$router.go(-1)" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="poem-title">{{ poem?.title }}</h1>
      <div class="header-actions">
        <el-button type="primary" @click="toggleAudio">
          <el-icon><VideoPlay /></el-icon>
          {{ isPlaying ? '暂停' : '播放' }}
        </el-button>
        <el-button @click="toggleFullscreen">
          <el-icon><FullScreen /></el-icon>
          全屏
        </el-button>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main class="analysis-content">
      <!-- 原文展示区 -->
      <el-card class="poem-original" shadow="never">
        <div class="poem-text">
          <div 
            v-for="(line, index) in poem?.content" 
            :key="index"
            class="poem-line"
            :class="{ 'active': activeLine === index }"
            @click="setActiveLine(index)"
          >
            <span class="line-number">{{ index + 1 }}</span>
            <span class="line-text">{{ line }}</span>
          </div>
        </div>
      </el-card>

      <!-- 分层解析区 -->
      <div class="analysis-sections">
        <!-- 字词解析 -->
        <el-card class="analysis-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <el-icon><Document /></el-icon>
              <span>字词解析</span>
            </div>
          </template>
          <div class="section-content">
            <div v-for="(word, index) in wordAnalysis" :key="index" class="word-item">
              <span class="word">{{ word.word }}</span>
              <span class="pinyin">{{ word.pinyin }}</span>
              <span class="meaning">{{ word.meaning }}</span>
            </div>
          </div>
        </el-card>

        <!-- 意象分析 -->
        <el-card class="analysis-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <el-icon><Picture /></el-icon>
              <span>意象分析</span>
            </div>
          </template>
          <div class="section-content">
            <div v-for="(imagery, index) in imageryAnalysis" :key="index" class="imagery-item">
              <h4>{{ imagery.type }}</h4>
              <p>{{ imagery.description }}</p>
              <div class="examples">
                <span v-for="example in imagery.examples" :key="example" class="example-tag">
                  {{ example }}
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 整体赏析 -->
        <el-card class="analysis-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <el-icon><Star /></el-icon>
              <span>整体赏析</span>
            </div>
          </template>
          <div class="section-content">
            <div class="appreciation-content">
              <h4>主题思想</h4>
              <p>{{ overallAnalysis.themes.join('、') }}</p>
              
              <h4>艺术特色</h4>
              <p>{{ overallAnalysis.artisticFeatures }}</p>
              
              <h4>情感表达</h4>
              <p>{{ overallAnalysis.emotionalExpression }}</p>
            </div>
          </div>
        </el-card>

        <!-- 作者生平 -->
        <el-card class="analysis-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <el-icon><User /></el-icon>
              <span>作者生平</span>
            </div>
          </template>
          <div class="section-content">
            <div class="author-bio">
              <h4>{{ authorInfo.name }}</h4>
              <p><strong>朝代：</strong>{{ authorInfo.dynasty }}</p>
              <p><strong>生卒：</strong>{{ authorInfo.lifespan }}</p>
              <p><strong>代表作品：</strong>{{ authorInfo.masterpieces.join('、') }}</p>
              <p class="bio-text">{{ authorInfo.biography }}</p>
            </div>
          </div>
        </el-card>

        <!-- 历史背景 -->
        <el-card class="analysis-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <el-icon><Histogram /></el-icon>
              <span>历史背景</span>
            </div>
          </template>
          <div class="section-content">
            <div class="historical-context">
              <h4>创作背景</h4>
              <p>{{ historicalContext.background }}</p>
              
              <h4>时代特征</h4>
              <p>{{ historicalContext.eraCharacteristics }}</p>
              
              <h4>文化影响</h4>
              <p>{{ historicalContext.culturalImpact }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- AI助手聊天区 -->
      <el-card class="ai-assistant" shadow="hover">
        <template #header>
          <div class="section-header">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI诗词导师</span>
          </div>
        </template>
        <div class="chat-container">
          <div class="chat-messages">
            <div 
              v-for="message in chatMessages" 
              :key="message.id"
              class="message"
              :class="{ 'user': message.role === 'user', 'assistant': message.role === 'assistant' }"
            >
              <div class="message-content">
                {{ message.content }}
              </div>
            </div>
          </div>
          <div class="chat-input">
            <el-input
              v-model="userMessage"
              placeholder="向AI导师提问..."
              @keyup.enter="sendMessage"
            >
              <template #append>
                <el-button @click="sendMessage">
                  <el-icon><Promotion /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </el-card>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAIStore } from '@/stores/ai'
import type { Poem } from '@/types/poem'
import {
  ArrowLeft,
  VideoPlay,
  FullScreen,
  Document,
  Picture,
  Star,
  User,
  Histogram,
  ChatDotRound,
  Promotion
} from '@element-plus/icons-vue'

const route = useRoute()
const aiStore = useAIStore()

const poemId = computed(() => route.params.id as string)
const poem = ref<Poem | null>(null)
const activeLine = ref(0)
const isPlaying = ref(false)
const userMessage = ref('')
const chatMessages = ref<any[]>([])

// 模拟数据
const wordAnalysis = ref([
  { word: '明月', pinyin: 'míng yuè', meaning: '明亮的月亮' },
  { word: '疑是', pinyin: 'yí shì', meaning: '怀疑是' },
  { word: '举头', pinyin: 'jǔ tóu', meaning: '抬头' },
  { word: '思故乡', pinyin: 'sī gù xiāng', meaning: '思念故乡' }
])

const imageryAnalysis = ref([
  {
    type: '自然意象',
    description: '通过月亮表达思乡之情',
    examples: ['明月', '地上霜']
  },
  {
    type: '动作意象', 
    description: '通过动作展现内心情感',
    examples: ['举头', '低头']
  }
])

const overallAnalysis = ref({
  themes: ['思乡', '孤独', '夜晚'],
  artisticFeatures: '语言简练，意境深远',
  emotionalExpression: '深沉含蓄的思乡之情'
})

const authorInfo = ref({
  name: '李白',
  dynasty: '唐代',
  lifespan: '701年-762年',
  masterpieces: ['静夜思', '将进酒', '蜀道难'],
  biography: '唐代著名浪漫主义诗人，被誉为"诗仙"'
})

const historicalContext = ref({
  background: '创作于唐代盛世，诗人漂泊在外时所作',
  eraCharacteristics: '唐代文化繁荣，诗歌创作达到顶峰',
  culturalImpact: '成为思乡诗的代表作，影响深远'
})

const toggleAudio = () => {
  isPlaying.value = !isPlaying.value
  // 音频播放逻辑
}

const toggleFullscreen = () => {
  // 全屏逻辑
}

const setActiveLine = (index: number) => {
  activeLine.value = index
}

const sendMessage = async () => {
  if (!userMessage.value.trim()) return
  
  const userMsg = {
    id: Date.now().toString(),
    role: 'user' as const,
    content: userMessage.value,
    timestamp: new Date()
  }
  
  chatMessages.value.push(userMsg)
  
  try {
    const response = await aiStore.sendMessage(userMessage.value, poemId.value)
    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: response.content,
      timestamp: new Date()
    }
    chatMessages.value.push(assistantMsg)
  } catch (error) {
    console.error('发送消息失败:', error)
  }
  
  userMessage.value = ''
}

onMounted(() => {
  // 模拟加载诗词数据
  poem.value = {
    id: poemId.value,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: [
      '床前明月光，',
      '疑是地上霜。',
      '举头望明月，',
      '低头思故乡。'
    ],
    annotations: [],
    difficulty: 'easy',
    tags: ['思乡', '月亮'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  // 初始化AI对话
  aiStore.createConversation(poemId.value)
})
</script>

<style lang="scss" scoped>
.detailed-analysis {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .analysis-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #e4e7ed;
    
    .poem-title {
      margin: 0;
      color: #303133;
      font-size: 24px;
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .analysis-content {
    padding: 20px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    
    .poem-original {
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      
      .poem-text {
        padding: 20px;
        
        .poem-line {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f5f7fa;
          }
          
          &.active {
            background: #409eff;
            color: white;
            
            .line-number {
              background: white;
              color: #409eff;
            }
          }
          
          .line-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: #409eff;
            color: white;
            border-radius: 50%;
            margin-right: 15px;
            font-size: 12px;
            font-weight: bold;
          }
          
          .line-text {
            font-size: 18px;
            line-height: 1.6;
          }
        }
      }
    }
    
    .analysis-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
      
      .analysis-section {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #409eff;
        }
        
        .section-content {
          .word-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            
            .word {
              font-weight: bold;
              color: #303133;
            }
            
            .pinyin {
              color: #909399;
              font-size: 12px;
            }
            
            .meaning {
              color: #606266;
            }
          }
          
          .imagery-item {
            margin-bottom: 15px;
            
            h4 {
              margin: 0 0 8px 0;
              color: #409eff;
            }
            
            .examples {
              margin-top: 8px;
              
              .example-tag {
                display: inline-block;
                background: #f0f9ff;
                color: #409eff;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                margin-right: 5px;
              }
            }
          }
          
          .appreciation-content,
          .author-bio,
          .historical-context {
            h4 {
              margin: 15px 0 8px 0;
              color: #409eff;
              font-size: 14px;
            }
            
            p {
              margin: 0 0 10px 0;
              line-height: 1.6;
              color: #606266;
            }
          }
        }
      }
    }
    
    .ai-assistant {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      
      .chat-container {
        .chat-messages {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 15px;
          
          .message {
            margin-bottom: 10px;
            
            &.user {
              text-align: right;
              
              .message-content {
                background: #409eff;
                color: white;
              }
            }
            
            &.assistant {
              text-align: left;
              
              .message-content {
                background: #f5f7fa;
                color: #303133;
              }
            }
            
            .message-content {
              display: inline-block;
              padding: 8px 12px;
              border-radius: 12px;
              max-width: 70%;
              word-wrap: break-word;
            }
          }
        }
      }
    }
  }
}

// 动画效果
.poem-line {
  animation: slideUp 0.5s ease-out;
}

.analysis-section {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
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