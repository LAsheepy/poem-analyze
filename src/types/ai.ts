export interface AIConversation {
  id: string
  poemId?: string
  messages: AIMessage[]
  createdAt: Date
  updatedAt?: Date
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AIResponse {
  id: string
  content: string
  timestamp: Date
  poemId?: string
  confidence?: number
  sources?: AISource[]
}

export interface AISource {
  type: 'poem' | 'explanation' | 'historical'
  title: string
  content: string
  relevance: number
}

export interface AILearningPlan {
  id: string
  userId: string
  poemIds: string[]
  schedule: LearningSchedule[]
  createdAt: Date
  updatedAt: Date
}

export interface LearningSchedule {
  poemId: string
  scheduledDate: Date
  completed: boolean
  score?: number
}