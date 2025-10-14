export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  avatar?: string
  learningProgress: number
  interests: string[]
  createdAt: Date
  lastLoginAt: Date
  streakDays?: number
  analyzedPoems?: number
  averageScore?: number
  masteryLevel?: string
  weeklyActivity?: number
  weeklyStudyTime?: number
  completionRate?: number
}

export interface LearningRecord {
  id: string
  userId: string
  username: string
  poemId: string
  poemTitle: string
  score: number
  interpretation: string
  submittedAt: Date
  reviewedAt?: Date
  feedback?: string
}

export interface TeacherDashboard {
  totalStudents: number
  activeStudents: number
  averageScore: number
  recentSubmissions: LearningRecord[]
  riskStudents: RiskStudent[]
}

export interface RiskStudent {
  userId: string
  username: string
  riskLevel: 'low' | 'medium' | 'high'
  lastActivity: Date
  issues: string[]
}