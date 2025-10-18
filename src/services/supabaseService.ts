import { supabase, type User, type Poem, type PoemAnalysis, type LearningRecord } from '@/lib/supabase'

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

export default {
  user: userService,
  poem: poemService,
  analysis: analysisService,
  learning: learningService
}