// Supabase 配置和工具函数
import { supabase } from '@/lib/supabase'

// 检查 Supabase 连接状态
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean
  error?: string
  tables?: string[]
}> => {
  try {
    // 测试基本连接
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      return {
        connected: false,
        error: `认证连接失败: ${authError.message}`
      }
    }

    // 测试数据库连接 - 尝试读取诗词表
    const { data: poemsData, error: dbError } = await supabase
      .from('poems')
      .select('id')
      .limit(1)

    if (dbError) {
      return {
        connected: false,
        error: `数据库连接失败: ${dbError.message}`
      }
    }

    // 获取可用表列表
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    const tables = tablesError ? [] : tablesData.map(t => t.table_name)

    return {
      connected: true,
      tables
    }
  } catch (error) {
    return {
      connected: false,
      error: `连接检查异常: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

// 初始化数据库（如果表不存在）
export const initializeDatabase = async (): Promise<{
  success: boolean
  message: string
  tablesCreated?: string[]
}> => {
  try {
    // 检查表是否存在
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    const existingTableNames = existingTables?.map(t => t.table_name) || []
    
    const requiredTables = [
      'users', 'poems', 'poem_analyses', 
      'learning_records', 'ai_conversations', 'ai_messages'
    ]

    const missingTables = requiredTables.filter(table => 
      !existingTableNames.includes(table)
    )

    if (missingTables.length === 0) {
      return {
        success: true,
        message: '所有必需的表已存在',
        tablesCreated: []
      }
    }

    // 如果有缺失的表，提示用户需要运行迁移脚本
    return {
      success: false,
      message: `缺少以下表: ${missingTables.join(', ')}。请运行数据库迁移脚本。`,
      tablesCreated: []
    }
  } catch (error) {
    return {
      success: false,
      message: `数据库初始化失败: ${error instanceof Error ? error.message : '未知错误'}`,
      tablesCreated: []
    }
  }
}

// 插入示例数据
export const insertSampleData = async (): Promise<{
  success: boolean
  message: string
  dataInserted?: {
    poems: number
    users: number
  }
}> => {
  try {
    // 检查诗词表是否为空
    const { data: existingPoems, error: poemsError } = await supabase
      .from('poems')
      .select('id')
      .limit(1)

    if (poemsError) throw poemsError

    // 如果已有数据，跳过插入
    if (existingPoems && existingPoems.length > 0) {
      return {
        success: true,
        message: '示例数据已存在，跳过插入',
        dataInserted: { poems: 0, users: 0 }
      }
    }

    // 插入示例诗词数据
    const samplePoems = [
      {
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
        difficulty: 'easy',
        tags: ['思乡', '月亮', '夜晚']
      },
      {
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代',
        content: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
        difficulty: 'easy',
        tags: ['春天', '自然', '早晨']
      },
      {
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐代',
        content: ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],
        difficulty: 'medium',
        tags: ['登高', '哲理', '壮丽']
      }
    ]

    const { error: insertError } = await supabase
      .from('poems')
      .insert(samplePoems)

    if (insertError) throw insertError

    return {
      success: true,
      message: '示例数据插入成功',
      dataInserted: { poems: samplePoems.length, users: 0 }
    }
  } catch (error) {
    return {
      success: false,
      message: `示例数据插入失败: ${error instanceof Error ? error.message : '未知错误'}`,
      dataInserted: { poems: 0, users: 0 }
    }
  }
}

// 数据库健康检查
export const healthCheck = async (): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  details: {
    auth: boolean
    database: boolean
    tables: string[]
    errors: string[]
  }
}> => {
  const errors: string[] = []
  const details = {
    auth: false,
    database: false,
    tables: [] as string[]
  }

  try {
    // 检查认证服务
    const { error: authError } = await supabase.auth.getSession()
    details.auth = !authError
    if (authError) errors.push(`认证服务: ${authError.message}`)

    // 检查数据库连接
    const { error: dbError } = await supabase
      .from('poems')
      .select('id')
      .limit(1)
    
    details.database = !dbError
    if (dbError) errors.push(`数据库连接: ${dbError.message}`)

    // 获取表列表
    const { data: tablesData } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    details.tables = tablesData?.map(t => t.table_name) || []

    // 确定状态
    const status = errors.length === 0 ? 'healthy' : 
                  details.auth && details.database ? 'degraded' : 'unhealthy'

    return { status, details: { ...details, errors } }
  } catch (error) {
    errors.push(`健康检查异常: ${error instanceof Error ? error.message : '未知错误'}`)
    return { status: 'unhealthy', details: { ...details, errors } }
  }
}

export default {
  checkSupabaseConnection,
  initializeDatabase,
  insertSampleData,
  healthCheck
}