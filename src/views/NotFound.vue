<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">页面未找到</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移动。
        </p>
        <div class="action-buttons">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
      </div>
      
      <div class="illustration">
        <div class="poem-illustration">
          <div class="book"></div>
          <div class="quill"></div>
          <div class="ink"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HomeFilled, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1000px;
  width: 100%;
  align-items: center;
}

.not-found-content {
  color: white;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 20px;
  opacity: 0.9;
}

.error-title {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 18px;
  opacity: 0.8;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.illustration {
  display: flex;
  justify-content: center;
  align-items: center;
}

.poem-illustration {
  position: relative;
  width: 300px;
  height: 300px;
}

.book {
  position: absolute;
  width: 200px;
  height: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transform: rotate(-5deg);
}

.book::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0 0%, #ffffff 100%);
  border-radius: 8px;
}

.book::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
}

.quill {
  position: absolute;
  top: 50px;
  right: 30px;
  width: 100px;
  height: 8px;
  background: #8B4513;
  border-radius: 4px;
  transform: rotate(45deg);
}

.quill::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 0;
  width: 120px;
  height: 4px;
  background: #8B4513;
  transform: rotate(-45deg);
}

.quill::after {
  content: '';
  position: absolute;
  top: -25px;
  left: 20px;
  width: 80px;
  height: 2px;
  background: #8B4513;
  transform: rotate(-45deg);
}

.ink {
  position: absolute;
  bottom: 30px;
  left: 50px;
  width: 40px;
  height: 40px;
  background: #2c3e50;
  border-radius: 50%;
  animation: drip 2s infinite;
}

.ink::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 10px;
  width: 20px;
  height: 30px;
  background: #2c3e50;
  border-radius: 50% 50% 0 0;
}

@keyframes drip {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(10px) scale(0.95);
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .not-found-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 28px;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .poem-illustration {
    width: 200px;
    height: 200px;
  }
  
  .book {
    width: 150px;
    height: 200px;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .el-button {
    width: 200px;
  }
}
</style>