<template>
  <div class="progress-chart">
    <el-card header="学习进度">
      <div class="chart-container">
        <div class="chart-row">
          <div class="chart-item">
            <div class="chart-title">本周学习时间</div>
            <div class="chart-value">{{ formatTime(userStore.user?.weekly_study_time || 0) }}</div>
            <el-progress 
              :percentage="getStudyPercentage()" 
              :stroke-width="8"
              :color="customColors"
            />
          </div>
          
          <div class="chart-item">
            <div class="chart-title">诗词掌握度</div>
            <div class="chart-value">{{ userStore.user?.mastery_level || '初级' }}</div>
            <el-progress 
              :percentage="getMasteryPercentage()" 
              :stroke-width="8"
              :color="customColors"
              status="success"
            />
          </div>
        </div>
        
        <div class="chart-row">
          <div class="chart-item">
            <div class="chart-title">连续学习天数</div>
            <div class="chart-value">{{ userStore.user?.streak_days || 0 }} 天</div>
            <el-progress 
              :percentage="Math.min((userStore.user?.streak_days || 0) * 10, 100)" 
              :stroke-width="8"
              :color="customColors"
            />
          </div>
          
          <div class="chart-item">
            <div class="chart-title">完成率</div>
            <div class="chart-value">{{ userStore.user?.completion_rate || 0 }}%</div>
            <el-progress 
              :percentage="userStore.user?.completion_rate || 0" 
              :stroke-width="8"
              :color="customColors"
            />
          </div>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ userStore.user?.analyzed_poems || 0 }}</div>
          <div class="stat-label">已解析诗词</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStore.user?.weekly_activity || 0 }}</div>
          <div class="stat-label">本周活跃度</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStore.user?.average_score || 0 }}</div>
          <div class="stat-label">平均得分</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStore.user?.learning_progress || 0 }}%</div>
          <div class="stat-label">学习进度</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 方法
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
}

const getStudyPercentage = () => {
  const studyTime = userStore.user?.weekly_study_time || 0
  // 假设目标为10小时/周
  const targetMinutes = 600
  return Math.min((studyTime / targetMinutes) * 100, 100)
}

const getMasteryPercentage = () => {
  const level = userStore.user?.mastery_level
  const levelMap: Record<string, number> = {
    '初级': 25,
    '中级': 50, 
    '高级': 75,
    '专家': 100
  }
  return levelMap[level] || 0
}
</script>

<style scoped>
.progress-chart {
  width: 100%;
}

.chart-container {
  margin-bottom: 24px;
}

.chart-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-item {
  flex: 1;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.chart-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.chart-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .chart-row {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>