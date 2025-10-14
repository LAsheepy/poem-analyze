<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <p>欢迎使用诗韵星 - AI驱动诗词解析平台</p>
    
    <div class="features">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <el-icon><Reading /></el-icon>
                <span>智能解析</span>
              </div>
            </template>
            <p>AI驱动的个性化诗词解析，帮助您深入理解古典诗词</p>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <el-icon><User /></el-icon>
                <span>个性化学习</span>
              </div>
            </template>
            <p>根据您的学习进度和兴趣，定制专属的学习路径</p>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <el-icon><TrendCharts /></el-icon>
                <span>进度跟踪</span>
              </div>
            </template>
            <p>实时跟踪学习进度，提供详细的学习报告和分析</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="actions">
      <el-button type="primary" size="large" @click="startLearning">
        开始学习
      </el-button>
      <el-button size="large" @click="viewDemo">
        查看演示
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{
  msg: string
}>()

const router = useRouter()

const startLearning = () => {
  router.push('/poems')
}

const viewDemo = () => {
  // 查看演示逻辑
  console.log('查看演示')
}
</script>

<style lang="scss" scoped>
.hello-world {
  text-align: center;
  padding: 40px 20px;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 20px;
    font-size: 2.5rem;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--text-regular);
    margin-bottom: 40px;
  }
  
  .features {
    margin: 40px 0;
    
    .feature-card {
      height: 200px;
      display: flex;
      flex-direction: column;
      
      .feature-header {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .el-icon {
          font-size: 24px;
          color: var(--primary-color);
        }
        
        span {
          font-weight: bold;
          font-size: 1.1rem;
        }
      }
      
      p {
        flex: 1;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: left;
        line-height: 1.6;
      }
    }
  }
  
  .actions {
    margin-top: 40px;
    
    .el-button {
      margin: 0 10px;
    }
  }
}
</style>