// 应用常量配置
export const APP_CONFIG = {
  APP_NAME: '诗韵星',
  APP_DESCRIPTION: 'AI驱动诗词解析平台',
  VERSION: '1.0.0'
}

// API配置
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}

// 诗词相关常量
export const POEM_CONSTANTS = {
  DIFFICULTY: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  },
  
  DYNASTIES: [
    '唐代', '宋代', '元代', '明代', '清代', '先秦', '汉代', '魏晋', '南北朝', '隋代'
  ],
  
  TAGS: [
    '思乡', '爱情', '友情', '山水', '田园', '边塞', '咏史', '怀古', '送别', '闺怨',
    '节日', '季节', '动物', '植物', '天气', '哲理', '抒情', '叙事', '写景', '咏物'
  ],
  
  MASTERY_LEVELS: [
    '初级', '中级', '高级', '专家'
  ]
}

// 学习相关常量
export const LEARNING_CONSTANTS = {
  DAILY_GOAL: 3, // 每日学习目标（诗词数量）
  STREAK_REWARD: 7, // 连续学习奖励天数
  PROGRESS_THRESHOLDS: {
    BEGINNER: 25,
    INTERMEDIATE: 50,
    ADVANCED: 75,
    EXPERT: 90
  }
}

// AI相关常量
export const AI_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 1000,
  RESPONSE_DELAY: 1000, // 模拟AI响应延迟
  CONVERSATION_LIMIT: 50 // 单次对话消息限制
}

// 本地存储键名
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'rhyme_star_user_prefs',
  LEARNING_PROGRESS: 'rhyme_star_learning_progress',
  RECENT_POEMS: 'rhyme_star_recent_poems',
  AI_CONVERSATIONS: 'rhyme_star_ai_conversations'
}

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  AUTH_ERROR: '身份验证失败，请重新登录',
  DATA_ERROR: '数据加载失败，请稍后重试',
  AI_SERVICE_ERROR: 'AI服务暂时不可用',
  UNKNOWN_ERROR: '未知错误，请联系客服'
}

// 成功消息
export const SUCCESS_MESSAGES = {
  POEM_SAVED: '诗词已保存',
  ANALYSIS_COMPLETED: '解析完成',
  PROGRESS_UPDATED: '学习进度已更新',
  CONVERSATION_SAVED: '对话已保存'
}

export default {
  APP_CONFIG,
  API_CONFIG,
  POEM_CONSTANTS,
  LEARNING_CONSTANTS,
  AI_CONSTANTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
}