<template>
  <div class="user-profile">
    <el-card shadow="never">
      <template #header>
        <div class="profile-header">
          <div class="avatar-section">
            <el-avatar 
              :size="80" 
              :src="user.avatar_url" 
              :alt="user.username"
            >
              {{ user.username.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="user-info">
              <h2>{{ user.username }}</h2>
              <p class="user-email">{{ user.email }}</p>
              <el-tag :type="user.role === 'teacher' ? 'warning' : 'success'">
                {{ user.role === 'teacher' ? '教师' : '学生' }}
              </el-tag>
            </div>
          </div>
          <el-button 
            type="primary" 
            link 
            @click="handleEditProfile"
          >
            <el-icon><Edit /></el-icon>
            编辑资料
          </el-button>
        </div>
      </template>
      
      <div class="profile-stats">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ user.streak_days || 0 }}</div>
              <div class="stat-label">连续学习天数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ user.analyzed_poems || 0 }}</div>
              <div class="stat-label">解析诗词数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ user.average_score || 0 }}</div>
              <div class="stat-label">平均得分</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ user.learning_progress || 0 }}%</div>
              <div class="stat-label">学习进度</div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="profile-details">
        <el-descriptions title="学习详情" :column="2" border>
          <el-descriptions-item label="掌握等级">
            <el-tag :type="getMasteryLevelType(user.mastery_level)">
              {{ user.mastery_level || '初级' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="本周活跃度">
            {{ user.weekly_activity || 0 }}%
          </el-descriptions-item>
          <el-descriptions-item label="本周学习时长">
            {{ user.weekly_study_time || 0 }} 小时
          </el-descriptions-item>
          <el-descriptions-item label="完成率">
            {{ user.completion_rate || 0 }}%
          </el-descriptions-item>
          <el-descriptions-item label="兴趣标签" :span="2">
            <el-tag 
              v-for="interest in user.interests" 
              :key="interest" 
              size="small" 
              type="info"
              class="interest-tag"
            >
              {{ interest }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后登录">
            {{ formatDate(user.last_login_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ formatDate(user.created_at) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import type { User } from '@/lib/supabase'

interface Props {
  user: User
}

interface Emits {
  (e: 'edit-profile'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const getMasteryLevelType = (level?: string) => {
  switch (level) {
    case '初级': return 'info'
    case '中级': return 'success'
    case '高级': return 'warning'
    case '专家': return 'danger'
    default: return 'info'
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleEditProfile = () => {
  emit('edit-profile')
}
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  color: #2c3e50;
}

.user-email {
  margin: 0 0 8px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.profile-stats {
  margin: 24px 0;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

.profile-details {
  margin-top: 24px;
}

.interest-tag {
  margin: 2px;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>