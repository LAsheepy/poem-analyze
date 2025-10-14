import type { User, LearningRecord, Poem, AIConversation } from '@/types'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// 通用请求函数
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 用户相关API
export const userAPI = {
  // 获取当前用户信息
  getCurrentUser: () => request<User>('/users/me'),
  
  // 更新用户信息
  updateUser: (userData: Partial<User>) => 
    request<User>('/users/me', { method: 'PUT', body: JSON.stringify(userData) }),
  
  // 获取学习记录
  getLearningRecords: (userId: string) => 
    request<LearningRecord[]>(`/users/${userId}/records`),
}

// 诗词相关API
export const poemAPI = {
  // 获取诗词列表
  getPoems: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.search) query.append('search', params.search)
    
    return request<Poem[]>(`/poems?${query.toString()}`)
  },
  
  // 获取单个诗词详情
  getPoem: (poemId: string) => request<Poem>(`/poems/${poemId}`),
  
  // 提交诗词解析
  submitInterpretation: (poemId: string, interpretation: string) =>
    request<LearningRecord>(`/poems/${poemId}/interpretations`, {
      method: 'POST',
      body: JSON.stringify({ interpretation }),
    }),
}

// AI相关API
export const aiAPI = {
  // 发送消息给AI
  sendMessage: (message: string, conversationId?: string, poemId?: string) =>
    request<{ response: string; conversationId: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId, poemId }),
    }),
  
  // 获取对话历史
  getConversations: () => request<AIConversation[]>('/ai/conversations'),
  
  // 获取个性化学习计划
  getLearningPlan: () => request<any>('/ai/learning-plan'),
}

// 教师相关API
export const teacherAPI = {
  // 获取教师仪表板数据
  getDashboard: () => request<any>('/teacher/dashboard'),
  
  // 获取学生列表
  getStudents: (classId?: string) => {
    const query = classId ? `?classId=${classId}` : ''
    return request<any[]>(`/teacher/students${query}`)
  },
  
  // 获取学生详情
  getStudentDetail: (studentId: string) =>
    request<any>(`/teacher/students/${studentId}`),
}

export default {
  user: userAPI,
  poem: poemAPI,
  ai: aiAPI,
  teacher: teacherAPI,
}