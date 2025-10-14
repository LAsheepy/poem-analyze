<template>
  <div class="teacher-page">
    <el-container>
      <el-header class="page-header">
        <h1>教学管理</h1>
        <div class="header-actions">
          <el-button type="primary" @click="exportReports">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </el-header>

      <el-main>
        <!-- 统计概览 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon students">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ dashboardData.totalStudents }}</div>
                  <div class="stat-label">总学生数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon active">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ dashboardData.activeStudents }}</div>
                  <div class="stat-label">活跃学生</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon score">
                  <el-icon><DataAnalysis /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ dashboardData.averageScore }}</div>
                  <div class="stat-label">平均得分</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon risk">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ dashboardData.riskStudents.length }}</div>
                  <div class="stat-label">风险学生</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 学生列表 -->
        <el-card class="students-card">
          <template #header>
            <div class="card-header">
              <span>学生管理</span>
              <el-input
                v-model="studentSearch"
                placeholder="搜索学生..."
                style="width: 200px"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </template>

          <el-table :data="filteredStudents" style="width: 100%">
            <el-table-column prop="username" label="学生姓名" />
            <el-table-column prop="progress" label="学习进度">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" />
              </template>
            </el-table-column>
            <el-table-column prop="lastActivity" label="最后活动">
              <template #default="{ row }">
                {{ formatDate(row.lastActivity) }}
              </template>
            </el-table-column>
            <el-table-column prop="riskLevel" label="风险等级">
              <template #default="{ row }">
                <el-tag :type="getRiskTagType(row.riskLevel)">
                  {{ row.riskLevel }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="viewStudentDetail(row.id)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 最近提交 -->
        <el-card class="submissions-card">
          <template #header>
            <span>最近提交</span>
          </template>
          <el-table :data="dashboardData.recentSubmissions" style="width: 100%">
            <el-table-column prop="username" label="学生" />
            <el-table-column prop="poemTitle" label="诗词" />
            <el-table-column prop="score" label="得分">
              <template #default="{ row }">
                <el-tag :type="getScoreTagType(row.score)">
                  {{ row.score }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="submittedAt" label="提交时间">
              <template #default="{ row }">
                {{ formatDate(row.submittedAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button size="small" @click="reviewSubmission(row.id)">
                  查看解析
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TeacherDashboard } from '@/types/user'

const studentSearch = ref('')

// 模拟教师仪表板数据
const dashboardData = ref<TeacherDashboard>({
  totalStudents: 45,
  activeStudents: 32,
  averageScore: 78,
  recentSubmissions: [
    { id: '1', userId: '1', username: '张三', poemId: '1', poemTitle: '静夜思', score: 85, interpretation: '用户对静夜思的解析', submittedAt: new Date() },
    { id: '2', userId: '2', username: '李四', poemId: '2', poemTitle: '春晓', score: 92, interpretation: '用户对春晓的解析', submittedAt: new Date(Date.now() - 86400000) },
    { id: '3', userId: '3', username: '王五', poemId: '3', poemTitle: '登鹳雀楼', score: 67, interpretation: '用户对登鹳雀楼的解析', submittedAt: new Date(Date.now() - 172800000) }
  ],
  riskStudents: [
    { userId: '4', username: '赵六', riskLevel: 'high', lastActivity: new Date(Date.now() - 604800000), issues: ['长期未活动', '解析成绩差'] }
  ]
})

// 模拟学生数据
const students = ref([
  { id: '1', username: '张三', progress: 75, lastActivity: new Date(), riskLevel: 'low' },
  { id: '2', username: '李四', progress: 92, lastActivity: new Date(), riskLevel: 'low' },
  { id: '3', username: '王五', progress: 67, lastActivity: new Date(Date.now() - 86400000), riskLevel: 'medium' },
  { id: '4', username: '赵六', progress: 45, lastActivity: new Date(Date.now() - 604800000), riskLevel: 'high' }
])

const filteredStudents = computed(() => {
  if (!studentSearch.value) return students.value
  return students.value.filter(student => 
    student.username.includes(studentSearch.value)
  )
})

const getRiskTagType = (riskLevel: string) => {
  const map: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  }
  return map[riskLevel] || 'info'
}

const getScoreTagType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN')
}

const exportReports = () => {
  // 导出报告逻辑
  console.log('导出报告')
}

const viewStudentDetail = (studentId: string) => {
  // 查看学生详情
  console.log('查看学生详情:', studentId)
}

const reviewSubmission = (submissionId: string) => {
  // 查看解析详情
  console.log('查看解析:', submissionId)
}
</script>

<style lang="scss" scoped>
.teacher-page {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    h1 {
      margin: 0;
      color: #303133;
    }
  }
  
  .stats-row {
    margin-bottom: 20px;
    
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 15px;
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #fff;
          
          &.students { background: #409eff; }
          &.active { background: #67c23a; }
          &.score { background: #e6a23c; }
          &.risk { background: #f56c6c; }
        }
        
        .stat-info {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
          }
          
          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
  
  .students-card,
  .submissions-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>