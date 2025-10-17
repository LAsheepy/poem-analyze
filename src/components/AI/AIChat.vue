<template>
  <div class="ai-chat">
    <el-card header="AI诗词助手" class="chat-container">
      <div class="chat-messages">
        <div v-for="message in messages" :key="message.id" 
             :class="['message', message.role]">
          <div class="avatar">
            <el-avatar :size="32" :src="message.role === 'user' ? userAvatar : aiAvatar">
              {{ message.role === 'user' ? '我' : 'AI' }}
            </el-avatar>
          </div>
          <div class="content">
            <div class="text" v-html="formatMessage(message.content)"></div>
            <div class="time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          placeholder="向AI助手提问关于诗词的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        >
          <template #append>
            <el-button 
              :loading="isLoading" 
              @click="sendMessage"
              type="primary"
            >
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAIStore } from '@/stores/ai'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const aiStore = useAIStore()
const userStore = useUserStore()

const inputMessage = ref('')
const isLoading = ref(false)

// 计算属性
const messages = computed(() => aiStore.currentConversation?.messages || [])
const userAvatar = computed(() => userStore.user?.avatarUrl || '')
const aiAvatar = computed(() => '/ai-avatar.png')

// 方法
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  isLoading.value = true
  
  try {
    await aiStore.sendMessage(message)
    ElMessage.success('消息发送成功')
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const formatMessage = (content: string) => {
  // 简单的Markdown格式处理
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 加载默认对话
  if (!aiStore.currentConversationId) {
    aiStore.createConversation('诗词学习对话')
  }
})
</script>

<style scoped>
.ai-chat {
  height: 100%;
}

.chat-container {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.message .avatar {
  flex-shrink: 0;
}

.message .content {
  max-width: 70%;
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 8px;
  position: relative;
}

.message.user .content {
  background: #409eff;
  color: white;
}

.message .text {
  line-height: 1.6;
}

.message .time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.message.user .time {
  color: rgba(255, 255, 255, 0.8);
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>