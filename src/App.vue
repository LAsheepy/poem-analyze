3<template>
  <div id="app">
    <Navbar />
    <main class="app-main">
      <router-view />
      <AuthModal 
        v-model="showAuthModal" 
        @auth-success="handleAuthSuccess"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import AuthModal from '@/components/Auth/AuthModal.vue'
import Navbar from '@/components/Layout/Navbar.vue'

const router = useRouter()
const appStore = useAppStore()
const showAuthModal = ref(false)

// 检查认证状态并显示登录模态框
const checkAuthAndShowModal = () => {
  if (!appStore.userStore.isAuthenticated) {
    showAuthModal.value = true
  }
}

const handleAuthSuccess = () => {
  showAuthModal.value = false
  // 重新加载当前路由以更新界面
  router.go(0)
}

// 监听路由变化，在需要认证的页面检查登录状态
onMounted(() => {
  // 可以根据当前路由决定是否显示登录模态框
  const currentRoute = router.currentRoute.value
  const requiresAuth = currentRoute.meta?.requiresAuth
  
  if (requiresAuth && !appStore.userStore.isAuthenticated) {
    showAuthModal.value = true
  }
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f5f7fa;
}

.app-main {
  min-height: calc(100vh - 64px);
}
</style>