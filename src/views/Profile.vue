<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
    </div>

    <div class="profile-content">
      <div class="profile-layout">
        <!-- 左侧：个人信息 -->
        <div class="profile-sidebar">
          <div class="user-card">
            <div class="user-avatar">
              <el-avatar :size="80" :src="userProfile?.avatar_url">
                {{ userProfile?.username?.charAt(0) || 'U' }}
              </el-avatar>
            </div>
            <div class="user-info">
              <h2 class="username">{{ userProfile?.username || '用户' }}</h2>
              <p class="user-email">{{ userProfile?.email }}</p>
              <el-tag :type="getRoleTag(userProfile?.role)" size="small">
                {{ getRoleText(userProfile?.role) }}
              </el-tag>
            </div>
          </div>

          <div class="stats-card">
            <h3 class="stats-title">学习统计</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.analyzed_poems || 0 }}</div>
                <div class="stat-label">已解析诗词</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.streak_days || 0 }}</div>
                <div class="stat-label">连续学习天数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.average_score || 0 }}%</div>
                <div class="stat-label">平均得分</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.mastery_level || '初级' }}</div>
                <div class="stat-label">掌握等级</div>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h3 class="actions-title">快捷操作</h3>
            <div class="actions-grid">
              <el-button type="primary" @click="editProfile">
                <el-icon><Edit /></el-icon>
                编辑资料
              </el-button>
              <el-button @click="changePassword">
                <el-icon><Lock /></el-icon>
                修改密码
              </el-button>
              <el-button @click="viewHistory">
                <el-icon><Clock /></el-icon>
                学习历史
              </el-button>
              <el-button @click="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-button>
            </div>
          </div>
        </div>

        <!-- 右侧：详细信息和活动 -->
        <div class="profile-main">
          <!-- 学习进度 -->
          <div class="section-card">
            <h3 class="section-title">学习进度</h3>
            <div class="progress-stats">
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">总体进度</span>
                  <span class="progress-value">{{ userStats?.learning_progress || 0 }}%</span>
                </div>
                <el-progress 
                  :percentage="userStats?.learning_progress || 0" 
                  :show-text="false"
                />
              </div>
              
              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">本周活跃度</span>
                  <span class="progress-value">{{ userStats?.weekly_activity || 0 }}%</span>
                </div>
                <el-progress 
                  :percentage="userStats?.weekly_activity || 0" 
                  :show-text="false"
                  status="success"
                />
              </div>

              <div class="progress-item">
                <div class="progress-info">
                  <span class="progress-label">完成率</span>
                  <span class="progress-value">{{ userStats?.completion_rate || 0 }}%</span>
                </div>
                <el-progress 
                  :percentage="userStats?.completion_rate || 0" 
                  :show-text="false"
                  status="warning"
                />
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="section-card">
            <h3 class="section-title">最近活动</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon">
                  <el-icon><Reading /></el-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-time">{{ formatTime(activity.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 兴趣标签 -->
          <div class="section-card">
            <h3 class="section-title">兴趣标签</h3>
            <div class="interest-tags">
              <el-tag
                v-for="interest in userProfile?.interests || []"
                :key="interest"
                type="info"
                size="large"
                class="interest-tag"
              >
                {{ interest }}
              </el-tag>
              <el-button text @click="editInterests" class="add-interest">
                <el-icon><Plus /></el-icon>
                添加兴趣
              </el-button>
            </div>
          </div>

          <!-- 账户信息 -->
          <div class="section-card">
            <h3 class="section-title">账户信息</h3>
            <div class="account-info">
              <div class="info-item">
                <span class="info-label">注册时间：</span>
                <span class="info-value">{{ formatDate(userProfile?.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">最后登录：</span>
                <span class="info-value">{{ formatDate(userProfile?.last_login_at) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">学习时长：</span>
                <span class="info-value">{{ formatStudyTime(userStats?.weekly_study_time) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, Lock, Clock, SwitchButton, Reading, Plus } from '@element-plus/icons-vue'
import { generateMockUser } from '@/utils/mockData'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const userProfile = ref<any>(null)
const userStats = ref<any>(null)
const recentActivities = ref<any[]>([])

onMounted(async () => {
  await loadUserProfile()
  await loadUserStats()
  await loadRecentActivities()
})

const loadUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // 获取用户详细信息
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('加载用户资料失败:', error)
        userProfile.value = generateMockUser()
      } else {
        userProfile.value = { ...user, ...profileData }
      }
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('加载用户资料异常:', error)
    userProfile.value = generateMockUser()
  }
}

const loadUserStats = async () => {
  try {
    // 这里可以加载用户的学习统计数据
    userStats.value = generateMockUser()
  } catch (error) {
    console.error('加载用户统计异常:', error)
    userStats.value = generateMockUser()
  }
}

const loadRecentActivities = async () => {
  try {
    // 模拟最近活动数据
    recentActivities.value = [
      {
        id: '1',
        title: '解析了《静夜思》',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: '完成了唐诗学习任务',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        title: '收藏了《春晓》',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  } catch (error) {
    console.error('加载活动记录异常:', error)
  }
}

const getRoleTag = (role: string) => {
  const map: Record<string, any> = {
    student: 'success',
    teacher: 'warning',
    admin: 'danger'
  }
  return map[role] || 'info'
}

const getRoleText = (role: string) => {
  const map: Record<string, string> = {
    student: '学生',
    teacher: '教师',
    admin: '管理员'
  }
  return map[role] || '用户'
}

const editProfile = () => {
  ElMessage.info('编辑资料功能开发中')
}

const changePassword = () => {
  ElMessage.info('修改密码功能开发中')
}

const viewHistory = () => {
  ElMessage.info('查看学习历史功能开发中')
}

const editInterests = () => {
  ElMessage.info('编辑兴趣功能开发中')
}

const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error: any) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
  }
}

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleString('zh-CN')
}

const formatDate = (timeString: string) => {
  if (!timeString) return '未知'
  return new Date(timeString).toLocaleDateString('zh-CN')
}

const formatStudyTime = (minutes: number) => {
  if (!minutes) return '0分钟'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 0;
}

.page-title {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  margin-bottom: 16px;
}

.username {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.user-email {
  margin: 0 0 12px 0;
  color: #909399;
  font-size: 14px;
}

.stats-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.quick-actions {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.actions-grid {
  display: grid;
  gap: 12px;
}

.actions-grid .el-button {
  justify-content: flex-start;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 14px;
  color: #606266;
}

.progress-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.activity-icon {
  color: #409eff;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.interest-tag {
  margin: 2px;
}

.add-interest {
  margin-left: 8px;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-size: 14px;
  color: #606266;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

@media (max-width: 968px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-content {
    padding: 16px;
  }

  .section-card {
    padding: 16px;
  }
}
</style>