import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// 开发环境使用模拟配置，避免错误
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 检查是否为演示配置
if (supabaseUrl.includes('demo.supabase.co')) {
  console.warn('⚠️ 使用演示Supabase配置，请配置真实环境变量')
}

// 数据库表类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      poems: {
        Row: {
          id: string
          title: string
          author: string
          dynasty: string
          content: string[]
          translation: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          tags: string[]
          views: number
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['poems']['Row'], 'id' | 'created_at' | 'updated_at' | 'views' | 'likes'>
        Update: Partial<Database['public']['Tables']['poems']['Insert']>
      }
      poem_analyses: {
        Row: {
          id: string
          poem_id: string
          user_id: string
          word_analysis: any
          imagery_analysis: any
          overall_analysis: any
          author_info: any
          historical_context: any
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['poem_analyses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['poem_analyses']['Insert']>
      }
      learning_records: {
        Row: {
          id: string
          user_id: string
          poem_id: string
          analysis_id: string | null
          score: number
          time_spent: number
          completed: boolean
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['learning_records']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['learning_records']['Insert']>
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          poem_id: string | null
          title: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>
      }
      ai_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_messages']['Insert']>
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Poem = Database['public']['Tables']['poems']['Row']
export type PoemAnalysis = Database['public']['Tables']['poem_analyses']['Row']
export type LearningRecord = Database['public']['Tables']['learning_records']['Row']
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row']
export type AIMessage = Database['public']['Tables']['ai_messages']['Row']