<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">登录诗词分析平台</h1>
          <p class="login-subtitle">开始您的诗词学习之旅</p>
        </div>

        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-button"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <p class="register-link">
            还没有账号？
            <router-link to="/register" class="link">立即注册</router-link>
          </p>
          
          <div class="social-login">
            <el-divider>或使用第三方登录</el-divider>
            <div class="social-buttons">
              <el-button class="social-button github" @click="loginWithGithub">
                <el-icon><Github /></el-icon>
                GitHub
              </el-button>
              <el-button class="social-button google" @click="loginWithGoogle">
                <el-icon><ChromeFilled /></el-icon>
                Google
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Github, ChromeFilled } from '@element-plus/icons-vue'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    })

    if (error) {
      throw error
    }

    if (data.user) {
      ElMessage.success('登录成功')
      router.push('/')
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查邮箱和密码')
  } finally {
    loading.value = false
  }
}

const loginWithGithub = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
  } catch (error: any) {
    console.error('GitHub登录失败:', error)
    ElMessage.error('GitHub登录失败')
  }
}

const loginWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
  } catch (error: any) {
    console.error('Google登录失败:', error)
    ElMessage.error('Google登录失败')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.login-subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.login-footer {
  text-align: center;
}

.register-link {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #606266;
}

.link {
  color: #409eff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.social-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.social-button {
  flex: 1;
}

.social-button.github {
  background: #333;
  border-color: #333;
  color: white;
}

.social-button.github:hover {
  background: #555;
  border-color: #555;
}

.social-button.google {
  background: #db4437;
  border-color: #db4437;
  color: white;
}

.social-button.google:hover {
  background: #e57368;
  border-color: #e57368;
}

:deep(.el-divider__text) {
  background: white;
  padding: 0 12px;
  font-size: 12px;
  color: #909399;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 24px;
  }
  
  .social-buttons {
    flex-direction: column;
  }
}
</style>