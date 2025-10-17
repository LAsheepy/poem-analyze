<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">设置</h1>
      <p class="page-subtitle">管理您的账户和偏好设置</p>
    </div>

    <div class="settings-content">
      <el-row :gutter="24">
        <!-- 左侧：设置菜单 -->
        <el-col :span="8">
          <el-card class="settings-menu-card">
            <template #header>
              <span class="card-title">设置选项</span>
            </template>
            <el-menu :default-active="activeSetting" class="settings-menu">
              <el-menu-item index="profile" @click="activeSetting = 'profile'">
                <el-icon><User /></el-icon>
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item index="account" @click="activeSetting = 'account'">
                <el-icon><Lock /></el-icon>
                <span>账户安全</span>
              </el-menu-item>
              <el-menu-item index="preferences" @click="activeSetting = 'preferences'">
                <el-icon><Setting /></el-icon>
                <span>偏好设置</span>
              </el-menu-item>
              <el-menu-item index="notifications" @click="activeSetting = 'notifications'">
                <el-icon><Bell /></el-icon>
                <span>通知设置</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </el-col>

        <!-- 右侧：设置内容 -->
        <el-col :span="16">
          <!-- 个人信息设置 -->
          <el-card v-if="activeSetting === 'profile'" class="setting-content-card">
            <template #header>
              <span class="card-title">个人信息</span>
            </template>
            <el-form :model="profileForm" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" disabled />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input 
                  v-model="profileForm.bio" 
                  type="textarea" 
                  :rows="3" 
                  placeholder="请输入个人简介" 
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveProfile">保存更改</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 账户安全设置 -->
          <el-card v-if="activeSetting === 'account'" class="setting-content-card">
            <template #header>
              <span class="card-title">账户安全</span>
            </template>
            <div class="security-settings">
              <div class="security-item">
                <div class="security-info">
                  <h4>修改密码</h4>
                  <p>定期修改密码以保护账户安全</p>
                </div>
                <el-button type="primary" @click="showChangePassword = true">
                  修改密码
                </el-button>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <h4>登录设备</h4>
                  <p>管理您的登录设备</p>
                </div>
                <el-button @click="showDevices = true">查看设备</el-button>
              </div>
            </div>
          </el-card>

          <!-- 偏好设置 -->
          <el-card v-if="activeSetting === 'preferences'" class="setting-content-card">
            <template #header>
              <span class="card-title">偏好设置</span>
            </template>
            <div class="preference-settings">
              <el-form>
                <el-form-item label="主题模式">
                  <el-radio-group v-model="preferences.theme">
                    <el-radio label="light">浅色模式</el-radio>
                    <el-radio label="dark">深色模式</el-radio>
                    <el-radio label="auto">跟随系统</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="语言">
                  <el-select v-model="preferences.language" placeholder="选择语言">
                    <el-option label="简体中文" value="zh-CN" />
                    <el-option label="English" value="en" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="字体大小">
                  <el-slider 
                    v-model="preferences.fontSize" 
                    :min="12" 
                    :max="18" 
                    :step="1" 
                    show-stops 
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="savePreferences">保存设置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <!-- 通知设置 -->
          <el-card v-if="activeSetting === 'notifications'" class="setting-content-card">
            <template #header>
              <span class="card-title">通知设置</span>
            </template>
            <div class="notification-settings">
              <el-form>
                <el-form-item label="学习提醒">
                  <el-switch v-model="notifications.studyReminders" />
                </el-form-item>
                
                <el-form-item label="新功能通知">
                  <el-switch v-model="notifications.newFeatures" />
                </el-form-item>
                
                <el-form-item label="系统消息">
                  <el-switch v-model="notifications.systemMessages" />
                </el-form-item>
                
                <el-form-item label="邮件通知">
                  <el-switch v-model="notifications.emailNotifications" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveNotifications">保存设置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showChangePassword" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Setting, Bell } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/lib/supabase'

const userStore = useUserStore()
const activeSetting = ref('profile')
const showChangePassword = ref(false)
const showDevices = ref(false)

// 表单数据
const profileForm = ref({
  username: '',
  email: '',
  bio: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = ref({
  theme: 'light',
  language: 'zh-CN',
  fontSize: 14
})

const notifications = ref({
  studyReminders: true,
  newFeatures: true,
  systemMessages: true,
  emailNotifications: false
})

onMounted(async () => {
  await loadUserData()
})

const loadUserData = async () => {
  try {
    const user = await userStore.loadUser()
    if (user) {
      profileForm.value.username = user.username || ''
      profileForm.value.email = user.email || ''
      profileForm.value.bio = user.bio || ''
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    ElMessage.error('加载用户数据失败')
  }
}

const saveProfile = async () => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: profileForm.value.username,
        bio: profileForm.value.bio,
        updated_at: new Date().toISOString()
      })
      .eq('id', userStore.user?.id)

    if (error) throw error
    
    ElMessage.success('个人信息已更新')
    await userStore.loadUser() // 重新加载用户数据
  } catch (error) {
    console.error('保存个人信息失败:', error)
    ElMessage.error('保存失败')
  }
}

const changePassword = async () => {
  try {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword
    })

    if (error) throw error
    
    ElMessage.success('密码修改成功')
    showChangePassword.value = false
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error: any) {
    console.error('修改密码失败:', error)
    ElMessage.error(error.message || '修改密码失败')
  }
}

const savePreferences = () => {
  // 保存偏好设置到本地存储
  localStorage.setItem('userPreferences', JSON.stringify(preferences.value))
  ElMessage.success('偏好设置已保存')
}

const saveNotifications = () => {
  // 保存通知设置到本地存储
  localStorage.setItem('userNotifications', JSON.stringify(notifications.value))
  ElMessage.success('通知设置已保存')
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.page-title {
  margin: 0 0 12px 0;
  font-size: 36px;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.settings-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.settings-menu-card,
.setting-content-card {
  margin-bottom: 24px;
}

.settings-menu {
  border: none;
}

.settings-menu .el-menu-item {
  margin: 4px 0;
  border-radius: 6px;
}

.security-settings .security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e4e7ed;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #303133;
}

.security-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.preference-settings,
.notification-settings {
  max-width: 500px;
}

@media (max-width: 768px) {
  .settings-content {
    padding: 20px 16px;
  }
  
  .page-header {
    padding: 40px 20px;
  }
  
  .page-title {
    font-size: 28px;
  }
}
</style>