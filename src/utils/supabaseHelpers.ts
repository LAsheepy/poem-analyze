import { supabase } from '@/lib/supabase'

// Supabase 工具函数

/**
 * 处理Supabase错误
 */
export function handleSupabaseError(error: any, defaultMessage = '操作失败'): string {
  console.error('Supabase错误:', error)
  
  if (error?.message) {
    return error.message
  }
  
  if (error?.code) {
    switch (error.code) {
      case '23505': // 唯一约束违反
        return '数据已存在'
      case '23503': // 外键约束违反
        return '关联数据不存在'
      case '42501': // 权限不足
        return '权限不足，无法执行此操作'
      case 'PGRST301': // 未找到
        return '请求的资源不存在'
      default:
        return defaultMessage
    }
  }
  
  return defaultMessage
}

/**
 * 检查用户是否已登录
 */
export async function checkAuthStatus() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    throw new Error('认证状态检查失败')
  }
  
  return {
    isAuthenticated: !!session,
    user: session?.user || null
  }
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(file: File, userId: string) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // 获取公开URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('头像上传失败:', error)
    throw error
  }
}

/**
 * 分页查询工具
 */
export async function paginatedQuery<T>(
  query: any,
  page: number = 1,
  pageSize: number = 10
): Promise<{
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
}> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .range(from, to)
    .select('*', { count: 'exact' })

  if (error) {
    throw error
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    hasNext: (from + pageSize) < (count || 0)
  }
}

/**
 * 实时订阅工具
 */
export function createRealtimeSubscription(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) {
  return supabase
    .channel('table-changes')
    .on(
      'postgres_changes',
      {
        event,
        schema: 'public',
        table
      },
      callback
    )
    .subscribe()
}

/**
 * 批量插入数据
 */
export async function batchInsert<T>(
  table: string,
  data: T[],
  batchSize: number = 100
) {
  const results = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(batch)
      .select()

    if (error) {
      throw error
    }

    results.push(...(inserted || []))
  }

  return results
}

/**
 * 搜索工具（全文搜索）
 */
export async function searchPoems(
  query: string,
  fields: string[] = ['title', 'author', 'content'],
  limit: number = 10
) {
  // 构建搜索条件
  const orConditions = fields.map(field => 
    `${field}.ilike.%${query}%`
  ).join(',')

  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .or(orConditions)
    .limit(limit)

  if (error) {
    throw error
  }

  return data || []
}

/**
 * 获取用户统计信息
 */
export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_id: userId })

  if (error) {
    throw error
  }

  return data
}

/**
 * 数据验证工具
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function validateUsername(username: string): boolean {
  return username.length >= 2 && username.length <= 20
}

/**
 * 缓存工具
 */
export class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private ttl: number

  constructor(ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.ttl = ttl
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

// 创建全局缓存实例
export const globalCache = new SimpleCache(10 * 60 * 1000) // 10分钟缓存