<template>
  <div class="chat-page">
    <!-- 简洁顶部栏 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">AI诗词助手</h1>
        <p class="page-subtitle">与AI讨论诗词，获得个性化解析</p>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <div class="chat-container">
        <!-- 左侧：对话列表 -->
        <div class="conversation-sidebar">
          <div class="sidebar-header">
            <h3>对话历史</h3>
            <el-button type="primary" size="small" @click="startNewConversation">
              <el-icon><Plus /></el-icon>
              新建对话
            </el-button>
          </div>
        
        <div class="conversation-list">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="conversation-item"
            :class="{ active: activeConversation?.id === conv.id }"
            @click="selectConversation(conv)"
          >
            <div class="conv-title">{{ conv.title }}</div>
            <div class="conv-time">{{ formatTime(conv.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>

      <!-- 右侧：聊天界面 -->
      <div class="chat-main">
        <div class="chat-messages" ref="messagesContainer">
          <div
            v-for="message in activeConversation?.messages"
            :key="message.id"
            class="message"
            :class="message.role"
          >
            <div class="message-avatar">
              <el-avatar :size="32">
                <span v-if="message.role === 'user'">👤</span>
                <span v-else>🤖</span>
              </el-avatar>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-container">
            <el-input
              v-model="currentMessage"
              type="textarea"
              :rows="3"
              placeholder="输入您的问题或想讨论的诗词..."
              @keydown.enter.prevent="sendMessage"
            />
            <div class="input-actions">
              <el-button type="primary" @click="sendMessage" :loading="isLoading">
                <el-icon><svg viewBox="0 0 1024 1024" width="16" height="16"><path fill="currentColor" d="M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2-3.7 0.9-6.9 3-9 6.1-2.1 3.1-3.1 6.8-2.7 10.5l86.3 352.8-86.3 352.8c-0.4 3.7 0.6 7.4 2.7 10.5 2.1 3.1 5.3 5.2 9 6.1 0.8 0.2 1.6 0.3 2.4 0.3 2.9 0 5.7-0.9 8.1-2.6l836.5-419.4c3.1-1.6 5.2-4.5 5.9-7.8 0.7-3.3-0.1-6.7-2.1-9.3-1.9-2.6-4.9-4.2-8.1-4.2zM170.8 834.3l63.3-258.9 258.9-63.3-258.9-63.3-63.3-258.9 580.5 290.3-580.5 290.3z"/></svg></el-icon>
                发送
              </el-button>
              <el-button @click="clearInput">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { generateMockConversations } from '@/utils/mockData'
import { supabase } from '@/lib/supabase'
import type { AIConversation, AIMessage } from '@/types/ai'

const route = useRoute()
const messagesContainer = ref<HTMLElement>()
const currentMessage = ref('')
const isLoading = ref(false)

// 对话数据
const conversations = ref<AIConversation[]>([])
const activeConversation = ref<AIConversation | null>(null)

const poemId = computed(() => route.query.poem as string)

onMounted(async () => {
  await loadConversations()
  if (poemId.value) {
    startPoemDiscussion(poemId.value)
  }
})

const loadConversations = async () => {
  try {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('加载对话失败:', error)
      conversations.value = generateMockConversations()
    } else if (data && data.length > 0) {
      // 转换数据库字段名到TypeScript类型
      conversations.value = data.map(conv => ({
        id: conv.id,
        userId: conv.user_id,
        poemId: conv.poem_id,
        title: conv.title,
        messages: conv.messages || [],
        createdAt: conv.created_at,
        updatedAt: conv.updated_at
      }))
    } else {
      conversations.value = generateMockConversations()
    }

    // 设置默认活跃对话
    if (conversations.value.length > 0) {
      activeConversation.value = conversations.value[0]
    }
  } catch (error) {
    console.error('加载对话异常:', error)
    conversations.value = generateMockConversations()
    if (conversations.value.length > 0) {
      activeConversation.value = conversations.value[0]
    }
  }
}

const startNewConversation = () => {
  const newConv: AIConversation = {
    id: Date.now().toString(),
    userId: '', // 将在保存时设置
    poemId: null,
    title: '新对话',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  conversations.value.unshift(newConv)
  activeConversation.value = newConv
}

const selectConversation = (conv: AIConversation) => {
  activeConversation.value = conv
}

const startPoemDiscussion = (poemId: string) => {
  // 这里可以根据诗词ID加载相关诗词信息
  currentMessage.value = `请帮我分析一下这首诗词`
}

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return

  if (!activeConversation.value) {
    startNewConversation()
  }

  const userMessage: AIMessage = {
    id: Date.now().toString(),
    conversationId: activeConversation.value.id,
    role: 'user',
    content: currentMessage.value,
    timestamp: new Date()
  }

  // 添加到当前对话
  activeConversation.value.messages.push(userMessage)
  
  // 更新对话标题（如果是第一条消息）
  if (activeConversation.value.messages.length === 1) {
    activeConversation.value.title = currentMessage.value.slice(0, 20) + '...'
  }

  scrollToBottom()
  const userInput = currentMessage.value
  currentMessage.value = ''
  isLoading.value = true

  try {
    // 模拟AI回复
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const aiResponse = await generateAIResponse(userInput)
    
    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      conversationId: activeConversation.value.id,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }

    activeConversation.value.messages.push(aiMessage)
    scrollToBottom()

    // 保存到数据库
    await saveConversation(activeConversation.value)

  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const generateAIResponse = async (userInput: string): Promise<string> => {
  // 这里可以集成真实的AI服务
  const responses = [
    '这首诗词表达了深切的思乡之情，通过月光意象营造出宁静而忧郁的氛围。',
    '从文学角度看，这首诗运用了对比手法，将自然景物与内心情感巧妙结合。',
    '这首诗的意境深远，语言简练，体现了作者高超的艺术造诣。',
    '从历史背景来看，这首诗反映了当时文人的普遍情感和时代特征。',
    '这首诗的韵律优美，结构严谨，是古典诗词的典范之作。'
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

const saveConversation = async (conversation: AIConversation) => {
  try {
    // 转换TypeScript类型到数据库字段名
    const dbConversation = {
      id: conversation.id,
      user_id: conversation.userId,
      poem_id: conversation.poemId,
      title: conversation.title,
      messages: conversation.messages.map(msg => ({
        id: msg.id,
        conversation_id: msg.conversationId,
        role: msg.role,
        content: msg.content,
        created_at: msg.timestamp.toISOString()
      })),
      created_at: conversation.createdAt,
      updated_at: conversation.updatedAt
    }

    const { error } = await supabase
      .from('ai_conversations')
      .upsert(dbConversation)

    if (error) {
      console.error('保存对话失败:', error)
    }
  } catch (error) {
    console.error('保存对话异常:', error)
  }
}

const clearInput = () => {
  currentMessage.value = ''
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 在模板中显示时间时使用
const formatMessageTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.chat-container {
  height: calc(100vh - 200px);
  background: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.conversation-sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background: #f5f7fa;
}

.conversation-item.active {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.conv-title {
  font-weight: 500;
  margin-bottom: 4px;
  color: #303133;
}

.conv-time {
  font-size: 12px;
  color: #909399;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: calc(100% - 120px);
}

.message {
  display: flex;
  margin-bottom: 20px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 12px;
}

.message-content {
  max-width: calc(100% - 60px);
}

.message.user .message-content {
  text-align: right;
}

.message-text {
  background: #f0f2f5;
  padding: 12px 16px;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user .message-text {
  background: #409eff;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #e4e7ed;
  background: white;
  flex-shrink: 0;
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .conversation-sidebar {
    width: 250px;
  }
  
  .message {
    max-width: 90%;
  }
}
</style>