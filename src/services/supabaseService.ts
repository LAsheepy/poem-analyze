import { supabase, type User, type Poem, type PoemAnalysis, type LearningRecord, type AIConversation, type AIMessage } from '@/lib/supabase'
import { n8nService } from './n8nService'

// 用户服务
export const userService = {
  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data
  },
  
  // 创建或更新用户
  async upsertUser(userData: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...userData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // 更新学习进度
  async updateLearningProgress(progress: number): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        learning_progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// 诗词服务
export const poemService = {
  // 获取诗词列表
  async getPoems(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    dynasty?: string;
    difficulty?: string;
  }): Promise<Poem[]> {
    let query = supabase.from('poems').select('*')
    
    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,author.ilike.%${params.search}%,tags.cs.{${params.search}}`)
    }
    
    if (params?.dynasty) {
      query = query.eq('dynasty', params.dynasty)
    }
    
    if (params?.difficulty) {
      query = query.eq('difficulty', params.difficulty)
    }
    
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit
      const to = from + params.limit - 1
      query = query.range(from, to)
    }
    
    query = query.order('created_at', { ascending: false })
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
  
  // 获取单个诗词
  async getPoem(id: string): Promise<Poem> {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  // 增加诗词浏览量
  async incrementViews(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_views', { poem_id: id })
    if (error) throw error
  },
  
  // 点赞诗词
  async likePoem(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_likes', { poem_id: id })
    if (error) throw error
  }
}

// 诗词解析服务
export const analysisService = {
  // 获取诗词解析
  async getAnalysis(poemId: string, userId: string): Promise<PoemAnalysis | null> {
    const { data, error } = await supabase
      .from('poem_analyses')
      .select('*')
      .eq('poem_id', poemId)
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 表示没有找到记录
    return data
  },
  
  // 创建或更新解析
  async upsertAnalysis(analysisData: Partial<PoemAnalysis>): Promise<PoemAnalysis> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('poem_analyses')
      .upsert({
        ...analysisData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// 学习记录服务
export const learningService = {
  // 创建学习记录
  async createRecord(recordData: Omit<LearningRecord, 'id' | 'created_at'>): Promise<LearningRecord> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('learning_records')
      .insert({
        ...recordData,
        user_id: user.id
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // 获取用户学习记录
  async getUserRecords(): Promise<LearningRecord[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('learning_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// AI对话服务
export const aiService = {
  // 获取用户对话列表
  async getConversations(): Promise<AIConversation[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },
  
  // 创建对话
  async createConversation(poemId?: string): Promise<AIConversation> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('用户未登录')
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        poem_id: poemId || null,
        title: '新对话'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // 获取对话消息
  async getMessages(conversationId: string): Promise<AIMessage[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },
  
  // 发送消息
  async sendMessage(conversationId: string, content: string, role: 'user' | 'assistant' = 'user'): Promise<AIMessage> {
    // 保存用户消息到数据库
    const { data: userMessage, error: userError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content
      })
      .select()
      .single()
    
    if (userError) throw userError
    
    // 如果是用户消息，调用 AI 助手获取响应
    if (role === 'user') {
      try {
        // 调用 n8n AI 助手获取响应
        const aiResponse = await n8nService.sendMessage(content, conversationId)
        
        // 保存 AI 响应到数据库
        const { data: aiMessage, error: aiError } = await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: aiResponse
          })
          .select()
          .single()
        
        if (aiError) throw aiError
        
        // 更新对话时间
        await supabase
          .from('ai_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
        
        return aiMessage
      } catch (error) {
        console.error('AI 助手调用失败:', error)
        
        // 如果 AI 调用失败，返回一个默认响应
        const { data: fallbackMessage, error: fallbackError } = await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: '抱歉，AI 助手暂时无法响应，请稍后重试。'
          })
          .select()
          .single()
        
        if (fallbackError) throw fallbackError
        return fallbackMessage
      }
    }
    
    // 更新对话时间
    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
    
    return userMessage
  }
}

export default {
  user: userService,
  poem: poemService,
  analysis: analysisService,
  learning: learningService,
  ai: aiService
}