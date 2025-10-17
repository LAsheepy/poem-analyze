// 用户相关类型定义
export interface User {
  bio: string
  id: string
  username: string
  email: string
  role: 'student' | 'teacher'
  avatarUrl: string | null
  learningProgress: number
  streakDays: number
  analyzedPoems: number
  averageScore: number
  masteryLevel: string
  weeklyActivity: number
  weeklyStudyTime: number
  completionRate: number
  interests: string[]
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export interface UserProfile extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  totalStudyTime: number
  favoritePoems: string[]
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
  totalPoems: number
  totalTime: number
  averageScore: number
  completionRate: number
  streakDays: number
  weeklyActivity: number
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