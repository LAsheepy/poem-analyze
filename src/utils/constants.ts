// 应用常量定义

// 用户角色
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
} as const

// 诗词难度等级
export const POEM_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

// 风险等级
export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

// 学习状态
export const LEARNING_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const

// AI对话角色
export const AI_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
} as const

// 诗词朝代
export const DYNASTIES = [
  '先秦', '秦汉', '魏晋', '南北朝', '隋代', '唐代', '五代', '宋代',
  '辽代', '金代', '元代', '明代', '清代', '近代', '现代', '当代'
] as const

// 诗词类型标签
export const POEM_TAGS = [
  '山水', '田园', '边塞', '咏史', '咏物', '抒情', '叙事', '哲理',
  '爱情', '友情', '亲情', '思乡', '爱国', '节日', '季节', '人生'
] as const

// 页面路由
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  POEMS: '/poems',
  TEACHER: '/teacher',
  ANALYSIS: '/analysis'
} as const

// API端点
export const API_ENDPOINTS = {
  USERS: '/users',
  POEMS: '/poems',
  AI: '/ai',
  TEACHER: '/teacher'
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  USER_TOKEN: 'rhyme_star_token',
  USER_INFO: 'rhyme_star_user',
  AI_CONVERSATION: 'rhyme_star_conversation',
  LEARNING_PROGRESS: 'rhyme_star_progress'
} as const

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UNAUTHORIZED: '未授权访问，请重新登录',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误',
  AI_SERVICE_UNAVAILABLE: 'AI服务暂时不可用'
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  SUBMISSION_SUCCESS: '提交成功',
  UPDATE_SUCCESS: '更新成功'
} as const

// 默认配置
export const DEFAULT_CONFIG = {
  PAGE_SIZE: 10,
  AI_RESPONSE_TIMEOUT: 30000, // 30秒
  MAX_CONVERSATION_LENGTH: 100,
  AUTO_SAVE_INTERVAL: 30000 // 30秒自动保存
} as const