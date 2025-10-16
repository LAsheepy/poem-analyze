<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1 class="register-title">注册诗词分析平台</h1>
          <p class="register-subtitle">开启您的诗词学习之旅</p>
        </div>

        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="registerForm.agreeTerms">
              我已阅读并同意
              <router-link to="/terms" class="link">服务条款</router-link>
              和
              <router-link to="/privacy" class="link">隐私政策</router-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              :disabled="!registerForm.agreeTerms"
              @click="handleRegister"
              class="register-button"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <p class="login-link">
            已有账号？
            <router-link to="/login" class="link">立即登录</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    
    if (!registerForm.agreeTerms) {
      ElMessage.warning('请同意服务条款和隐私政策')
      return
    }

    loading.value = true

    // 先尝试直接登录（如果用户已存在）
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: registerForm.email,
      password: registerForm.password
    })

    if (loginData?.user) {
      // 用户已存在，直接登录成功
      ElMessage.success('登录成功！')
      router.push('/')
      return
    }

    // 如果登录失败，尝试注册新用户
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: {
          username: registerForm.username
        }
      }
    })

    if (error) {
      // 检查具体错误类型
      if (error.message.includes('User already registered')) {
        ElMessage.error('该邮箱已被注册，请直接登录')
        return
      } else if (error.message.includes('confirmation email')) {
        // 邮箱验证错误，提供替代方案
        ElMessage.warning('邮箱验证服务暂时不可用，正在尝试直接创建用户...')
        
        // 尝试使用管理员API（如果可用）
        // 这里我们提供一个简单的解决方案：提示用户稍后重试
        throw new Error('注册服务暂时不可用，请稍后重试或联系管理员配置SMTP服务')
      }
      throw error
    }

    if (data.user) {
      // 注册成功，检查是否需要邮箱验证
      if (data.user.identities && data.user.identities.length > 0) {
        // 用户已创建，尝试立即登录
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: registerForm.email,
          password: registerForm.password
        })

        if (signInError) {
          // 如果登录失败，说明需要邮箱验证
          ElMessage.success('注册成功！请检查您的邮箱完成验证，然后重新登录')
          router.push('/login')
          return
        }

        // 登录成功
        ElMessage.success('注册成功！已自动登录')
        router.push('/')
      } else {
        // 需要邮箱验证
        ElMessage.success('注册成功！请检查您的邮箱完成验证')
        router.push('/login')
      }
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    ElMessage.error(error.message || '注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.register-subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.register-form {
  margin-bottom: 24px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.register-footer {
  text-align: center;
}

.login-link {
  margin: 0;
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

:deep(.el-checkbox__label) {
  font-size: 14px;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 24px;
  }
}
</style>