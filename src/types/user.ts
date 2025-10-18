// 用户相关类型定义
export interface User {
  bio?: string
  id: string
  username: string
  email: string
  role: 'student' | 'teacher'
  avatar_url: string | null
  learning_progress: number
  streak_days: number
  analyzed_poems: number
  average_score: number
  mastery_level: string
  weekly_activity: number
  weekly_study_time: number
  completion_rate: number
  interests: string[]
  created_at: string
  updated_at: string
  last_login_at: string
}

export interface UserProfile extends Omit<User, 'id' | 'created_at' | 'updated_at'> {
  total_study_time: number
  favorite_poems: string[]
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  progress: number
  target: number
}

export interface LearningStats {
  total_poems: number
  total_time: number
  average_score: number
  completion_rate: number
  streak_days: number
  weekly_activity: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh' | 'en'
  notifications: {
    email: boolean
    push: boolean
    studyReminders: boolean
  }
  studyGoals: {
    dailyTime: number
    weeklyPoems: number
    targetLevel: string
  }
}