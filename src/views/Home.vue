<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            诗韵星
            <span class="title-sub">AI驱动诗词解析平台</span>
          </h1>
          <p class="hero-description">
            探索古典诗词的无限魅力，AI智能解析助您深入理解诗词精髓
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="startLearning">
              <el-icon><Reading /></el-icon>
              开始学习
            </el-button>
            <el-button size="large" @click="explorePoems">
              <el-icon><Collection /></el-icon>
              浏览诗词
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="card card-1" :style="{ animationDelay: '0s' }">
              <div class="card-content">
                <h4>静夜思</h4>
                <p>李白 · 唐代</p>
              </div>
            </div>
            <div class="card card-2" :style="{ animationDelay: '0.5s' }">
              <div class="card-content">
                <h4>春晓</h4>
                <p>孟浩然 · 唐代</p>
              </div>
            </div>
            <div class="card card-3" :style="{ animationDelay: '1s' }">
              <div class="card-content">
                <h4>登鹳雀楼</h4>
                <p>王之涣 · 唐代</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性介绍 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">
              <el-icon :size="40">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">立即开始您的诗词之旅</h2>
        <p class="cta-description">加入数千名诗词爱好者，体验AI驱动的智能解析</p>
        <el-button type="primary" size="large" @click="startLearning">
          免费开始使用
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Reading,
  Collection,
  ChatDotRound,
  Star,
  TrendCharts,
  User
} from '@element-plus/icons-vue'

const router = useRouter()

const features = [
  {
    icon: ChatDotRound,
    title: 'AI智能解析',
    description: '基于先进AI技术，提供深度诗词解析和个性化学习建议'
  },
  {
    icon: Star,
    title: '个性化推荐',
    description: '根据您的学习进度和兴趣，智能推荐适合的诗词作品'
  },
  {
    icon: TrendCharts,
    title: '学习追踪',
    description: '实时追踪学习进度，可视化展示学习成果和成长轨迹'
  },
  {
    icon: User,
    title: '导师指导',
    description: '专业教师团队提供指导，AI助手24小时在线答疑'
  }
]

const stats = [
  { value: '1000+', label: '经典诗词' },
  { value: '5000+', label: '活跃用户' },
  { value: '98%', label: '用户满意度' },
  { value: '24/7', label: 'AI服务' }
]

const startLearning = () => {
  router.push('/dashboard')
}

const explorePoems = () => {
  router.push('/poems')
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: white;
  
  .hero-content {
    max-width: 1200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  
  .hero-text {
    .hero-title {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 20px 0;
      line-height: 1.2;
      animation: fadeInUp 0.8s ease-out;
      
      .title-sub {
        display: block;
        font-size: 24px;
        font-weight: 400;
        opacity: 0.9;
        margin-top: 10px;
      }
    }
    
    .hero-description {
      font-size: 18px;
      line-height: 1.6;
      margin: 0 0 40px 0;
      opacity: 0.9;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }
    
    .hero-actions {
      display: flex;
      gap: 20px;
      animation: fadeInUp 0.8s ease-out 0.4s both;
      
      .el-button {
        padding: 15px 30px;
        font-size: 16px;
        border-radius: 25px;
        
        &.el-button--primary {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
        }
        
        &.el-button--default {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  .hero-visual {
    .floating-cards {
      position: relative;
      height: 400px;
      
      .card {
        position: absolute;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: float 3s ease-in-out infinite;
        
        &.card-1 {
          top: 20%;
          left: 10%;
          width: 200px;
          animation-delay: 0s;
        }
        
        &.card-2 {
          top: 50%;
          right: 20%;
          width: 180px;
          animation-delay: 0.5s;
        }
        
        &.card-3 {
          bottom: 20%;
          left: 30%;
          width: 220px;
          animation-delay: 1s;
        }
        
        .card-content {
          h4 {
            margin: 0 0 8px 0;
            color: #303133;
            font-size: 16px;
          }
          
          p {
            margin: 0;
            color: #909399;
            font-size: 14px;
          }
        }
      }
    }
  }
}

.features-section {
  padding: 100px 20px;
  background: rgba(255, 255, 255, 0.95);
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .section-title {
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 60px 0;
    color: #303133;
    animation: fadeInUp 0.8s ease-out;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
    
    .feature-card {
      text-align: center;
      padding: 40px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      animation: fadeInUp 0.8s ease-out;
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }
      
      .feature-icon {
        margin-bottom: 20px;
        color: #667eea;
      }
      
      .feature-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 15px 0;
        color: #303133;
      }
      
      .feature-description {
        font-size: 14px;
        line-height: 1.6;
        color: #606266;
        margin: 0;
      }
    }
  }
}

.stats-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    text-align: center;
    
    .stat-item {
      animation: fadeInUp 0.8s ease-out;
      
      .stat-value {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 10px;
        background: linear-gradient(45deg, #fff, #f0f0f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .stat-label {
        font-size: 16px;
        opacity: 0.9;
      }
    }
  }
}

.cta-section {
  padding: 100px 20px;
  background: rgba(255, 255, 255, 0.95);
  text-align: center;
  
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cta-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #303133;
    animation: fadeInUp 0.8s ease-out;
  }
  
  .cta-description {
    font-size: 18px;
    color: #606266;
    margin: 0 0 40px 0;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .el-button {
    padding: 15px 40px;
    font-size: 16px;
    border-radius: 25px;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hero-section {
    .hero-content {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }
    
    .hero-text {
      .hero-title {
        font-size: 36px;
        
        .title-sub {
          font-size: 18px;
        }
      }
      
      .hero-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
    
    .hero-visual {
      .floating-cards {
        height: 300px;
        
        .card {
          width: 150px !important;
          
          &.card-1 {
            left: 5%;
          }
          
          &.card-2 {
            right: 5%;
          }
          
          &.card-3 {
            left: 20%;
          }
        }
      }
    }
  }
  
  .features-section {
    padding: 60px 20px;
    
    .section-title {
      font-size: 28px;
    }
  }
  
  .stats-section {
    padding: 60px 20px;
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      
      .stat-item .stat-value {
        font-size: 36px;
      }
    }
  }
  
  .cta-section {
    padding: 60px 20px;
    
    .cta-title {
      font-size: 28px;
    }
  }
}
</style>