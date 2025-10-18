<template>
  <div class="navbar">
    <div class="navbar-container">
      <!-- Logo区域 -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-logo">
            <el-icon size="24" color="#409eff"><Reading /></el-icon>
          </div>
          <span class="brand-text">诗词分析平台</span>
        </router-link>
      </div>

      <!-- 桌面端导航菜单 -->
      <div class="desktop-nav-menu">
        <router-link to="/poems" class="nav-link">
          <el-icon><Notebook /></el-icon>
          诗词库
        </router-link>
        <router-link to="/ai-chat" class="nav-link">
          <el-icon><ChatDotRound /></el-icon>
          AI助手
        </router-link>
      </div>

      <!-- 桌面端用户菜单 -->
      <div class="desktop-user-menu" v-if="user">
        <el-dropdown @command="handleUserCommand">
          <span class="user-dropdown">
            <el-avatar :size="32" :src="user.avatar_url" class="user-avatar">
              {{ user.username?.charAt(0) || 'U' }}
            </el-avatar>
            <span class="user-name">{{ user.username || '用户' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 桌面端登录/注册按钮 -->
      <div class="auth-buttons" v-else>
        <el-button type="primary" text @click="goToLogin">登录</el-button>
        <el-button type="primary" @click="goToRegister">注册</el-button>
      </div>

      <!-- 移动端菜单按钮 -->
      <div class="mobile-menu">
        <el-dropdown @command="handleMobileCommand">
          <el-button text>
            <el-icon><MoreFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="home">
                <el-icon><House /></el-icon>
                首页
              </el-dropdown-item>
              <el-dropdown-item command="poems">
                <el-icon><Notebook /></el-icon>
                诗词库
              </el-dropdown-item>
              <el-dropdown-item command="ai-chat">
                <el-icon><ChatDotRound /></el-icon>
                AI助手
              </el-dropdown-item>
              <el-dropdown-item command="profile" v-if="user">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item divided command="login" v-if="!user">
                <el-icon><User /></el-icon>
                登录
              </el-dropdown-item>
              <el-dropdown-item command="register" v-if="!user">
                <el-icon><EditPen /></el-icon>
                注册
              </el-dropdown-item>
              <el-dropdown-item command="logout" v-if="user">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  House, Notebook, ChatDotRound, Search, User, Setting, 
  SwitchButton, ArrowDown, MoreFilled, EditPen, Reading 
} from '@element-plus/icons-vue'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const searchQuery = ref('')
const user = ref<any>(null)

onMounted(async () => {
  await checkAuth()
  setupAuthListener()
})

onUnmounted(() => {
  // 清理监听器
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {})
  subscription?.unsubscribe()
})

const checkAuth = async () => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      // 获取用户详细信息
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      user.value = { ...authUser, ...profile }
    } else {
      user.value = null
    }
  } catch (error) {
    console.error('检查认证状态失败:', error)
    user.value = null
  }
}

const setupAuthListener = () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('认证状态变化:', event)
    if (event === 'SIGNED_IN' && session?.user) {
      await checkAuth()
    } else if (event === 'SIGNED_OUT') {
      user.value = null
    }
  })
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/poems?search=${encodeURIComponent(searchQuery.value)}`)
    searchQuery.value = ''
  }
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleMobileCommand = (command: string) => {
  switch (command) {
    case 'home':
      router.push('/')
      break
    case 'poems':
      router.push('/poems')
      break
    case 'ai-chat':
      router.push('/ai-chat')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'login':
      router.push('/login')
      break
    case 'register':
      router.push('/register')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    user.value = null
    ElMessage.success('退出登录成功')
    router.push('/')
  } catch (error: any) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.desktop-nav-menu {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #409eff;
  background: #f5f7fa;
}

.nav-link.router-link-active {
  color: #409eff;
  background: #ecf5ff;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  margin-right: 8px;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.navbar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
}

.search-box {
  width: 300px;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box :deep(.el-input__inner) {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-dropdown:hover {
  background: #f5f7fa;
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  color: #303133;
  margin-right: 4px;
}

.auth-buttons {
  display: flex;
  gap: 8px;
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .navbar-center {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .navbar-container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .brand-text {
    font-size: 16px;
  }
}
</style>