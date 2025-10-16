// AI对话相关类型定义
export interface AIConversation {
  id: string
  userId: string
  poemId: string | null
  title: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
}

export interface AIMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    poemId?: string
    analysisType?: string
    confidence?: number
  }
}

export interface AIResponse {
  id: string
  content: string
  timestamp: Date
  poemId: string | null
  suggestions?: string[]
  relatedPoems?: string[]
}

export interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}

export interface AnalysisRequest {
  poemId: string
  analysisType: 'word' | 'imagery' | 'overall' | 'author' | 'context'
  userInput?: string
  depth: 'basic' | 'detailed' | 'comprehensive'
}

export interface AnalysisResponse {
  id: string
  poemId: string
  analysisType: string
  content: string
  insights: string[]
  examples: string[]
  recommendations: string[]
  confidence: number
  timestamp: Date
}