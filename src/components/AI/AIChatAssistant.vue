<template>
  <div class="ai-chat-assistant">
    <!-- 聊天窗口 -->
    <el-card class="chat-container">
      <template #header>
        <div class="chat-header">
          <div class="assistant-info">
            <el-avatar :size="32" :src="assistantAvatar" />
            <span class="assistant-name">诗词AI助手</span>
          </div>
          <el-button type="text" @click="clearChat">
            <el-icon><Refresh /></el-icon>
            清空对话
          </el-button>
        </div>
      </template>

      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', message.role]"
        >
          <div class="message-avatar">
            <el-avatar 
              :size="32" 
              :src="message.role === 'user' ? userAvatar : assistantAvatar" 
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- 用户消息 -->
              <div v-if="message.role === 'user'" class="user-message">
                {{ message.content }}
              </div>
              
              <!-- AI助手消息 -->
              <div v-else class="assistant-message">
                <div v-if="message.isLoading" class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
                <div v-else v-html="formatMessage(message.content)"></div>
              </div>
            </div>
            
            <!-- 消息操作 -->
            <div v-if="message.role === 'assistant' && !message.isLoading" class="message-actions">
              <el-button type="text" size="small" @click="copyMessage(message.content)">
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
              <el-button type="text" size="small" @click="saveAnalysis(message.content)">
                <el-icon><Star /></el-icon>
                保存分析
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="请输入您想了解的诗词或诗人..."
          :disabled="isLoading"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <div class="input-actions">
          <div class="quick-actions">
            <el-button 
              v-for="action in quickActions" 
              :key="action.text"
              type="text" 
              size="small"
              @click="handleQuickAction(action)"
            >
              {{ action.text }}
            </el-button>
          </div>
          <el-button 
            type="primary" 
            :loading="isLoading"
            @click="sendMessage"
            :disabled="!inputMessage.trim()"
          >
            <el-icon><Promotion /></el-icon>
            发送
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { deepSeekService } from '@/services/deepseekService'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
  timestamp: number
}

const userStore = useUserStore()
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()

// 头像和配置
const userAvatar = '/default-avatar.png'
const assistantAvatar = '/ai-assistant.png'

// 快捷操作
const quickActions = [
  { text: '解析《静夜思》', prompt: '请帮我解析李白的《静夜思》' },
  { text: '介绍李白', prompt: '请介绍一下诗人李白的生平和创作特点' },
  { text: '唐诗特点', prompt: '唐诗的主要特点是什么？' },
  { text: '宋词格式', prompt: '宋词的基本格式和韵律要求是什么？' }
]

// 调用DeepSeek API获取回复
const getDeepSeekResponse = async (userMessage: string): Promise<string> => {
  try {
    // 检查是否为诗词解析请求
    const lowerMessage = userMessage.toLowerCase()
    const poemKeywords = ['诗', '词', '诗人', '解析', '分析', '李白', '杜甫', '苏轼', '静夜思', '唐诗', '宋词']
    const isPoemRelated = poemKeywords.some(keyword => lowerMessage.includes(keyword))
    
    if (isPoemRelated) {
      // 尝试提取诗词内容和诗人信息
      const poemMatch = userMessage.match(/(《([^》]+)》|"([^"]+)"|'([^']+)'|([^，。！？]+诗)|([^，。！？]+词))/)
      const poetMatch = userMessage.match(/(李白|杜甫|苏轼|白居易|王维|李清照|辛弃疾|陆游|陶渊明)/)
      
      if (poemMatch) {
        const poemContent = poemMatch[1]
        const poet = poetMatch ? poetMatch[1] : undefined
        
        if (poet) {
          return await deepSeekService.analyzePoem(poemContent, poet)
        } else {
          return await deepSeekService.analyzePoem(poemContent)
        }
      } else if (poetMatch) {
        return await deepSeekService.introducePoet(poetMatch[1])
      }
    }
    
    // 通用对话处理
    const messages = [
      {
        role: 'system' as const,
        content: `你是一个专业的诗词AI助手，专门帮助用户理解古典诗词和文化。请用中文回答，回答要专业、详细且富有文化内涵。

**你的核心能力：**
1. 解析诗词的意境和情感
2. 分析诗词的艺术特色和修辞手法  
3. 介绍诗人的生平和创作背景
4. 比较不同诗词的异同
5. 提供诗词创作建议
6. 解答诗词相关的文化知识问题

**回答要求：**
- 保持回答的专业性和准确性
- 语言优美，富有文学气息
- 结构清晰，层次分明
- 适当引用相关诗词进行对比

如果用户的问题与诗词无关，请礼貌地引导用户关注诗词相关内容。`
      },
      {
        role: 'user' as const,
        content: userMessage
      }
    ]
    
    const response = await deepSeekService.sendMessage(messages, 'general_chat')
    return response.choices[0].message.content
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    throw new Error('AI服务暂时不可用，请稍后重试')
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  })
  
  // 添加加载中的AI消息
  const loadingMessage: ChatMessage = {
    role: 'assistant',
    content: '',
    isLoading: true,
    timestamp: Date.now()
  }
  messages.value.push(loadingMessage)
  
  isLoading.value = true
  scrollToBottom()
  
  try {
    // 获取DeepSeek AI回复
    const aiResponse = await getDeepSeekResponse(userMessage)
    
    // 更新AI消息
    const lastIndex = messages.value.length - 1
    messages.value[lastIndex] = {
      role: 'assistant',
      content: aiResponse,
      isLoading: false,
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('DeepSeek回复失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '回复生成失败，请重试')
    
    // 移除加载消息
    messages.value.pop()
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 处理快捷操作
const handleQuickAction = (action: any) => {
  inputMessage.value = action.prompt
}

// 复制消息
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content.replace(/<\/?[^>]+(>|$)/g, ''))
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

// 保存分析
const saveAnalysis = (content: string) => {
  if (!userStore.isAuthenticated) {
    ElMessage.warning('请先登录以保存分析')
    return
  }
  ElMessage.success('分析已保存到个人收藏')
}

// 清空对话
const clearChat = () => {
  messages.value = []
  ElMessage.info('对话已清空')
}

// 格式化消息（支持简单Markdown）
const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/- (.*?)(<br>|$)/g, '• $1<br>')
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  // 添加欢迎消息
  messages.value.push({
    role: 'assistant',
    content: '您好！我是诗词AI助手，可以帮您解析诗词、介绍诗人、解答文学问题。请告诉我您想了解的内容！',
    timestamp: Date.now()
  })
  scrollToBottom()
})
</script>

<style scoped>
.ai-chat-assistant {
  max-width: 800px;
  margin: 0 auto;
}

.chat-container {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assistant-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assistant-name {
  font-weight: 600;
  color: #303133;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 1.5;
}

.user-message {
  background: #409eff;
  color: white;
}

.assistant-message {
  background: #f5f7fa;
  color: #303133;
  border: 1px solid #e4e7ed;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #909399;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.message-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.input-container {
  border-top: 1px solid #e4e7ed;
  padding: 16px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

:deep(.el-textarea__inner) {
  resize: none;
}
</style>